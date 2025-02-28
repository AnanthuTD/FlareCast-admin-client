import { Credentials, LoginPayload, User, UserState } from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define initial state
const initialState: UserState = {
	user: null,
	isAuthenticated: false,
	loading: true,
	error: null,
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		login: (state, action: PayloadAction<LoginPayload>) => {
			state.user = action.payload.user;
			state.isAuthenticated = true;
			state.loading = false;
			state.error = null;
		},

		loginRequest: (state) => {
			state.loading = true;
			state.error = null;
		},

		loginFailure: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.error = action.payload;
		},

		logout: (state) => {
			state.user = null;
			state.isAuthenticated = false;
			state.loading = false;
			state.error = null;
		},

		updateUser: (state, action: PayloadAction<Partial<User>>) => {
			state.user = {
				...state.user!,
				...action.payload, // Merge updates, ! asserts user is not null
			};
		},

		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},

		clearError: (state) => {
			state.error = null;
		},
	},
});

// Export actions
export const {
	login,
	loginRequest,
	loginFailure,
	logout,
	updateUser,
	setLoading,
	clearError,
} = userSlice.actions;

// Export reducer
export default userSlice.reducer;

// Export types for use elsewhere
export type { UserState, Credentials };
