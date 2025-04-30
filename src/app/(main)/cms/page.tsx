import { PromotionalVideo } from "@/components/global/cms/types";
import VideoGrid from "@/components/global/cms/VideoGrid";
import { createServerAxiosInstance } from "@/lib/axios/server";
import { AuthError } from "@/utils/Errors";
import { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface VideosResponse {
	videos: PromotionalVideo[];
	total: number;
	error?: string;
}

async function fetchVideos(
	skip: number,
	limit: number
): Promise<VideosResponse> {
	try {
		const cookieStore = await cookies();
		const accessToken = cookieStore.get("accessToken");

		console.log("Access token: ", accessToken);

		const axiosInstance = await createServerAxiosInstance(accessToken?.value);
		const { data } = await axiosInstance.get(
			`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/admin/promotional-videos`,
			{
				params: { skip, limit },
			}
		);
		return { videos: data.videos, total: data.total || 0 };
	} catch (error: any) {
		if (error instanceof AuthError) redirect("/signin");

		if (isAxiosError(error)) console.error(error.response?.data);
		else console.error(error);
		return {
			error:
				error.response?.data?.error || "Failed to fetch promotional videos",
		};
	}
}

export default async function PromotionalVideosPage({
	searchParams,
}: {
	searchParams: { page?: string; pageSize?: string };
}) {
	const sp = await searchParams;

	const page = parseInt(sp.page || "1", 10);
	const pageSize = parseInt(sp.pageSize || "9", 10);
	const skip = (page - 1) * pageSize;

	const { videos, total } = await fetchVideos(skip, pageSize);

	return (
		<div className="p-6 bg-gray-50 min-h-screen">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold text-gray-800">Promotional Videos</h1>
			</div>
			<VideoGrid
				initialVideos={videos}
				totalVideos={total}
				page={page}
				pageSize={pageSize}
			/>
		</div>
	);
}
