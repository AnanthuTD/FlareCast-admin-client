"use client";

import { fetchAdminProfileThunk } from "@/actions/adminActions";
import SignIn from "@/components/authentication/SignIn";
import { useAppDispatch } from "@/redux/hooks";
import { login, logout } from "@/redux/slices/user";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function SignInPage() {
	const router = useRouter();
	const dispatch = useAppDispatch();

	useEffect(() => {
		const checkAuth = async () => {
			const result = await dispatch(fetchAdminProfileThunk() as any);
			console.log(result);
			if (result.success) {
				dispatch(login({ user: result.admin }));
				router.replace("/dashboard");
			} else {
				dispatch(logout());
			}
		};

		checkAuth();
	}, [dispatch, router]);

	return <SignIn />;
}

export default SignInPage;
