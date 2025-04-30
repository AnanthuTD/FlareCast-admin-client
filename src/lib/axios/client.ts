import { createBaseAxiosInstance } from "./base";
import { AxiosInstance, AxiosRequestConfig } from "axios";

const excludeFromAuth = [
	"/signin",
	"/signup",
	"/verification/email/success",
	"/verification/email/failure",
	"/verification/email/notify",
	"/verification/invitation",
	"/",
];

interface RefreshState {
	isRefreshing: boolean;
	refreshSubscribers: (() => void)[];
}

const refreshState: RefreshState = {
	isRefreshing: false,
	refreshSubscribers: [],
};

const onTokenRefreshed = () => {
	refreshState.refreshSubscribers.forEach((callback) => callback());
	refreshState.refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: () => void) => {
	refreshState.refreshSubscribers.push(callback);
};

export const createClientAxiosInstance = (): AxiosInstance => {
	const axiosInstance = createBaseAxiosInstance();

	axiosInstance.interceptors.response.use(
		(response) => response,
		async (error) => {
			const originalRequest = error.config as AxiosRequestConfig & {
				_retry?: boolean;
			};

			if (error.response?.status === 401 && !originalRequest._retry) {
				if (refreshState.isRefreshing) {
					return new Promise((resolve) => {
						addRefreshSubscriber(() => {
							resolve(axiosInstance(originalRequest));
						});
					});
				}

				originalRequest._retry = true;
				refreshState.isRefreshing = true;

				try {
					await axiosInstance.post("/api/users/auth/refresh-token");

					onTokenRefreshed();
					refreshState.isRefreshing = false;

					return axiosInstance(originalRequest);
				} catch (refreshError) {
					refreshState.isRefreshing = false;

					// Redirect to sign-in for protected routes
					if (
						typeof window !== "undefined" &&
						!excludeFromAuth.includes(window.location.pathname)
					) {
						window.location.href = "/signin";
					}

					return Promise.reject(refreshError);
				}
			}

			return Promise.reject(error);
		}
	);

	return axiosInstance;
};

export const clientAxiosInstance = createClientAxiosInstance();
