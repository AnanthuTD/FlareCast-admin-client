"use client";

import React, { useEffect, useRef, useState } from "react";
import {
	Table,
	Modal,
	Avatar,
	Button,
	Input,
	Switch,
	Space,
	Popconfirm,
	Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import axiosInstance from "@/lib/axios";
import { User } from "@/types/types"; // Adjust path to your User type
import AvatarPlaceHolder from "../avatar-placeholder";
import { FilterDropdownProps } from "antd/es/table/interface";

// Define response type from the paginated controller
interface PaginatedUsersResponse {
	success: boolean;
	data: {
		users: User[];
		pagination: {
			total: number;
			totalPages: number;
			currentPage: number;
			limit: number;
		};
	};
}

const UsersListPage: React.FC = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [pagination, setPagination] = useState({
		current: 1,
		pageSize: 10,
		total: 0,
	});
	const [searchQuery, setSearchQuery] = useState("");
	const [includeBanned, setIncludeBanned] = useState(false);
	const debounceRef = useRef<null | NodeJS.Timeout>(null);

	// Fetch users from the paginated endpoint
	const fetchUsers = async (page: number = 1, pageSize: number = 10) => {
		setLoading(true);
		try {
			const response = await axiosInstance.get<PaginatedUsersResponse>(
				"/api/admin/users",
				{
					params: {
						page,
						limit: pageSize,
						q: searchQuery || undefined,
						includeBanned: includeBanned ? "true" : undefined,
					},
					withCredentials: true,
				}
			);

			const {
				users,
				pagination: { total, totalPages, currentPage },
			} = response.data;
			setUsers(users);
			setPagination({
				current: currentPage,
				pageSize,
				total,
			});
		} catch (error) {
			console.error("Error fetching users:", error);
		} finally {
			setLoading(false);
		}
	};

	// Ban or unban a user
	const handleBanUser = async (userId: string, isBanned: boolean) => {
		setLoading(true);
		try {
			await axiosInstance.put(
				`/api/admin/users/${userId}/ban`,
				{ isBanned: !isBanned },
				{ withCredentials: true }
			);
			// Update local state optimistically
			setUsers((prevUsers) =>
				prevUsers.map((user) =>
					user.id === userId ? { ...user, isBanned: !isBanned } : user
				)
			);
		} catch (error) {
			console.error("Error banning user:", error);
		} finally {
			setLoading(false);
		}
	};

	// Fetch users on mount and when pagination, search, or banned filter changes
	useEffect(() => {
		debounceRef.current = setTimeout(() => {
			debounceRef.current = null;
			fetchUsers(pagination.current, pagination.pageSize);
		}, 2000);

		return () => {
			if (!debounceRef.current) return;
			clearTimeout(debounceRef.current);
			debounceRef.current = null;
		};
	}, [pagination.current, pagination.pageSize, searchQuery, includeBanned]);

	// Handle pagination change
	const handleTableChange = (newPagination: any) => {
		setPagination({
			...pagination,
			current: newPagination.current,
			pageSize: newPagination.pageSize,
		});
	};

	// Handle search input change
	const handleSearch = (value: string) => {
		setSearchQuery(value);
		setPagination({ ...pagination, current: 1 });
	};

	// Open Modal with user details
	const showUserDetails = (user: User) => {
		setSelectedUser(user);
		setIsModalVisible(true);
	};

	// Close Modal
	const handleCloseModal = () => {
		setIsModalVisible(false);
		setSelectedUser(null);
	};

	// Define table columns with filters
	const columns: ColumnsType<User> = [
		{
			title: "Avatar",
			dataIndex: "image",
			key: "avatar",
			render: (image, record) => (
				<Avatar src={image} size="large">
					<AvatarPlaceHolder value={record.firstName[0]} />
				</Avatar>
			),
		},
		{
			title: "Name",
			key: "name",
			render: (record) => `${record.firstName} ${record.lastName || ""}`,
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
			filterDropdown: ({
				setSelectedKeys,
				selectedKeys,
				confirm,
				clearFilters,
			}: FilterDropdownProps) => (
				<div style={{ padding: 8 }}>
					<Input
						placeholder="Filter by email"
						value={selectedKeys[0] as string}
						onChange={(e) =>
							setSelectedKeys(e.target.value ? [e.target.value] : [])
						}
						onPressEnter={() => confirm()}
						style={{ marginBottom: 8, display: "block" }}
					/>
					<Space>
						<Button type="primary" onClick={() => confirm()} size="small">
							Filter
						</Button>
						<Button onClick={() => clearFilters && clearFilters()} size="small">
							Reset
						</Button>
					</Space>
				</div>
			),
			onFilter: (value, record) =>
				record.email.toLowerCase().includes((value as string).toLowerCase()),
		},
		{
			title: "Status",
			dataIndex: "isBanned",
			key: "isBanned",
			render: (isBanned) => (
				<Tag color={isBanned ? "red" : "green"}>
					{isBanned ? "Banned" : "Active"}
				</Tag>
			),
			filterDropdown: ({
				setSelectedKeys,
				selectedKeys,
				confirm,
				clearFilters,
			}: FilterDropdownProps) => (
				<div style={{ padding: 8 }}>
					<Switch
						checked={selectedKeys[0] === "banned"}
						onChange={(checked) => setSelectedKeys(checked ? ["banned"] : [])}
						checkedChildren="Banned"
						unCheckedChildren="Active"
					/>
					<Space style={{ marginTop: 8 }}>
						<Button type="primary" onClick={() => confirm()} size="small">
							Filter
						</Button>
						<Button onClick={() => clearFilters && clearFilters()} size="small">
							Reset
						</Button>
					</Space>
				</div>
			),
			onFilter: (value, record) =>
				value === "banned" ? record.isBanned : !record.isBanned,
		},
		{
			title: "Actions",
			key: "actions",
			render: (_, record) => (
				<Space>
					<Button type="link" onClick={() => showUserDetails(record)}>
						View Details
					</Button>
					<Popconfirm
						title={`Are you sure you want to ${
							record.isBanned ? "unban" : "ban"
						} this user?`}
						onConfirm={() => handleBanUser(record.id, record.isBanned)}
						okText="Yes"
						cancelText="No"
					>
						<Button type="link" danger={!record.isBanned}>
							{record.isBanned ? "Unban" : "Ban"}
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div>
			<Space style={{ marginBottom: 16 }}>
				<Input.Search
					placeholder="Search users by name or email"
					allowClear
					onSearch={handleSearch}
					onChange={(e) => handleSearch(e.target.value)}
					style={{ width: 300 }}
				/>
				<Switch
					checked={includeBanned}
					onChange={(checked) => setIncludeBanned(checked)}
					checkedChildren="Show Banned"
					unCheckedChildren="Hide Banned"
				/>
			</Space>

			<Table<User>
				columns={columns}
				dataSource={users}
				rowKey="id"
				loading={loading}
				pagination={{
					current: pagination.current,
					pageSize: pagination.pageSize,
					total: pagination.total,
					showSizeChanger: true,
					pageSizeOptions: ["5", "10", "20"],
					onChange: (page, pageSize) =>
						handleTableChange({ current: page, pageSize }),
				}}
			/>

			<Modal
				title={
					selectedUser
						? `${selectedUser.firstName} ${selectedUser.lastName || ""}`
						: "User Details"
				}
				open={isModalVisible}
				onCancel={handleCloseModal}
				footer={null}
			>
				{selectedUser && (
					<div>
						<Avatar
							src={selectedUser.image}
							size={100}
							style={{ marginBottom: 16 }}
						>
							<AvatarPlaceHolder value={selectedUser.firstName[0]} />
						</Avatar>
						<p>
							<strong>Name:</strong> {selectedUser.firstName}{" "}
							{selectedUser.lastName || ""}
						</p>
						<p>
							<strong>Email:</strong> {selectedUser.email}
						</p>
						<p>
							<strong>Status:</strong>{" "}
							{selectedUser.isBanned ? "Banned" : "Active"}
						</p>
						<p>
							<strong>Created At:</strong>{" "}
							{new Date(selectedUser.createdAt).toLocaleString()}
						</p>
					</div>
				)}
			</Modal>
		</div>
	);
};

export default UsersListPage;
