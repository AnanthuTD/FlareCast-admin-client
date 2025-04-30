import axiosInstance from "@/lib/axios";
import { apiRequest } from "@/lib/axios/adapter";

export async function addOrUpdateVideo(formData: FormData) {
	try {
		const id = formData.get("id") as string | null;
		const videoFile = formData.get("video") as File | null;

		let videoId: string, s3Key: string;

		if (!id && videoFile) {
			// Create new video
			const { data } = await axiosInstance.post(
				"/api/admin/promotional-videos/signed-url",
				{
					title: formData.get("title") || "",
					description: formData.get("description") || "",
					fileName: videoFile.name,
				}
			);

			videoId = data.videoId;
			s3Key = `${videoId}/original.${videoFile.name.split(".").pop()}`;

			await axiosInstance.put(data.signedUrl, videoFile, {
				headers: { "Content-Type": videoFile.type },
			});
		} else {
			videoId = id!;
			s3Key = "";
		}

		const payload: any = {
			category: formData.get("category"),
			hidden: formData.get("hidden") === "true",
			priority: parseInt(formData.get("priority") as string, 10),
			title: formData.get("title") || null,
			description: formData.get("description") || null,
			startDate: formData.get("startDate") || null,
			endDate: formData.get("endDate") || null,
			videoId,
		};

		if (!id) payload.s3Key = s3Key;

		let response;
		if (id) {
			response = await axiosInstance.put(
				`/api/admin/promotional-videos/${id}`,
				payload
			);
		} else {
			response = await axiosInstance.post(
				"/api/admin/promotional-videos",
				payload
			);
		}

		return { success: true, data: response.data.data };
	} catch (error: any) {
		return {
			success: false,
			error:
				error.response?.data?.error ||
				error.message ||
				"Failed to save promotional video",
		};
	}
}

export async function getPreviewVideo(id: string) {
	return apiRequest(axiosInstance.get(`/api/admin/videos/${id}/video`));
}
