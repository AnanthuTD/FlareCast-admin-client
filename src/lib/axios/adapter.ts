import { AxiosResponse } from "axios";

export interface ApiResponse<T> {
	data: T | null;
	error: string | null;
}

export async function apiRequest<T>(
	request: Promise<AxiosResponse<T>>
): Promise<ApiResponse<T>> {
	try {
		const response = await request;
		return { data: response.data, error: null };
	} catch (error) {
		const axiosError = error as any;
		const errorMessage =
			axiosError.response?.data?.message ||
			axiosError.message ||
			"Unknown error";
		console.error("API request failed:", errorMessage);
		return { data: null, error: errorMessage };
	}
}
