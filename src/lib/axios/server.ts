"use server";

import { AxiosInstance, AxiosRequestConfig, isAxiosError } from "axios";
import { cookies } from "next/headers";
import { createBaseAxiosInstance } from "./base";
import { AuthError } from "@/utils/Errors";

export const createServerAxiosInstance = async (
	initialAccessToken?: string
): Promise<AxiosInstance> => {
	const axiosInstance = createBaseAxiosInstance();

	if (initialAccessToken) {
		axiosInstance.defaults.headers.common[
			"Authorization"
		] = `Bearer ${initialAccessToken}`;
	}

	axiosInstance.interceptors.response.use(
		(response) => response,
		async (error) => {
			"use server";
			const originalRequest = error.config as AxiosRequestConfig & {
				_retry?: boolean;
			};

			if (error.response?.status === 401 && !originalRequest._retry) {
				originalRequest._retry = true;

				try {
					const cookieStore = await cookies();
					const refreshToken = cookieStore.get("refreshToken")?.value;

					if (!refreshToken) {
						throw new Error("No refresh token available");
					}

					const response = await createBaseAxiosInstance().post(
						`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/admin/auth/refresh-token`,
						{
							refreshToken,
						},
						{
							headers: {
								Authorization: `Bearer ${initialAccessToken}`,
							},
						}
					);

					const { accessToken, refreshToken: newRefreshToken } = response.data;

					if (!originalRequest.headers) {
						originalRequest.headers = {};
					}
					originalRequest.headers.Authorization = `Bearer ${accessToken}`;

					return axiosInstance(originalRequest);
				} catch (refreshError) {
					if (isAxiosError(refreshError)) {
						console.error(refreshError.response?.data);
						throw new AuthError("Failed to refresh token");
					} else {
						console.error(refreshError);
						throw new AuthError("Unexpected error during token refresh");
					}
				}
			}

			return Promise.reject(error);
		}
	);

	return axiosInstance;
};
