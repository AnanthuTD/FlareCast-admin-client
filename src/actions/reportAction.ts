import axiosInstance from "@/lib/axios";

const API_BASE_PATH = "/api/admin";

// Fetch sales summary
export const fetchSalesSummary = async () => {
	try {
		const { data } = await axiosInstance.get(`${API_BASE_PATH}/sales/summary`);
		return { success: true, data: data }; // Assuming data is wrapped in { status, data }
	} catch (error) {
		return {
			success: false,
			message: error.response?.data?.error || "Failed to fetch sales summary",
		};
	}
};

// Fetch plan group data
export const fetchPlanGroup = async () => {
	try {
		const { data } = await axiosInstance.get(
			`${API_BASE_PATH}/sales/plan-group`
		);
		return { success: true, data: data };
	} catch (error) {
		return {
			success: false,
			message: error.response?.data?.error || "Failed to fetch plan group data",
		};
	}
};

// Fetch free plan usage
export const fetchFreePlanUsage = async () => {
	try {
		const { data } = await axiosInstance.get(
			`${API_BASE_PATH}/sales/free-plan`
		);
		return { success: true, data: data };
	} catch (error) {
		return {
			success: false,
			message: error.response?.data?.error || "Failed to fetch free plan usage",
		};
	}
};

// Fetch revenue by period
export const fetchRevenueByPeriod = async (
	period: "daily" | "weekly" | "monthly" | "yearly"
) => {
	try {
		const { data } = await axiosInstance.get(
			`${API_BASE_PATH}/sales/revenue-by-period`,
			{
				params: { period },
			}
		);
		return { success: true, data: data };
	} catch (error) {
		return {
			success: false,
			message:
				error.response?.data?.error || "Failed to fetch revenue by period",
		};
	}
};

// Fetch status distribution
export const fetchStatusDistribution = async () => {
	try {
		const { data } = await axiosInstance.get(
			`${API_BASE_PATH}/sales/status-distribution`
		);
		return { success: true, data: data };
	} catch (error) {
		return {
			success: false,
			message:
				error.response?.data?.error || "Failed to fetch status distribution",
		};
	}
};
