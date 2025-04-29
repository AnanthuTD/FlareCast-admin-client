'use client'

import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchAdminProfileThunk } from "@/actions/adminActions"; // Adjust path
import { login, logout, setLoading } from "@/redux/slices/user";
import { useRouter } from "next/navigation";
import { User } from "@/types/types";

interface AuthContextType {
	isAuthenticated: boolean;
	user: User | null;
	loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const { user, isAuthenticated, loading } = useAppSelector(
		(state) => state.user
	);

	useEffect(() => {
		const checkAuth = async () => {
			if (!isAuthenticated && !user) {
				const result = await dispatch(fetchAdminProfileThunk() as any);
        console.log(result);
				if (result.success) {
					dispatch(login({ user: result.admin }));
				} else {
					dispatch(logout());
					router.push("/signin");
				}
			}
		};

		checkAuth();
	}, [dispatch, router, isAuthenticated, user]);

	const value: AuthContextType = {
		isAuthenticated,
		user,
		loading,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

// ProtectedRoute component to wrap pages or components
export const ProtectedRoute: React.FC<{ children: ReactNode , skeleton?: ReactNode}> = ({
	children,
	skeleton
}) => {
	const { isAuthenticated, loading, user } = useAuth();
	const router = useRouter();

	useEffect(() => {
    console.log(user)
		if (!loading && !isAuthenticated) {
      console.log("Not authenticated")
			router.push("/signin");
		}
	}, [isAuthenticated, loading, router, user]);

	if (loading) {
		return skeleton ||  <div>Loading...</div>;
	}

	return isAuthenticated ? <>{children}</> : null;
};
