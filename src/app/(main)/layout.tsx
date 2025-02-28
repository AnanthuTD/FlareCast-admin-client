import React, { Suspense } from "react";
import MainLayout from "./MainLayout";
import { AuthProvider } from "./AuthProvider";

function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<AuthProvider>
			<Suspense fallback={<></>}>
				<MainLayout>{children}</MainLayout>
			</Suspense>
		</AuthProvider>
	);
}

export default Layout;
