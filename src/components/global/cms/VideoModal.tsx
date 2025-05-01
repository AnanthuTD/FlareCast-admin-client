"use client";

import { useId, useState } from "react";
import {
	Modal,
	Form,
	Input,
	Button,
	Select,
	Row,
	Col,
	DatePicker,
	Upload,
	InputNumber,
	message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { PromotionalVideo } from "./types";
import { addOrUpdateVideo } from "@/actions/cmsActions";
import Player from "../player";

const { Option } = Select;

interface VideoModalProps {
	isVisible: boolean;
	editingVideo: PromotionalVideo | null;
	onCancel: () => void;
	setVideos: React.Dispatch<React.SetStateAction<PromotionalVideo[]>>;
	setTotal: React.Dispatch<React.SetStateAction<number>>;
}

export default function VideoModal({
	isVisible,
	editingVideo,
	onCancel,
	setVideos,
	setTotal,
}: VideoModalProps) {
	const [form] = Form.useForm();
	const [fileList, setFileList] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const key = useId();

	const handleSubmit = async (values: any) => {
		try {
			setLoading(true);
			const formData = new FormData();
			formData.append("category", values.category);
			formData.append("hidden", values.hidden.toString());
			formData.append("priority", values.priority.toString());
			formData.append("title", values.title || "");
			formData.append("description", values.description || "");
			if (values.startDate)
				formData.append("startDate", values.startDate.toISOString());
			if (values.endDate)
				formData.append("endDate", values.endDate.toISOString());
			if (fileList[0]) formData.append("video", fileList[0]);
			if (editingVideo) formData.append("id", editingVideo.id);

			const result = await addOrUpdateVideo(formData);
			if (result.success) {
				if (editingVideo) {
					setVideos((prev) =>
						prev.map((v) => (v.id === result.data.id ? result.data : v))
					);
					message.success("Promotional video updated successfully!");
				} else {
					setVideos((prev) => [...prev, result.data]);
					setTotal((prev) => prev + 1);
					message.success("Promotional video added successfully!");
				}
				onCancel();
				form.resetFields();
				setFileList([]);
			} else {
				message.error(result.error || "Failed to save promotional video");
			}
		} catch (error: any) {
			message.error(error.message || "Failed to save promotional video");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Modal
			title={
				editingVideo ? "Edit Promotional Video" : "Create Promotional Video"
			}
			open={isVisible}
			onCancel={onCancel}
			footer={null}
			className="rounded-xl"
			width={1000}
			key={editingVideo?.id ?? key}
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
				onFinish={handleSubmit}
				layout="vertical"
				className="space-y-4"
				initialValues={
					editingVideo
						? {
								...editingVideo,
								startDate: editingVideo.startDate
									? dayjs(editingVideo.startDate)
									: null,
								endDate: editingVideo.endDate
									? dayjs(editingVideo.endDate)
									: null,
						  }
						: {
								priority: 0,
								startDate: null,
								endDate: null,
								title: "",
								description: "",
						  }
				}
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
							rules={[{ required: true, message: "Please select a category" }]}
						>
							<Select className="rounded-full w-full">
								<Option value="PROMOTIONAL">Promotional</Option>
								<Option value="GET_STARTED">Get Started</Option>
							</Select>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							name="hidden"
							label="Visibility"
							rules={[{ required: true, message: "Please select visibility" }]}
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
							rules={[{ required: false, message: "Please enter priority" }]}
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
							<DatePicker style={{ width: "100%" }} className="rounded-full" />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name="endDate" label="End Date">
							<DatePicker style={{ width: "100%" }} className="rounded-full" />
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
	);
}
