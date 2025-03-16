"use client";

import React, { useState, useEffect } from "react";
import {
	Form,
	Input,
	Button,
	Table,
	Modal,
	message,
	InputNumber,
	Select,
	Switch,
} from "antd";
import axiosInstance from "@/lib/axios";

interface SubscriptionPlan {
	id: string;
	type: "free" | "paid"; // Assuming PlanType enum has these values
	planId: string;
	name: string;
	price: number;
	interval: number;
	period: "daily" | "weekly" | "monthly" | "quarterly" | "yearly"; // Lowercase period
	maxRecordingDuration: number;
	hasAiFeatures: boolean;
	allowsCustomBranding: boolean;
	hasAdvancedEditing: boolean;
	maxMembers?: number;
	maxVideoCount: number;
	maxWorkspaces?: number;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

const { Option } = Select;

const SubscriptionPlans: React.FC = () => {
	const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
	const [form] = Form.useForm();
	const [loading, setLoading] = useState<boolean>(false);

	const fetchPlans = async () => {
		try {
			const { data } = await axiosInstance.get<SubscriptionPlan[]>(
				"/api/user/admin/subscription-plans",
				{ withCredentials: true }
			);
			setPlans(data);
		} catch (error) {
			message.error("Failed to load plans.");
		}
	};

	const handleAddPlan = async (
		values: Omit<SubscriptionPlan, "id" | "planId" | "createdAt" | "updatedAt">
	) => {
		try {
			setLoading(true);
			await axiosInstance.post("/api/user/admin/subscription-plans", values, {
				withCredentials: true,
			});
			message.success("Subscription plan added successfully!");
			fetchPlans();
			setIsModalVisible(false);
			form.resetFields();
		} catch (error) {
			message.error("Failed to add plan.");
		} finally {
			setLoading(false);
		}
	};

	const handleDeletePlan = async (planId: string) => {
		try {
			await axiosInstance.delete(
				`/api/user/admin/subscription-plans/${planId}`,
				{
					withCredentials: true,
				}
			);
			message.success("Subscription plan deleted!");
			fetchPlans();
		} catch (error) {
			message.error("Failed to delete plan.");
		}
	};

	useEffect(() => {
		fetchPlans();
	}, []);

	const columns = [
		{ title: "Type", dataIndex: "type", key: "type" },
		{ title: "Name", dataIndex: "name", key: "name" },
		{ title: "Price (INR)", dataIndex: "price", key: "price" },
		{ title: "Interval", dataIndex: "interval", key: "interval" },
		{ title: "Period", dataIndex: "period", key: "period" },
		{
			title: "Max Recording (min)",
			dataIndex: "maxRecordingDuration",
			key: "maxRecordingDuration",
		},
		{
			title: "AI Features",
			dataIndex: "hasAiFeatures",
			key: "hasAiFeatures",
			render: (value: boolean) => (value ? "Yes" : "No"),
		},
		{
			title: "Custom Branding",
			dataIndex: "allowsCustomBranding",
			key: "allowsCustomBranding",
			render: (value: boolean) => (value ? "Yes" : "No"),
		},
		{
			title: "Advanced Editing",
			dataIndex: "hasAdvancedEditing",
			key: "hasAdvancedEditing",
			render: (value: boolean) => (value ? "Yes" : "No"),
		},
		{ title: "Max Members", dataIndex: "maxMembers", key: "maxMembers" },
		{
			title: "Max Video Count",
			dataIndex: "maxVideoCount",
			key: "maxVideoCount",
		},
		{
			title: "Max Workspaces",
			dataIndex: "maxWorkspaces",
			key: "maxWorkspaces",
		},
		{
			title: "Active",
			dataIndex: "isActive",
			key: "isActive",
			render: (value: boolean) => (value ? "Yes" : "No"),
		},
		{
			title: "Created At",
			dataIndex: "createdAt",
			key: "createdAt",
			render: (value: string) => new Date(value).toLocaleDateString(),
		},
		{
			title: "Actions",
			key: "actions",
			render: (_: any, record: SubscriptionPlan) => (
				<Button
					type="primary"
					danger
					onClick={() => handleDeletePlan(record.planId)}
				>
					Delete
				</Button>
			),
		},
	];

	return (
		<div>
			<Button type="primary" onClick={() => setIsModalVisible(true)}>
				Add Subscription Plan
			</Button>

			<Table
				columns={columns}
				dataSource={plans}
				rowKey="id"
				style={{ marginTop: 20 }}
			/>

			<Modal
				title="Add Subscription Plan"
				open={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
			>
				<Form form={form} onFinish={handleAddPlan} layout="vertical">
					<Form.Item
						name="type"
						label="Plan Type"
						rules={[{ required: true, message: "Please select a plan type" }]}
					>
						<Select style={{ width: "100%" }}>
							<Option value="free">Free</Option>
							<Option value="paid">Paid</Option>
						</Select>
					</Form.Item>
					<Form.Item
						name="name"
						label="Plan Name"
						rules={[{ required: true, message: "Please enter the plan name" }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						name="price"
						label="Price (INR)"
						rules={[{ required: true, message: "Please enter the price" }]}
					>
						<InputNumber min={0} step={0.01} style={{ width: "100%" }} />
					</Form.Item>
					<Form.Item
						name="interval"
						label="Interval"
						rules={[{ required: true, message: "Please enter the interval" }]}
					>
						<InputNumber min={1} style={{ width: "100%" }} />
					</Form.Item>
					<Form.Item
						name="period"
						label="Period"
						rules={[{ required: true, message: "Please select a period" }]}
					>
						<Select style={{ width: "100%" }}>
							<Option value="daily">Daily</Option>
							<Option value="weekly">Weekly</Option>
							<Option value="monthly">Monthly</Option>
							<Option value="quarterly">Quarterly</Option>
							<Option value="yearly">Yearly</Option>
						</Select>
					</Form.Item>
					<Form.Item
						name="maxRecordingDuration"
						label="Max Recording Duration (minutes)"
						initialValue={1}
					>
						<InputNumber min={0} style={{ width: "100%" }} />
					</Form.Item>
					<Form.Item
						name="hasAiFeatures"
						label="AI Features"
						valuePropName="checked"
						initialValue={false}
					>
						<Switch />
					</Form.Item>
					<Form.Item
						name="allowsCustomBranding"
						label="Custom Branding"
						valuePropName="checked"
						initialValue={false}
					>
						<Switch />
					</Form.Item>
					<Form.Item
						name="hasAdvancedEditing"
						label="Advanced Editing"
						valuePropName="checked"
						initialValue={false}
					>
						<Switch />
					</Form.Item>
					<Form.Item name="maxMembers" label="Max Members">
						<InputNumber min={0} style={{ width: "100%" }} />
					</Form.Item>
					<Form.Item
						name="maxVideoCount"
						label="Max Video Count"
						initialValue={1}
					>
						<InputNumber min={0} style={{ width: "100%" }} />
					</Form.Item>
					<Form.Item name="maxWorkspaces" label="Max Workspaces">
						<InputNumber min={0} style={{ width: "100%" }} />
					</Form.Item>
					<Form.Item
						name="isActive"
						label="Active"
						valuePropName="checked"
						initialValue={true}
					>
						<Switch />
					</Form.Item>
					<Button type="primary" htmlType="submit" loading={loading}>
						Add Plan
					</Button>
				</Form>
			</Modal>
		</div>
	);
};

export default SubscriptionPlans;
