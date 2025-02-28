import axiosInstance from "@/lib/axios";
import { SubscriptionPlan } from "@/types/types"; // Adjust path to your SubscriptionPlan interface

// Fetch all subscription plans
export const fetchSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  try {
    const { data } = await axiosInstance.get<SubscriptionPlan[]>(
      "/api/user/admin/subscription-plans",
      { withCredentials: true }
    );
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch subscription plans");
  }
};

// Add a new subscription plan
export const addSubscriptionPlan = async (
  values: Omit<SubscriptionPlan, "id" | "planId" | "createdAt" | "updatedAt" | "isActive">
): Promise<SubscriptionPlan> => {
  try {
    const { data } = await axiosInstance.post<SubscriptionPlan>(
      "/api/user/admin/subscription-plans",
      values,
      { withCredentials: true }
    );
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to add subscription plan");
  }
};

// Toggle plan active status
export const toggleSubscriptionPlanActive = async (
  planId: string,
  isActive: boolean
): Promise<SubscriptionPlan> => {
  try {
    const { data } = await axiosInstance.patch<SubscriptionPlan>(
      `/api/user/admin/subscription-plans/${planId}/toggle`,
      { isActive: !isActive },
      { withCredentials: true }
    );
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to toggle plan status");
  }
};