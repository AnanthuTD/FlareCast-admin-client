import { ProtectedRoute } from "../AuthProvider";
import { ClientDashboard } from "@/components/global/dashboard/ClientDashboard";
import { Metadata } from "next";
import { Suspense } from "react";
import { AdminDashboardSkeleton } from "./loading";

export const metadata: Metadata = {
	title: "Admin Dashboard",
	description: "Admin dashboard for real-time monitoring",
};

const AdminDashboard = () => {
	return (
		<ProtectedRoute skeleton={<AdminDashboardSkeleton />}>
			<div className="p-6 bg-gray-100 min-h-screen">
				{/* Head is not directly supported in App Router; use metadata instead */}
				<h1 className="text-3xl font-bold mb-6 text-gray-800">
					Admin Dashboard
				</h1>

				{/* Client Component for real-time updates */}
				<div className="fade-in">
					<Suspense fallback={<AdminDashboardSkeleton />}>
						<ClientDashboard />
					</Suspense>
				</div>
			</div>
		</ProtectedRoute>
	);
};

export default AdminDashboard;
