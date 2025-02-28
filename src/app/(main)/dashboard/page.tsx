import React from "react";
import { ProtectedRoute } from "../AuthProvider";

function Page() {
	return (
		<ProtectedRoute>
			Dashboard
		</ProtectedRoute>
	);
}

export default Page;
