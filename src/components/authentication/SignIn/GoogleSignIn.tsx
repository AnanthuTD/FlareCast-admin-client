import React, { useEffect, useState } from "react";
import { useGoogleLogin, TokenResponse } from "@react-oauth/google";
import { useRouter, useSearchParams } from "next/navigation";
import { notification } from "antd";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { login, loginRequest, loginFailure } from "@/redux/slices/user";
import { adminGoogleSignIn } from "@/actions/adminActions"; 
import { GoogleSignInButton } from "./GoogleSignInButton"; 
import { User } from "@/types/types";

// Define interfaces
interface GoogleSignInProps {
	trigger?: boolean;
	setTrigger?: (value: boolean) => void;
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ({
	trigger = false,
	setTrigger = () => {},
}) => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const dispatch = useAppDispatch();
	const { loading: reduxLoading, error } = useAppSelector(
		(state) => state.user
	);
	const [localLoading, setLocalLoading] = useState(false);

	// Handle successful Google login
	const handleGoogleLoginSuccess = (user: User) => {
		dispatch(login({ user }));
		const callbackUrl = searchParams.get("callbackUrl");
		if (callbackUrl) {
			window.location.href = callbackUrl;
		} else {
			router.replace("/dashboard");
		}
	};

	// Handle Google login error
	const handleGoogleLoginError = (message: string) => {
		dispatch(loginFailure(message));
		notification.error({ message });
		console.error("Error during Google login:", message);
	};

	// Handle Google OAuth response
	const responseGoogle = async (authResult: TokenResponse) => {
		dispatch(loginRequest()); // Start loading via Redux
		setLocalLoading(true);
		try {
			const result = await dispatch(adminGoogleSignIn(authResult) as any);
			if (!result.success) {
				throw new Error(result.message);
			}
			notification.success({
				message: "Successfully logged in!",
				description: "You have successfully logged in with Google.",
			});
			handleGoogleLoginSuccess(result.payload); 
		} catch (error: any) {
			handleGoogleLoginError(error.message || "Google sign-in failed");
		} finally {
			setLocalLoading(false);
		}
	};

	const googleLogin = useGoogleLogin({
		onSuccess: responseGoogle,
		onError: (error) => {
			console.error("Google login error:", error);
			handleGoogleLoginError("Google authentication failed");
		},
	});

	useEffect(() => {
		if (trigger) {
			googleLogin();
			setTrigger(false);
		}
	}, [trigger, googleLogin, setTrigger]);

	return (
		<div>
			{(reduxLoading || localLoading) && (
				<div className="spinner">Loading...</div>
			)}
			{error && <div className="error">{error}</div>}
			<GoogleSignInButton
				onClick={() => googleLogin()}
				disabled={localLoading}
			/>
		</div>
	);
};

export default GoogleSignIn;
