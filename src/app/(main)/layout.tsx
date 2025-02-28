import React from "react";
import MainLayout from "./MainLayout";


function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
			<MainLayout>{children}</MainLayout>
	);
}

export default Layout;
