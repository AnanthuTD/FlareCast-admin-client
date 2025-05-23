import axiosInstance from "@/lib/axios";
import {
	login,
	loginRequest,
	loginFailure,
	logout,
	setLoading,
	clearError,
} from "@/redux/slices/user";
import { User } from "@/types/types";
import { Dispatch } from "@reduxjs/toolkit";

interface AdminSignInResponse {
	admin: User; 
}

interface GoogleSignInResponse {
	admin: User;
	message: string;
}

interface RefreshTokenResponse {
	accessToken: string;
}

export const adminSignIn =
	(credentials: { email: string; password: string }) =>
	async (dispatch: Dispatch) => {
		dispatch(loginRequest());
		try {
			const response = await axiosInstance.post<AdminSignInResponse>(
				"/api/admin/auth/sign-in",
				credentials
			);
			dispatch(login({ user: response.data.admin }));
			return { success: true };
		} catch (error: any) {
			const message = error.response?.data?.message || "Sign-in failed";
			dispatch(loginFailure(message));
			return { success: false, message };
		}
	};

export const adminGoogleSignIn =
	(code: { access_token: string }) => async (dispatch: Dispatch) => {
		dispatch(loginRequest());
		try {
			const response = await axiosInstance.post<GoogleSignInResponse>(
				"/api/admin/auth/google-sign-in",
				{ code }
			);
			dispatch(login({ user: response.data }));
			return { success: true };
		} catch (error: any) {
			const message = error.response?.data?.message || "Google sign-in failed";
			dispatch(loginFailure(message));
			return { success: false, message };
		}
	};

export const adminRefreshToken = () => async (dispatch: Dispatch) => {
	dispatch(setLoading(true));
	try {
		const response = await axiosInstance.get<RefreshTokenResponse>(
			"/api/admin/auth/refresh-token"
		);
		dispatch(clearError()); // Clear any previous errors
		return { success: true, accessToken: response.data.accessToken };
	} catch (error: any) {
		const message = error.response?.data?.message || "Token refresh failed";
		dispatch(loginFailure(message));
		return { success: false, message };
	} finally {
		dispatch(setLoading(false));
	}
};

export const adminLogout = () => async (dispatch: Dispatch) => {
	dispatch(setLoading(true));
	try {
		await axiosInstance.post("/api/admin/auth/logout");
		dispatch(logout());
		return { success: true };
	} catch (error: any) {
		const message = error.response?.data?.message || "Logout failed";
		dispatch(loginFailure(message));
		return { success: false, message };
	} finally {
		dispatch(setLoading(false));
	}
};

// Optional: Fetch profile action (if needed)
export const fetchAdminProfileThunk = () => async (dispatch: Dispatch) => {
	dispatch(setLoading(true));
	try {
		const response = await axiosInstance.get<{ admin: User }>(
			"/api/admin/profile"
		);
		dispatch(login({ user: response.data.admin }));
		return { success: true, admin: response.data.admin };
	} catch (error: any) {
		const message = error.response?.data?.message || "Failed to fetch profile";
		dispatch(loginFailure(message));
		return { success: false, message };
	} finally {
		dispatch(setLoading(false));
	}
};