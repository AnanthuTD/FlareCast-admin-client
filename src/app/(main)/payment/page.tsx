"use client";

import React, { useState, useEffect } from "react";
import { Table, Card, Select, Typography, Space } from "antd";
import { fetchPayments, fetchPaymentStatus } from "@/actions/paymentActions";

// Dummy data type based on your structure
const subscriptionDataType = {
	id: String,
	userId: String,
	planId: String,
	status: String,
	createdAt: Date,
	updatedAt: Date,
	cancelledAt: Date,
	remainingCount: Number,
	razorpaySubscriptionId: String,
	amount: Number,
	plan: { name: String },
	user: { email: String },
};

// Dummy fetch functions
const fetchSubscriptions = async ({ page, limit, status }) => {
	// Simulate API call
	return new Promise((resolve) => {
		setTimeout(() => {
			const dummyData = Array.from({ length: limit }, (_, i) => ({
				id: `${page}-${i}`,
				userId: `user-${page}-${i}`,
				planId: `plan-${page}-${i}`,
				status:
					status ||
					["active", "inactive", "cancelled"][Math.floor(Math.random() * 3)],
				createdAt: new Date(),
				updatedAt: new Date(),
				cancelledAt: null,
				remainingCount: Math.floor(Math.random() * 10),
				razorpaySubscriptionId: `razor-${page}-${i}`,
				amount: Math.floor(Math.random() * 1000) + 500,
				plan: {
					name: ["Basic", "Business", "Premium"][Math.floor(Math.random() * 3)],
				},
				user: { email: `user${page}${i}@example.com` },
			}));
			resolve({
				data: dummyData,
				total: 50, // Simulated total count
			});
		}, 500);
	});
};

const fetchStatusList = async () => {
	// Simulate API call for status list
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(["active", "inactive", "cancelled", "pending"]);
		}, 300);
	});
};

const SubscriptionTable = () => {
	const [subscriptions, setSubscriptions] = useState([]);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [statusFilter, setStatusFilter] = useState("");
	const [statusOptions, setStatusOptions] = useState([]);

	// Fetch status list on mount
	useEffect(() => {
		const loadStatusList = async () => {
			const statuses = await fetchPaymentStatus();
			setStatusOptions(statuses.data);
		};
		loadStatusList();
	}, []);

	// Fetch subscriptions when page, limit, or status changes
	useEffect(() => {
		const loadSubscriptions = async () => {
			setLoading(true);
			const { data, success } = await fetchPayments({
				page,
				limit,
				status: statusFilter,
			});
			setSubscriptions(data.data);
			setTotal(data.total);
			setLoading(false);
		};

		loadSubscriptions();
	}, [page, limit, statusFilter]);

	// Table columns
	const columns = [
		{
			title: "User Email",
			dataIndex: ["user", "email"],
			key: "email",
		},
		{
			title: "Plan",
			dataIndex: ["plan", "name"],
			key: "planName",
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
			render: (text) => (
				<span
					className={`capitalize ${
						text === "active" ? "text-green-600" : "text-gray-600"
					}`}
				>
					{text}
				</span>
			),
		},
		{
			title: "Amount",
			dataIndex: "amount",
			key: "amount",
			render: (text) => `$${text}`,
		},
		{
			title: "Remaining Count",
			dataIndex: "remainingCount",
			key: "remainingCount",
		},
		{
			title: "Created At",
			dataIndex: "createdAt",
			key: "createdAt",
			render: (date) => new Date(date).toLocaleDateString(),
		},
	];

	return (
		<Card
			title={
				<Typography.Title level={4} className="text-gray-800">
					Payments
				</Typography.Title>
			}
			className="shadow-md rounded-lg m-4 w-full max-w-5xl border-none"
		>
			<Space direction="vertical" size="middle" className="w-full">
				{/* Status Filter */}
				<div className="flex items-center gap-4">
					<Typography.Text className="text-gray-700">
						Filter by Status:
					</Typography.Text>
					<Select
						value={statusFilter}
						onChange={(value) => {
							setStatusFilter(value || "");
							setPage(1); // Reset to page 1 on filter change
						}}
						placeholder="All Statuses"
						allowClear
						className="w-48"
					>
						{statusOptions.map((status) => (
							<Select.Option key={status} value={status}>
								{status.charAt(0).toUpperCase() + status.slice(1)}
							</Select.Option>
						))}
					</Select>
				</div>

				{/* Table */}
				<Table
					columns={columns}
					dataSource={subscriptions}
					rowKey="id"
					loading={loading}
					pagination={{
						current: page,
						pageSize: limit,
						total,
						onChange: (newPage, newPageSize) => {
							setPage(newPage);
							setLimit(newPageSize);
						},
						showSizeChanger: true,
						pageSizeOptions: ["10", "20", "50"],
					}}
					className="overflow-x-auto"
				/>
			</Space>
		</Card>
	);
};

export default SubscriptionTable;
