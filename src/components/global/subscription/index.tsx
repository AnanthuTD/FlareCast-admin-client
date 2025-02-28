"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
	Card,
	Modal,
	Form,
	Input,
	Button,
	InputNumber,
	Select,
	message,
	Tag,
	Row,
	Col,
} from "antd";
import { SubscriptionPlan } from "@/types/types";
import {
	addSubscriptionPlan,
	fetchSubscriptionPlans,
  toggleSubscriptionPlanActive,
} from "@/actions/subscriptionAction";

const { Option } = Select;

const SubscriptionPlans: React.FC = () => {
	const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
	const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
	const [form] = Form.useForm();
	const [loading, setLoading] = useState<boolean>(false);

	const fetchPlans = useCallback(async () => {
		try {
			setLoading(true);
			const data = await fetchSubscriptionPlans();
			setPlans(data);
		} catch (error: any) {
			message.error(error.message);
		} finally {
			setLoading(false);
		}
	}, []);

	const handleAddPlan = async (
		values: Omit<
			SubscriptionPlan,
			"id" | "planId" | "createdAt" | "updatedAt" | "isActive"
		>
	) => {
		try {
			setLoading(true);
			const newPlan = await addSubscriptionPlan(values);
			setPlans((prevPlans) => [...prevPlans, newPlan]);
			message.success("Subscription plan added successfully!");
			setIsModalVisible(false);
			form.resetFields();
		} catch (error: any) {
			message.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	const handleToggleActive = async (planId: string, isActive: boolean) => {
		try {
			setLoading(true);
			const updatedPlan = await toggleSubscriptionPlanActive(planId, isActive);
			setPlans((prevPlans) =>
				prevPlans.map((plan) =>
					plan.planId === updatedPlan.planId ? updatedPlan : plan
				)
			);
			message.success(
				`Plan ${isActive ? "deactivated" : "activated"} successfully!`
			);
		} catch (error: any) {
			message.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPlans();
	}, [fetchPlans]);

	const showModal = (plan?: SubscriptionPlan) => {
		setEditingPlan(plan || null);
		form.setFieldsValue(
			plan || {
				name: "",
				price: 0,
				interval: 1,
				period: "monthly",
				videoPerMonth: 25,
				duration: 5,
				workspace: 1,
				aiFeature: true,
				description: "",
			}
		);
		setIsModalVisible(true);
	};

	return (
		<div className="p-6 bg-gray-50 min-h-screen">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold text-gray-800">Subscription Plans</h1>
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
						onClick={() => fetchPlans()}
						className="bg-black text-white hover:bg-gray-800 transition-colors rounded-full px-6 py-2"
					>
						Refresh
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
				{plans.map((plan) => (
					<Card
						key={plan.id}
						className="border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 bg-white"
						title={
							<div className="flex justify-between items-center">
								<span className="text-xl font-semibold text-gray-900">
									{plan.name}
								</span>
								<Tag
									color={plan.isActive ? "green" : "red"}
									className="rounded-full px-3 py-1 font-medium"
								>
									{plan.isActive ? "Active" : "Inactive"}
								</Tag>
							</div>
						}
						extra={
							<div className="space-x-2">
								<Button
									type="link"
									onClick={() => handleToggleActive(plan.id, plan.isActive)}
									className={
										plan.isActive
											? "text-red-600 hover:text-red-800"
											: "text-green-600 hover:text-green-800"
									}
								>
									{plan.isActive ? "Deactivate" : "Activate"}
								</Button>
							</div>
						}
					>
						<div className="mb-6">
							<p className="text-xl font-semibold text-gray-800 mb-4">
								₹{plan.price}/m
							</p>
							<ul className="list-none space-y-2 text-gray-700">
								<li className="flex items-center">
									<span className="mr-2 text-green-600">✓</span>
									Video Per Month:{" "}
									{plan.videoPerMonth === 0 ? "Unlimited" : plan.videoPerMonth}
								</li>
								<li className="flex items-center">
									<span className="mr-2 text-green-600">✓</span>
									Duration: {plan.duration} minute
								</li>
								<li className="flex items-center">
									<span className="mr-2 text-green-600">✓</span>
									Workspace: {plan.workspace}
								</li>
								<li className="flex items-center">
									<span className="mr-2 text-green-600">✓</span>
									AI Feature: {plan.aiFeature ? "Limited" : "Unlimited"}
								</li>
							</ul>
							{plan.description && (
								<p className="mt-4 text-gray-500 text-sm italic">
									{plan.description}
								</p>
							)}
						</div>
					</Card>
				))}
			</div>

			<Modal
				title={
					editingPlan
						? `Edit ${editingPlan.name}`
						: "Create Premium Subscription Plan"
				}
				open={isModalVisible}
				onCancel={() => {
					setIsModalVisible(false);
					setEditingPlan(null);
					form.resetFields();
				}}
				footer={null}
				className="rounded-xl"
				width={1000}
			>
				<Form
					form={form}
					onFinish={handleAddPlan}
					layout="horizontal"
					labelCol={{ span: 8 }}
					wrapperCol={{ span: 16 }}
					className="space-y-4"
				>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="name"
								label="Plan Name"
								rules={[
									{ required: true, message: "Please enter the plan name" },
								]}
							>
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
								name="price"
								label="Price (INR)"
								rules={[{ required: true, message: "Please enter the price" }]}
							>
								<InputNumber
									min={0}
									step={0.01}
									style={{ width: "100%" }}
									className="rounded-full"
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name="interval"
								label="Interval (e.g., 1 for monthly)"
								rules={[
									{ required: true, message: "Please enter the interval" },
								]}
							>
								<InputNumber
									min={1}
									style={{ width: "100%" }}
									className="rounded-full"
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="period"
								label="Period"
								initialValue="MONTHLY"
								rules={[{ required: true, message: "Please select a period" }]}
							>
								<Select className="rounded-full w-full">
									<Option value="DAILY">Daily</Option>
									<Option value="WEEKLY">Weekly</Option>
									<Option value="MONTHLY">Monthly</Option>
									<Option value="QUARTERLY">Quarterly</Option>
									<Option value="YEARLY">Yearly</Option>
								</Select>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name="videoPerMonth"
								label="Video Per Month"
								rules={[
									{ required: true, message: "Please enter the video limit" },
								]}
							>
								<Select className="rounded-full w-full">
									<Option value={25}>25</Option>
									<Option value={50}>50</Option>
									<Option value={100}>100</Option>
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="duration"
								label="Duration (minutes)"
								rules={[{ required: true, message: "Please enter duration" }]}
							>
								<InputNumber
									min={5}
									style={{ width: "100%" }}
									className="rounded-full"
									placeholder="5 minute"
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name="workspace"
								label="Workspace"
								rules={[{ required: true, message: "Please enter workspace" }]}
							>
								<InputNumber
									min={1}
									style={{ width: "100%" }}
									className="rounded-full"
									placeholder="1"
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="aiFeature"
								label="AI Feature"
								rules={[
									{ required: true, message: "Please select AI feature" },
								]}
							>
								<Select className="rounded-full w-full">
									<Option value={true}>Limited</Option>
									<Option value={false}>Unlimited</Option>
								</Select>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item>
								<Button
									type="primary"
									htmlType="submit"
									loading={loading}
									className="bg-black text-white hover:bg-gray-800 transition-colors rounded-full px-6 py-2 w-full mt-4"
								>
									{editingPlan ? "Update" : "Create"}
								</Button>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Modal>
		</div>
	);
};

export default SubscriptionPlans;
