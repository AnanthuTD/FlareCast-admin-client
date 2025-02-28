"use client";

import React, { useEffect, useState } from "react";
import { ConfigProvider, Layout, theme } from "antd";
import Sidebar from "./AdminSideBar";
import HeaderBar from "./HeaderBar";
import ContentArea from "./ContentArea";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchAdminProfileThunk } from "@/actions/adminActions";
import { login } from "@/redux/slices/user";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
	const [collapsed, setCollapsed] = useState(false);

	const toggleCollapsed = () => setCollapsed(!collapsed);

	const user = useAppSelector((state) => state.user);
	const router = useRouter();
	const dispatch = useAppDispatch();
	const searchParams = useSearchParams();

	useEffect(() => {
		const loadProfile = async () => {
			try {
				const tokenFromUrl = searchParams.get("token");

				// If a token is found in the URL, store it in the cookies
				if (tokenFromUrl) {
					Cookies.remove("authToken");
					Cookies.set("authToken", tokenFromUrl);
				}

				// If no shopOwner data, attempt to fetch the profile
				if (!user) {
					const profile = await fetchAdminProfileThunk();
					if (!profile) {
						router.push("/admin/signin");
					} else {
						// Update Redux store with fetched profile data
						console.log(profile);

						dispatch(login(profile));
					}
				}
			} catch (error) {
				console.error("Error fetching profile:", error);
				router.push("/admin/signin"); // Navigate to sign-in if fetching profile fails
			}
		};

		loadProfile();
	}, [user, dispatch, router, searchParams]);

	// TODO: Uncomment the following line to restrict access to specific routes based on admin role
	/*   if (!admin) {
    return null;
  } */

	return (
		<ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
			<Layout style={{ height: "100vh" }}>
				<Sidebar collapsed={collapsed} />
				<Layout>
					<HeaderBar collapsed={collapsed} toggle={toggleCollapsed} />
					<ContentArea>{children}</ContentArea>
				</Layout>
			</Layout>
		</ConfigProvider>
	);
};

export default MainLayout;
