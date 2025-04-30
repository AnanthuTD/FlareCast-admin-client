"use client";

import { Card, Button, message } from "antd";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { PromotionalVideo } from "./types";
import axiosInstance from "@/lib/axios";

dayjs.extend(relativeTime);

interface VideoCardProps {
	video: PromotionalVideo;
	onThumbnailClick: (video: PromotionalVideo) => void;
	setIsPlayerModalVisible: (visible: boolean) => void;
	setEditingVideo: (video: PromotionalVideo | null) => void;
	setIsModalVisible: (visible: boolean) => void;
	setVideos: React.Dispatch<React.SetStateAction<PromotionalVideo[]>>;
	setTotal: React.Dispatch<React.SetStateAction<number>>;
}

export default function VideoCard({
	video,
	onThumbnailClick,
	setIsPlayerModalVisible,
	setEditingVideo,
	setIsModalVisible,
	setVideos,
	setTotal,
}: VideoCardProps) {
	const handleThumbnailClick = () => {
		const updatedVideo = {
			...video,
			thumbnailsUrl: `/gcs/${video.videoId}/thumbnails/thumb00001.jpg`,
			hslUrl: `/gcs/${video.videoId}/master.m3u8`,
		};
		onThumbnailClick(updatedVideo);
		setIsPlayerModalVisible(true);
	};

	const handleToggleHidden = async () => {
		try {
			const { data } = await axiosInstance.put(
				`/api/admin/promotional-videos/${video.id}`,
				{
					hidden: !video.hidden,
				}
			);
			setVideos((prev) =>
				prev.map((v) => (v.id === data.data.id ? data.data : v))
			);
			message.success(
				`Video ${video.hidden ? "shown" : "hidden"} successfully!`
			);
		} catch (error: any) {
			message.error(
				error.response?.data?.error || "Failed to toggle visibility"
			);
		}
	};

	const handleDelete = async () => {
		try {
			await axiosInstance.delete(`/api/admin/promotional-videos/${video.id}`);
			setVideos((prev) => prev.filter((v) => v.id !== video.id));
			setTotal((prev) => prev - 1);
			message.success("Promotional video deleted successfully!");
		} catch (error: any) {
			message.error(
				error.response?.data?.error || "Failed to delete promotional video"
			);
		}
	};

	return (
		<Card
			className="w-[350px] rounded-xl overflow-hidden transition-opacity opacity-100"
			style={{ cursor: "pointer" }}
		>
			<div
				className="relative w-full h-48 rounded-2xl overflow-hidden"
				onClick={handleThumbnailClick}
			>
				<Avatar className="object-cover w-full h-full rounded-none">
					<AvatarImage
						src={`/gcs/${video.videoId}/thumbnails/thumb00001.jpg`}
					/>
					<AvatarFallback className="rounded-none">
						<div className="flex items-center justify-center h-full text-gray-600 text-sm">
							<span>No Thumbnail Available</span>
						</div>
					</AvatarFallback>
				</Avatar>
			</div>

			<div className="p-4">
				<div className="flex gap-2 items-start">
					<Avatar className="w-8 h-8">
						<AvatarImage src="" />
						<AvatarFallback>
							<div className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-800 rounded-full">
								{video.createdBy?.[0] || "A"}
							</div>
						</AvatarFallback>
					</Avatar>

					<div className="flex flex-col w-full">
						<div className="flex justify-between text-xs text-gray-500">
							<span className="font-medium text-neutral-800">
								{video.createdBy}
							</span>
							<span>・{dayjs(video.createdAt).fromNow()}</span>
						</div>

						<div className="mt-2 text-sm font-medium text-neutral-800 line-clamp-2">
							{video.title || "Untitled"}
						</div>

						<div className="mt-2 text-xs text-gray-700">
							<p>Category: {video.category}</p>
							<p>Priority: {video.priority}</p>
							{video.startDate && (
								<p>Start: {new Date(video.startDate).toLocaleDateString()}</p>
							)}
							{video.endDate && (
								<p>End: {new Date(video.endDate).toLocaleDateString()}</p>
							)}
							<p className={video.hidden ? "text-red-600" : "text-green-600"}>
								{video.hidden ? "Hidden" : "Visible"}
							</p>
						</div>

						<div className="flex gap-2 mt-3">
							<Button
								type="link"
								onClick={handleToggleHidden}
								className={
									video.hidden
										? "text-green-600 hover:text-green-800 p-0"
										: "text-red-600 hover:text-red-800 p-0"
								}
							>
								{video.hidden ? "Show" : "Hide"}
							</Button>
							<Button
								type="link"
								onClick={() => {
									setEditingVideo(video);
									setIsModalVisible(true);
								}}
								className="text-blue-600 hover:text-blue-800 p-0"
							>
								Edit
							</Button>
							<Button
								type="link"
								onClick={handleDelete}
								className="text-red-600 hover:text-red-800 p-0"
							>
								Delete
							</Button>
						</div>
					</div>
				</div>
			</div>
		</Card>
	);
}
