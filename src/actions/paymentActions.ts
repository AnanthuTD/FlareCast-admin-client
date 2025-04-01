import axiosInstance from "@/lib/axios";

export const fetchPayments = async ({ page, limit, status }) => {
	try {
		const { data } = await axiosInstance.get("/api/user/admin/payments", {
			params: { page, limit, status },
		});
		return { success: true, data: data };
	} catch (error) {
		return {
			success: false,
			message: error.response?.data?.message || "Failed to fetch payment info",
		};
	}
};

export const fetchPaymentStatus = async () => {
	try {
		const { data } = await axiosInstance.get("/api/user/admin/payment-status");
		return { success: true, data: data };
	} catch (error) {
		return {
			success: false,
			message: error.response?.data?.message || "Failed to fetch payment status",
		};
	}
};
