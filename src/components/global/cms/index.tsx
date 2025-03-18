"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
	Card,
	Modal,
	Form,
	Input,
	Button,
	Select,
	message,
	Row,
	Col,
	DatePicker,
	Upload,
	InputNumber,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import axiosInstance from "@/lib/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, MessageCircle, ExternalLink } from "lucide-react";
import "plyr/dist/plyr.css";
import relativeTime from "dayjs/plugin/relativeTime";
import Player from "../player";
import Image from "next/image";
dayjs.extend(relativeTime);

const { Option } = Select;

interface PromotionalVideo {
	id: string;
	category: "PROMOTIONAL" | "NEW_FEATURE";
	hidden: boolean;
	videoId: string;
	priority: number;
	startDate?: string | null;
	endDate?: string | null;
	title?: string | null;
	description?: string | null;
	createdBy: string;
	createdAt: string;
	updatedAt: string;
	hslUrl?: string; // Add this to your backend response
	thumbnailsUrl?: string; // Optional
	posterUrl?: string; // Optional
}

const PromotionalVideosPage: React.FC = () => {
	const [videos, setVideos] = useState<PromotionalVideo[]>([]);
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
	const [isPlayerModalVisible, setIsPlayerModalVisible] =
		useState<boolean>(false);
	const [selectedVideo, setSelectedVideo] = useState<PromotionalVideo | null>(
		null
	);
	const [editingVideo, setEditingVideo] = useState<PromotionalVideo | null>(
		null
	);
	const [form] = Form.useForm();
	const [loading, setLoading] = useState<boolean>(false);
	const [fileList, setFileList] = useState<any[]>([]);

	const fetchVideos = useCallback(async () => {
		try {
			setLoading(true);
			const { data } = await axiosInstance.get(
				"/api/user/admin/promotional-videos"
			);
			setVideos(data.data);
		} catch (error: any) {
			message.error(
				error.response?.data?.error || "Failed to fetch promotional videos"
			);
		} finally {
			setLoading(false);
		}
	}, []);

	const handleAddOrUpdateVideo = async (values: any) => {
		try {
			setLoading(true);

			let videoId: string, s3Key: string;

			if (!editingVideo) {
				if (fileList.length === 0) {
					throw new Error("Please upload a video file");
				}

				const { data } = await axiosInstance.post(
					"/api/user/admin/promotional-videos/signed-url",
					{
						title: values.title,
						description: values.description,
						fileName: fileList[0].name,
					}
				);

				videoId = data.videoId;
				s3Key = `${videoId}/original.${fileList[0].name.split(".").pop()}`;

				await axios.put(data.signedUrl, fileList[0], {
					headers: { "Content-Type": fileList[0].type },
				});
			} else {
				videoId = editingVideo.videoId;
				s3Key = "";
			}

			const payload = {
				category: values.category,
				hidden: values.hidden,
				priority: values.priority,
				startDate: values.startDate ? values.startDate.toISOString() : null,
				endDate: values.endDate ? values.endDate.toISOString() : null,
				title: values.title || null,
				description: values.description || null,
				videoId,
				s3Key: !editingVideo ? s3Key : undefined,
			};

			if (editingVideo) {
				const { data } = await axiosInstance.put(
					`/api/user/admin/promotional-videos/${editingVideo.id}`,
					payload
				);
				setVideos((prevVideos) =>
					prevVideos.map((v) => (v.id === data.data.id ? data.data : v))
				);
				message.success("Promotional video updated successfully!");
			} else {
				const { data } = await axiosInstance.post(
					"/api/user/admin/promotional-videos",
					payload
				);
				setVideos((prevVideos) => [...prevVideos, data.data]);
				message.success("Promotional video added successfully!");
			}

			setIsModalVisible(false);
			setEditingVideo(null);
			setFileList([]);
			form.resetFields();
		} catch (error: any) {
			message.error(
				error.response?.data?.error ||
					error.message ||
					"Failed to save promotional video"
			);
		} finally {
			setLoading(false);
		}
	};

	const handleToggleHidden = async (id: string, hidden: boolean) => {
		try {
			setLoading(true);
			const { data } = await axiosInstance.put(
				`/api/user/admin/promotional-videos/${id}`,
				{ hidden: !hidden }
			);
			setVideos((prevVideos) =>
				prevVideos.map((v) => (v.id === data.data.id ? data.data : v))
			);
			message.success(`Video ${hidden ? "shown" : "hidden"} successfully!`);
		} catch (error: any) {
			message.error(
				error.response?.data?.error || "Failed to toggle visibility"
			);
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteVideo = async (id: string) => {
		try {
			setLoading(true);
			await axiosInstance.delete(`/api/user/admin/promotional-videos/${id}`);
			setVideos((prevVideos) => prevVideos.filter((v) => v.id !== id));
			message.success("Promotional video deleted successfully!");
		} catch (error: any) {
			message.error(
				error.response?.data?.error || "Failed to delete promotional video"
			);
		} finally {
			setLoading(false);
		}
	};

	const handleThumbnailClick = (video: PromotionalVideo) => {
		const thumbnailsUrl = `/gcs/${video.videoId}/thumbnails/thumb00001.jpg`;
		const hslUrl = `/gcs/${video.videoId}/master.m3u8`;
		video = { ...video, thumbnailsUrl, hslUrl };
		setSelectedVideo(video);
		setIsPlayerModalVisible(true);
	};

	const showModal = (video?: PromotionalVideo) => {
		setEditingVideo(video || null);
		form.setFieldsValue(
			video
				? {
						...video,
						startDate: video.startDate ? dayjs(video.startDate) : null,
						endDate: video.endDate ? dayjs(video.endDate) : null,
				  }
				: {
						category: "PROMOTIONAL",
						hidden: true,
						priority: 0,
						startDate: null,
						endDate: null,
						title: "",
						description: "",
				  }
		);
		setIsModalVisible(true);
	};

	useEffect(() => {
		fetchVideos();
	}, [fetchVideos]);

	return (
		<div className="p-6 bg-gray-50 min-h-screen">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold text-gray-800">Promotional Videos</h1>
				<div className="space-x-4">
					<Button
						type="primary"
						onClick={() => showModal()}
						className="bg-black text-white hover:bg-gray-800 transition-colors rounded-full px-6 py-2"
					>
						Create
					</Button>
					<Button
						type="default"
						onClick={() => fetchVideos()}
						className="bg-black text-white hover:bg-gray-800 transition-colors rounded-full px-6 py-2"
					>
						Refresh
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
				{videos.map((video) => (
					<Card
						key={video.id}
						className="w-[350px] rounded-xl overflow-hidden transition-opacity opacity-100"
						style={{ cursor: "pointer" }}
					>
						<div
							className="relative w-full h-48 rounded-2xl overflow-hidden"
							onClick={() => handleThumbnailClick(video)}
						>
							<Avatar className="object-cover w-full h-full rounded-none">
								<AvatarImage
									src={`/gcs/${video.videoId}/thumbnails/thumb00001.jpg`}
								/>
								<AvatarFallback className="rounded-none">
									<div className="flex items-center justify-center h-full  text-gray-600 text-sm">
										<span>No Thumbnail Available</span>
									</div>
								</AvatarFallback>
							</Avatar>

							{/* <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
								0:00
							</div> */}
						</div>

						<div className="p-4">
							<div className="flex gap-2 items-start">
								<Avatar className="w-8 h-8">
									<AvatarImage src="" />
									<AvatarFallback>
										<div className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-800 rounded-full">
											{/* video.createdBy?.[0] ||  */ "A"}
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

									{/* <div className="flex gap-4 mt-3 text-xs text-gray-500">
										<div className="flex items-center gap-1">
											<Eye className="w-4 h-4" />
											<span>0</span>
										</div>
										<div className="flex items-center gap-1">
											<MessageCircle className="w-4 h-4" />
											<span>0</span>
										</div>
										<div className="flex items-center gap-1">
											<ExternalLink className="w-4 h-4" />
											<span>0</span>
										</div>
									</div> */}

									<div className="mt-2 text-xs text-gray-700">
										<p>Category: {video.category}</p>
										<p>Priority: {video.priority}</p>
										{video.startDate && (
											<p>
												Start: {new Date(video.startDate).toLocaleDateString()}
											</p>
										)}
										{video.endDate && (
											<p>End: {new Date(video.endDate).toLocaleDateString()}</p>
										)}
										<p
											className={
												video.hidden ? "text-red-600" : "text-green-600"
											}
										>
											{video.hidden ? "Hidden" : "Visible"}
										</p>
									</div>

									<div className="flex gap-2 mt-3">
										<Button
											type="link"
											onClick={() => handleToggleHidden(video.id, video.hidden)}
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
											onClick={() => showModal(video)}
											className="text-blue-600 hover:text-blue-800 p-0"
										>
											Edit
										</Button>
										<Button
											type="link"
											onClick={() => handleDeleteVideo(video.id)}
											className="text-red-600 hover:text-red-800 p-0"
										>
											Delete
										</Button>
									</div>
								</div>
							</div>
						</div>
					</Card>
				))}
			</div>

			{/* Player Modal */}
			<Modal
				title={selectedVideo?.title || "Promotional Video"}
				open={isPlayerModalVisible}
				onCancel={() => setIsPlayerModalVisible(false)}
				footer={null}
				className="rounded-xl"
				width={800}
			>
				{selectedVideo?.hslUrl ? (
					<Player
						hslUrl={selectedVideo.hslUrl}
						thumbnailsUrl={selectedVideo.thumbnailsUrl}
						posterUrl={selectedVideo.posterUrl}
						videoId={selectedVideo.videoId}
					/>
				) : (
					<p>No video URL available</p>
				)}
			</Modal>

			{/* Create/Edit Modal */}
			<Modal
				title={
					editingVideo ? "Edit Promotional Video" : "Create Promotional Video"
				}
				open={isModalVisible}
				onCancel={() => {
					setIsModalVisible(false);
					setEditingVideo(null);
					setFileList([]);
					form.resetFields();
				}}
				footer={null}
				className="rounded-xl"
				width={1000}
			>
				{editingVideo && editingVideo.hslUrl && (
					<div className="mb-6">
						<h3 className="text-lg font-semibold">
							{editingVideo.title || "Untitled"}
						</h3>
						<Player
							hslUrl={editingVideo.hslUrl}
							thumbnailsUrl={editingVideo.thumbnailsUrl}
							posterUrl={editingVideo.posterUrl}
							videoId={editingVideo.videoId}
						/>
						{editingVideo.description && (
							<p className="mt-2 text-gray-600">{editingVideo.description}</p>
						)}
					</div>
				)}
				<Form
					form={form}
					onFinish={handleAddOrUpdateVideo}
					layout="vertical"
					className="space-y-4"
				>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name="title" label="Title (Optional)">
								<Input className="rounded-full" />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name="description" label="Description (Optional)">
								<Input.TextArea className="rounded-full" />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="category"
								label="Category"
								rules={[
									{ required: true, message: "Please select a category" },
								]}
							>
								<Select className="rounded-full w-full">
									<Option value="PROMOTIONAL">Promotional</Option>
									<Option value="NEW_FEATURE">New Feature</Option>
								</Select>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name="hidden"
								label="Visibility"
								rules={[
									{ required: true, message: "Please select visibility" },
								]}
							>
								<Select className="rounded-full w-full">
									<Option value={true}>Hidden</Option>
									<Option value={false}>Visible</Option>
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="priority"
								label="Priority"
								rules={[{ required: true, message: "Please enter priority" }]}
							>
								<InputNumber
									min={0}
									style={{ width: "100%" }}
									className="rounded-full"
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							{!editingVideo && (
								<Form.Item
									name="video"
									label="Video File"
									rules={[{ required: true, message: "Please upload a video" }]}
								>
									<Upload
										fileList={fileList}
										beforeUpload={(file) => {
											setFileList([file]);
											return false;
										}}
										onRemove={() => setFileList([])}
										accept="video/mp4,video/webm"
									>
										<Button icon={<UploadOutlined />} className="rounded-full">
											Upload Video
										</Button>
									</Upload>
								</Form.Item>
							)}
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name="startDate" label="Start Date">
								<DatePicker
									style={{ width: "100%" }}
									className="rounded-full"
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name="endDate" label="End Date">
								<DatePicker
									style={{ width: "100%" }}
									className="rounded-full"
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={12}>
							<Form.Item>
								<Button
									type="primary"
									htmlType="submit"
									loading={loading}
									className="bg-black text-white hover:bg-gray-800 transition-colors rounded-full px-6 py-2 w-full mt-4"
								>
									{editingVideo ? "Update" : "Create"}
								</Button>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Modal>
		</div>
	);
};

export default PromotionalVideosPage;
