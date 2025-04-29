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
	Pagination, 
} from "antd";
import {
	addSubscriptionPlan,
	fetchSubscriptionPlans,
	toggleSubscriptionPlanActive,
} from "@/actions/subscriptionAction";

const { Option } = Select;

interface SubscriptionPlan {
	id: string;
	type: "free" | "paid";
	planId?: string;
	name: string;
	price: number;
	interval?: number; 
	period?: "daily" | "weekly" | "monthly" | "quarterly" | "yearly"; 
	maxRecordingDuration: number;
	hasAiFeatures: boolean;
	allowsCustomBranding: boolean;
	hasAdvancedEditing: boolean;
	maxMembers?: number;
	maxVideoCount?: number;
	maxWorkspaces?: number;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

const SubscriptionPlans: React.FC = () => {
	const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
	const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
	const [form] = Form.useForm();
	const [loading, setLoading] = useState<boolean>(false);
	// Pagination and filter states
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(9); 
	const [totalPlans, setTotalPlans] = useState<number>(0);
	const [statusFilter, setStatusFilter] = useState<string>("all");

	const fetchPlans = useCallback(async () => {
		try {
			setLoading(true);
			const skip = (currentPage - 1) * pageSize;
			const params: { skip: number; limit: number; status?: string } = {
				skip,
				limit: pageSize,
			};

			params.status = statusFilter;

			const data = await fetchSubscriptionPlans(params);
			setPlans(data.plans || []);
			setTotalPlans(data.total || 0);
		} catch (error: any) {
			message.error(error.message || "Failed to fetch subscription plans");
		} finally {
			setLoading(false);
		}
	}, [currentPage, pageSize, statusFilter]);

	const handleAddOrUpdatePlan = async (
		values: Omit<SubscriptionPlan, "id" | "planId" | "createdAt" | "updatedAt">
	) => {
		try {
			setLoading(true);
			if (values.type === "free") {
				values.price = 0;
				delete values.interval; 
				delete values.period;
			}
			const newPlan = await addSubscriptionPlan(values);
			if (editingPlan) {
				setPlans((prevPlans) =>
					prevPlans.map((plan) => (plan.id === newPlan.id ? newPlan : plan))
				);
				message.success("Subscription plan updated successfully!");
			} else {
				fetchPlans() 
				message.success("Subscription plan added successfully!");
			}
			setIsModalVisible(false);
			setEditingPlan(null);
			form.resetFields();
		} catch (error: any) {
			message.error(error.message || "Failed to save subscription plan");
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
					plan.id === updatedPlan.id ? updatedPlan : plan
				)
			);
			message.success(
				`Plan ${isActive ? "deactivated" : "activated"} successfully!`
			);
		} catch (error: any) {
			message.error(error.message || "Failed to toggle plan status");
		} finally {
			setLoading(false);
		}
	};

	const handlePageChange = (page: number, newPageSize?: number) => {
		setCurrentPage(page);
		if (newPageSize && newPageSize !== pageSize) {
			setPageSize(newPageSize);
			setCurrentPage(1); 
		}
	};

	const handleStatusFilterChange = (value: string) => {
		setStatusFilter(value);
		setCurrentPage(1);
	};

	useEffect(() => {
		fetchPlans();
	}, [fetchPlans]);

	const showModal = (plan?: SubscriptionPlan) => {
		setEditingPlan(plan || null);
		form.setFieldsValue(
			plan || {
				type: "paid",
				name: "",
				price: 0,
				interval: 1,
				period: "monthly",
				maxRecordingDuration: 1,
				hasAiFeatures: false,
				allowsCustomBranding: false,
				hasAdvancedEditing: false,
				maxMembers: undefined,
				maxVideoCount: 1,
				maxWorkspaces: undefined,
				isActive: true,
			}
		);
		setIsModalVisible(true);
	};

	return (
		<div className="p-6 bg-gray-50 min-h-screen">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold text-gray-800">Subscription Plans</h1>
				<div className="space-x-4 flex items-center">
					<Select
						value={statusFilter}
						onChange={handleStatusFilterChange}
						className="w-32 rounded-full"
						placeholder="Filter by status"
					>
						<Option value="all">All</Option>
						<Option value="active">Active</Option>
						<Option value="inactive">Inactive</Option>
					</Select>
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
								{/* <Button
                  type="link"
                  onClick={() => showModal(plan)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </Button> */}
							</div>
						}
					>
						<div className="mb-6">
							<p className="text-xl font-semibold text-gray-800 mb-4">
								₹{plan.price}
								{plan.type === "paid" && plan.period ? `/${plan.period}` : ""}
							</p>
							<ul className="list-none space-y-2 text-gray-700">
								<li className="flex items-center">
									<span className="mr-2 text-green-600">✓</span>
									Max Recording Duration: {plan.maxRecordingDuration} min
								</li>
								<li className="flex items-center">
									<span className="mr-2 text-green-600">✓</span>
									AI Features: {plan.hasAiFeatures ? "Yes" : "No"}
								</li>
								<li className="flex items-center">
									<span className="mr-2 text-green-600">✓</span>
									Custom Branding: {plan.allowsCustomBranding ? "Yes" : "No"}
								</li>
								<li className="flex items-center">
									<span className="mr-2 text-green-600">✓</span>
									Advanced Editing: {plan.hasAdvancedEditing ? "Yes" : "No"}
								</li>
								{plan.maxMembers && (
									<li className="flex items-center">
										<span className="mr-2 text-green-600">✓</span>
										Max Members: {plan.maxMembers}
									</li>
								)}
								{plan.maxVideoCount && (
									<li className="flex items-center">
										<span className="mr-2 text-green-600">✓</span>
										Max Video Count: {plan.maxVideoCount}
									</li>
								)}
								{plan.maxWorkspaces && (
									<li className="flex items-center">
										<span className="mr-2 text-green-600">✓</span>
										Max Workspaces: {plan.maxWorkspaces}
									</li>
								)}
							</ul>
						</div>
					</Card>
				))}
			</div>

			{/* Pagination Component */}
			<div className="mt-8 flex justify-center">
				<Pagination
					current={currentPage}
					pageSize={pageSize}
					total={totalPlans}
					onChange={handlePageChange}
					showSizeChanger
					pageSizeOptions={["9", "18", "27"]} // Options for plans per page
					className="pagination"
				/>
			</div>

			<Modal
				title={
					editingPlan ? `Edit ${editingPlan.name}` : "Create Subscription Plan"
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
					onFinish={handleAddOrUpdatePlan}
					layout="horizontal"
					labelCol={{ span: 8 }}
					wrapperCol={{ span: 16 }}
					className="space-y-4"
				>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="type"
								label="Plan Type"
								rules={[{ required: true, message: "Please select plan type" }]}
							>
								<Select
									className="rounded-full w-full"
									onChange={(value) => form.setFieldsValue({ type: value })}
								>
									<Option value="free">Free</Option>
									<Option value="paid">Paid</Option>
								</Select>
							</Form.Item>
						</Col>
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
					</Row>
					<Form.Item
						noStyle
						shouldUpdate={(prev, curr) => prev.type !== curr.type}
					>
						{({ getFieldValue }) =>
							getFieldValue("type") === "paid" ? (
								<>
									<Row gutter={16}>
										<Col span={12}>
											<Form.Item
												name="price"
												label="Price (INR)"
												rules={[
													{ required: true, message: "Please enter the price" },
												]}
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
												label="Interval"
												rules={[
													{
														required: true,
														message: "Please enter the interval",
													},
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
												rules={[
													{ required: true, message: "Please select a period" },
												]}
											>
												<Select className="rounded-full w-full">
													<Option value="daily">Daily</Option>
													<Option value="weekly">Weekly</Option>
													<Option value="monthly">Monthly</Option>
													<Option value="quarterly">Quarterly</Option>
													<Option value="yearly">Yearly</Option>
												</Select>
											</Form.Item>
										</Col>
									</Row>
								</>
							) : (
								<Row gutter={16}>
									<Col span={12}>
										<Form.Item label="Price (INR)">
											<InputNumber
												value={0}
												disabled
												className="rounded-full"
											/>
										</Form.Item>
									</Col>
								</Row>
							)
						}
					</Form.Item>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="maxRecordingDuration"
								label="Max Recording Duration (min)"
								rules={[
									{ required: true, message: "Please enter max duration" },
								]}
							>
								<InputNumber
									min={1}
									style={{ width: "100%" }}
									className="rounded-full"
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name="hasAiFeatures"
								label="AI Features"
								rules={[
									{ required: true, message: "Please select AI features" },
								]}
							>
								<Select className="rounded-full w-full">
									<Option value={true}>Yes</Option>
									<Option value={false}>No</Option>
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						{/* <Col span={12}>
              <Form.Item
                name="allowsCustomBranding"
                label="Custom Branding"
                rules={[{ required: true, message: "Please select custom branding" }]}
              >
                <Select className="rounded-full w-full">
                  <Option value={true}>Yes</Option>
                  <Option value={false}>No</Option>
                </Select>
              </Form.Item>
            </Col> */}
						<Col span={12}>
							<Form.Item
								name="hasAdvancedEditing"
								label="Advanced Editing"
								rules={[
									{ required: true, message: "Please select advanced editing" },
								]}
							>
								<Select className="rounded-full w-full">
									<Option value={true}>Yes</Option>
									<Option value={false}>No</Option>
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name="maxMembers" label="Max Members (Optional)">
								<InputNumber
									min={1}
									style={{ width: "100%" }}
									className="rounded-full"
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name="maxVideoCount"
								label="Max Video Count"
								rules={[
									{ required: true, message: "Please enter max video count" },
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
							<Form.Item name="maxWorkspaces" label="Max Workspaces (Optional)">
								<InputNumber
									min={1}
									style={{ width: "100%" }}
									className="rounded-full"
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name="isActive"
								label="Active"
								rules={[
									{ required: true, message: "Please select active status" },
								]}
							>
								<Select className="rounded-full w-full">
									<Option value={true}>Yes</Option>
									<Option value={false}>No</Option>
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
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
