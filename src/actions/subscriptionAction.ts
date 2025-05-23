import axiosInstance from "@/lib/axios";
import { SubscriptionPlan } from "@/types/types";

// Fetch all subscription plans
export const fetchSubscriptionPlans = async (query: {
	skip: number;
	limit: number;
	status: "active" | "inactive" | "all";
}): Promise<SubscriptionPlan[]> => {
	try {
		const { data } = await axiosInstance.get<SubscriptionPlan[]>(
			"/api/subscriptions/admin/plans",
			{ withCredentials: true, params: query }
		);
		return data;
	} catch (error: any) {
		throw new Error(
			error.response?.data?.message || "Failed to fetch subscription plans"
		);
	}
};

// Add a new subscription plan
export const addSubscriptionPlan = async (
	values: Omit<
		SubscriptionPlan,
		"id" | "planId" | "createdAt" | "updatedAt" | "isActive"
	>
): Promise<SubscriptionPlan> => {
	try {
		const { data } = await axiosInstance.post<SubscriptionPlan>(
			"/api/subscriptions/admin/plans",
			values,
			{ withCredentials: true }
		);
		return data;
	} catch (error: any) {
		throw new Error(
			error.response?.data?.message || "Failed to add subscription plan"
		);
	}
};

// Toggle plan active status
export const toggleSubscriptionPlanActive = async (
	planId: string,
	isActive: boolean
): Promise<SubscriptionPlan> => {
	try {
		const { data } = await axiosInstance.patch<SubscriptionPlan>(
			`/api/subscriptions/admin/plans/${planId}/toggle`,
			{ isActive: !isActive },
			{ withCredentials: true }
		);
		return data;
	} catch (error: any) {
		throw new Error(
			error.response?.data?.message || "Failed to toggle plan status"
		);
	}
};
