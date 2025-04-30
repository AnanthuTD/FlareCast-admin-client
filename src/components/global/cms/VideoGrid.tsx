"use client";

import { useState, useCallback } from "react";
import { Button, Pagination, message } from "antd";
import VideoCard from "./VideoCard";
import VideoModal from "./VideoModal";
import PlayerModal from "./PlayerModal";
import { PromotionalVideo } from "./types";
import Spinner from "@/components/global/spinner";
import { useRouter, useSearchParams } from "next/navigation";
import axiosInstance from "@/lib/axios";

interface VideoGridProps {
	initialVideos: PromotionalVideo[];
	totalVideos: number;
	page: number;
	pageSize: number;
}

export default function VideoGrid({
	initialVideos,
	totalVideos,
	page,
	pageSize,
}: VideoGridProps) {
	const [videos, setVideos] = useState<PromotionalVideo[]>(initialVideos);
	const [currentPage, setCurrentPage] = useState(page);
	const [currentPageSize, setCurrentPageSize] = useState(pageSize);
	const [total, setTotal] = useState(totalVideos);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isPlayerModalVisible, setIsPlayerModalVisible] = useState(false);
	const [selectedVideo, setSelectedVideo] = useState<PromotionalVideo | null>(
		null
	);
	const [editingVideo, setEditingVideo] = useState<PromotionalVideo | null>(
		null
	);
	const [fetching, setFetching] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();

	const fetchVideos = useCallback(async (skip: number, limit: number) => {
		try {
			setFetching(true);
			const { data } = await axiosInstance.get(
				"/api/admin/promotional-videos",
				{
					params: { skip, limit },
				}
			);
			setVideos(data.videos);
			setTotal(data.total || 0);
		} catch (error: any) {
			message.error(
				error.response?.data?.error || "Failed to fetch promotional videos"
			);
		} finally {
			setFetching(false);
		}
	}, []);

	const handlePageChange = (newPage: number, newPageSize?: number) => {
		const updatedPageSize = newPageSize || currentPageSize;
		setCurrentPage(newPage);
		setCurrentPageSize(updatedPageSize);
		const newParams = new URLSearchParams(searchParams.toString());
		newParams.set("page", newPage.toString());
		newParams.set("pageSize", updatedPageSize.toString());
		router.push(`/cms?${newParams.toString()}`);
		fetchVideos((newPage - 1) * updatedPageSize, updatedPageSize);
	};

	const handleRefresh = () => {
		fetchVideos((currentPage - 1) * currentPageSize, currentPageSize);
	};

	return fetching ? (
		<Spinner />
	) : (
		<>
			<div className="flex justify-end mb-8 space-x-4">
				<Button
					type="primary"
					onClick={() => setIsModalVisible(true)}
					className="bg-black text-white hover:bg-gray-800 transition-colors rounded-full px-6 py-2"
				>
					Create
				</Button>
				<Button
					type="default"
					onClick={handleRefresh}
					className="bg-black text-white hover:bg-gray-800 transition-colors rounded-full px-6 py-2"
				>
					Refresh
				</Button>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
				{videos.map((video) => (
					<VideoCard
						key={video.id}
						video={video}
						onThumbnailClick={setSelectedVideo}
						setIsPlayerModalVisible={setIsPlayerModalVisible}
						setEditingVideo={setEditingVideo}
						setIsModalVisible={setIsModalVisible}
						setVideos={setVideos}
						setTotal={setTotal}
					/>
				))}
			</div>

			<div className="mt-8 flex justify-center">
				<Pagination
					current={currentPage}
					pageSize={currentPageSize}
					total={total}
					onChange={handlePageChange}
					showSizeChanger
					pageSizeOptions={["1", "9", "18", "27"]}
					className="pagination"
				/>
			</div>

			<PlayerModal
				isVisible={isPlayerModalVisible}
				video={selectedVideo}
				onCancel={() => setIsPlayerModalVisible(false)}
			/>

			<VideoModal
				isVisible={isModalVisible}
				editingVideo={editingVideo}
				onCancel={() => {
					setIsModalVisible(false);
					setEditingVideo(null);
				}}
				setVideos={setVideos}
				setTotal={setTotal}
			/>
		</>
	);
}
