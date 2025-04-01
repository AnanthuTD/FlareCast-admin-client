"use client";

import React, { useState, useEffect } from "react";
import {
	Card,
	Typography,
	Select,
	Row,
	Col,
	Statistic,
	message,
	Button,
} from "antd";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import { DownloadOutlined } from "@ant-design/icons";
import Papa from "papaparse";
import jsPDF from "jspdf";
import {
	fetchSalesSummary,
	fetchPlanGroup,
	fetchFreePlanUsage,
	fetchRevenueByPeriod,
	fetchStatusDistribution,
} from "@/actions/reportAction";

const { Title, Text } = Typography;
const { Option } = Select;

const SalesReportPage: React.FC = () => {
	const [period, setPeriod] = useState<
		"daily" | "weekly" | "monthly" | "yearly"
	>("monthly");
	const [planData, setPlanData] = useState<any[]>([]);
	const [freePlanData, setFreePlanData] = useState<{
		count: number;
		plan: any;
	}>({ count: 0, plan: null });
	const [revenueData, setRevenueData] = useState<any[]>([]);
	const [statusData, setStatusData] = useState<any[]>([]);
	const [summary, setSummary] = useState({
		totalRevenue: 0,
		totalSubscriptions: 0,
		activeUsers: 0,
	});
	const [loading, setLoading] = useState(false);

	const fetchData = async () => {
		setLoading(true);
		const [summaryRes, planRes, freeRes, revenueRes, statusRes] =
			await Promise.all([
				fetchSalesSummary(),
				fetchPlanGroup(),
				fetchFreePlanUsage(),
				fetchRevenueByPeriod(period),
				fetchStatusDistribution(),
			]);

		console.log(summaryRes, planRes, freeRes, revenueRes, statusRes);

		if (summaryRes.success) setSummary(summaryRes.data);
		else message.error(summaryRes.message);

		if (planRes.success) setPlanData(planRes.data);
		else message.error(planRes.message);

		if (freeRes.success) setFreePlanData(freeRes.data);
		else message.error(freeRes.message);

		if (revenueRes.success) setRevenueData(revenueRes.data);
		else message.error(revenueRes.message);

		if (statusRes.success) setStatusData(statusRes.data);
		else message.error(statusRes.message);

		setLoading(false);
	};

	useEffect(() => {
		fetchData();
	}, [period]);

	// Download as CSV
	const downloadCSV = (data: any[], filename: string) => {
		const csv = Papa.unparse(data);
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = `${filename}.csv`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	// Download as PDF
	const downloadPDF = (title: string, data: string[][], filename: string) => {
		const doc = new jsPDF();
		doc.setFontSize(16);
		doc.text(title, 20, 20);
		doc.setFontSize(12);
		let y = 30;
		data.forEach((row, index) => {
			doc.text(row.join("  |  "), 20, y + index * 10);
		});
		doc.save(`${filename}.pdf`);
	};

	// Download handlers
	const downloadSummary = (format: "csv" | "pdf") => {
		const data = [
			{
				"Total Revenue (INR)": summary.totalRevenue,
				"Total Subscriptions": summary.totalSubscriptions,
				"Active Users": summary.activeUsers,
			},
		];
		if (format === "csv") {
			downloadCSV(data, "sales_summary");
		} else {
			const pdfData = [
				["Total Revenue (INR)", summary.totalRevenue.toFixed(2)],
				["Total Subscriptions", summary.totalSubscriptions.toString()],
				["Active Users", summary.activeUsers.toString()],
			];
			downloadPDF("Sales Summary", pdfData, "sales_summary");
		}
	};

	const downloadPlanDistribution = (format: "csv" | "pdf") => {
		const data = [
			...planData.map((item) => ({
				"Plan Name": item.planName,
				Subscriptions: item.count,
				"Total Revenue (INR)": item.totalAmount,
				"Plan Price (INR)": item.planPrice,
				"Plan Type": item.planType,
			})),
			{
				"Plan Name": freePlanData.plan?.name || "Free",
				Subscriptions: freePlanData.count,
				"Total Revenue (INR)": 0,
				"Plan Price (INR)": 0,
				"Plan Type": "free",
			},
		];
		if (format === "csv") {
			downloadCSV(data, "plan_distribution");
		} else {
			const pdfData = [
				[
					"Plan Name",
					"Subscriptions",
					"Total Revenue (INR)",
					"Plan Price (INR)",
					"Plan Type",
				],
				...data.map((item) => [
					item["Plan Name"],
					item["Subscriptions"].toString(),
					item["Total Revenue (INR)"].toString(),
					item["Plan Price (INR)"].toString(),
					item["Plan Type"],
				]),
			];
			downloadPDF("Plan Distribution", pdfData, "plan_distribution");
		}
	};

	const downloadRevenueByPeriod = (format: "csv" | "pdf") => {
		const data = revenueData.map((item) => ({
			Period: item.period,
			"Total Revenue (INR)": item.totalRevenue,
			"Subscription Count": item.subscriptionCount,
		}));
		if (format === "csv") {
			downloadCSV(data, `revenue_by_${period}`);
		} else {
			const pdfData = [
				["Period", "Total Revenue (INR)", "Subscription Count"],
				...data.map((item) => [
					item["Period"],
					item["Total Revenue (INR)"].toString(),
					item["Subscription Count"].toString(),
				]),
			];
			downloadPDF(
				`Revenue by ${period.charAt(0).toUpperCase() + period.slice(1)}`,
				pdfData,
				`revenue_by_${period}`
			);
		}
	};

	const downloadStatusDistribution = (format: "csv" | "pdf") => {
		const data = statusData.map((item) => ({
			Status: item._id,
			Count: item.count,
		}));
		if (format === "csv") {
			downloadCSV(data, "status_distribution");
		} else {
			const pdfData = [
				["Status", "Count"],
				...data.map((item) => [item["Status"], item["Count"].toString()]),
			];
			downloadPDF(
				"Subscription Status Distribution",
				pdfData,
				"status_distribution"
			);
		}
	};

	return (
		<div className="p-4 bg-gray-100 min-h-screen">
			<Title level={2} className="text-gray-800 mb-6">
				Sales Report
			</Title>

			{/* Summary Stats */}
			<Row gutter={[16, 16]} className="mb-6">
				<Col xs={24} sm={8}>
					<Statistic
						title="Total Revenue (INR)"
						value={summary?.totalRevenue}
						precision={2}
						loading={loading}
						className="text-center"
					/>
				</Col>
				<Col xs={24} sm={8}>
					<Statistic
						title="Total Subscriptions"
						value={summary?.totalSubscriptions}
						loading={loading}
						className="text-center"
					/>
				</Col>
				<Col xs={24} sm={8}>
					<Statistic
						title="Active Users"
						value={summary?.activeUsers}
						loading={loading}
						className="text-center"
					/>
				</Col>
			</Row>
			<div className="flex justify-end mb-6">
				<Button
					onClick={() => downloadSummary("csv")}
					icon={<DownloadOutlined />}
					className="mr-2"
				>
					CSV
				</Button>
				<Button
					onClick={() => downloadSummary("pdf")}
					icon={<DownloadOutlined />}
				>
					PDF
				</Button>
			</div>

			{/* Period Filter */}
			<div className="flex items-center gap-4 mb-6">
				<Text className="text-gray-700">Filter by Period:</Text>
				<Select
					value={period}
					onChange={(value) => setPeriod(value)}
					className="w-48"
				>
					<Option value="daily">Daily</Option>
					<Option value="weekly">Weekly</Option>
					<Option value="monthly">Monthly</Option>
					<Option value="yearly">Yearly</Option>
				</Select>
			</div>

			{/* Revenue by Period Chart */}
			{revenueData && (
				<Card
					title="Revenue by Period"
					className="shadow-md rounded-lg mb-6 border-none"
				>
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={revenueData}>
							<XAxis dataKey="period" />
							<YAxis />
							<Tooltip />
							<Legend />
							<Bar dataKey="totalRevenue" fill="#1890ff" name="Revenue (INR)" />
							<Bar
								dataKey="subscriptionCount"
								fill="#13c2c2"
								name="Subscriptions"
							/>
						</BarChart>
					</ResponsiveContainer>
					<div className="flex justify-end mt-4">
						<Button
							onClick={() => downloadRevenueByPeriod("csv")}
							icon={<DownloadOutlined />}
							className="mr-2"
						>
							CSV
						</Button>
						<Button
							onClick={() => downloadRevenueByPeriod("pdf")}
							icon={<DownloadOutlined />}
						>
							PDF
						</Button>
					</div>
				</Card>
			)}

			{/* Plan Distribution */}
			{planData && (
				<Card
					title="Subscription Plans"
					className="shadow-md rounded-lg mb-6 border-none"
				>
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={planData}>
							<XAxis dataKey="planName" />
							<YAxis />
							<Tooltip />
							<Legend />
							<Bar dataKey="count" fill="#1890ff" name="Subscriptions" />
							<Bar dataKey="totalAmount" fill="#fadb14" name="Revenue (INR)" />
						</BarChart>
					</ResponsiveContainer>
					<div className="mt-4">
						<Text>
							Free Plan Users: {freePlanData?.count} (Plan:{" "}
							{freePlanData?.plan?.name || "N/A"})
						</Text>
					</div>
					<div className="flex justify-end mt-4">
						<Button
							onClick={() => downloadPlanDistribution("csv")}
							icon={<DownloadOutlined />}
							className="mr-2"
						>
							CSV
						</Button>
						<Button
							onClick={() => downloadPlanDistribution("pdf")}
							icon={<DownloadOutlined />}
						>
							PDF
						</Button>
					</div>
				</Card>
			)}

			{/* Status Distribution */}
			{statusData && (
				<Card
					title="Subscription Status"
					className="shadow-md rounded-lg border-none"
				>
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={statusData}>
							<XAxis dataKey="_id" />
							<YAxis />
							<Tooltip />
							<Legend />
							<Bar dataKey="count" fill="#722ed1" name="Count" />
						</BarChart>
					</ResponsiveContainer>
					<div className="flex justify-end mt-4">
						<Button
							onClick={() => downloadStatusDistribution("csv")}
							icon={<DownloadOutlined />}
							className="mr-2"
						>
							CSV
						</Button>
						<Button
							onClick={() => downloadStatusDistribution("pdf")}
							icon={<DownloadOutlined />}
						>
							PDF
						</Button>
					</div>
				</Card>
			)}
		</div>
	);
};

export default SalesReportPage;
