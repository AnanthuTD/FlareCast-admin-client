import React from "react";
import MainLayout from "./MainLayout";
import { AuthProvider } from "./AuthProvider";

function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<AuthProvider>
			<MainLayout>{children}</MainLayout>
		</AuthProvider>
	);
}

export default Layout;
