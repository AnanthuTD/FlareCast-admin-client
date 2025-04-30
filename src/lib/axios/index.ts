import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const config: AxiosRequestConfig = {
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
		"ngrok-skip-browser-warning": "69420",
	},
	withCredentials: true,
};

const axiosInstance: AxiosInstance = axios.create(config);

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Function to subscribe failed requests to wait for token refresh
const onTokenRefreshed = (token: string) => {
	refreshSubscribers.forEach((callback) => callback(token));
	refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: () => void) => {
	refreshSubscribers.push(callback);
};

const excludeFromAuth = [
	"/signin",
	"/signup",
	"/verification/email/success",
	"/verification/email/failure",
	"/verification/email/notify",
	"/verification/invitation",
	"/",
];

// Response interceptor
axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				// Wait for the new token if refresh is in progress
				return new Promise((resolve) => {
					addRefreshSubscriber(() => {
						resolve(axiosInstance(originalRequest));
					});
				});
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				const response = await axios.post("/api/admin/auth/refresh-token");
				const newAccessToken = response.data.accessToken;

				onTokenRefreshed(newAccessToken);
				isRefreshing = false;

				return axiosInstance(originalRequest);
			} catch (refreshError) {
				isRefreshing = false;

				if (
					!excludeFromAuth.includes(window.location.pathname) &&
					window.location.pathname !== "/"
				) {
					window.location.href = "/signin";
				}

				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	}
);

export default axiosInstance;
