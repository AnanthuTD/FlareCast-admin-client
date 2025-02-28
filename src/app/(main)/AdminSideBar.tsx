import React from "react";
import {
	HomeOutlined,
	UserOutlined,
	ShopOutlined,
	AppstoreOutlined,
	TagOutlined,
	DollarOutlined,
	FileTextOutlined,
	CreditCardOutlined,
	ProfileOutlined,
	WechatWorkOutlined,
	BellOutlined,
	NotificationOutlined,
} from "@ant-design/icons";
import { getItem } from "@/components/layoutHelpers";
import { Badge } from "antd";
// import useChat from '@/hooks/fetchUnreadChatsStatus';
import { useNotification } from "@/components/NotificationContext";
import BaseSidebar, { MenuItem } from "@/components/BaseSidebar";

const NotificationIcon = () => {
	const { unreadNotificationCount } = useNotification();

	return (
		<Badge size="small" count={unreadNotificationCount}>
			<BellOutlined style={{ fontSize: 17, marginInlineEnd: "10px" }} />
		</Badge>
	);
};

const ChatIcon = () => {
	// const { hasUnreadChats } = useChat('admin', admin?.id);
	const hasUnreadChats = false;

	return (
		<Badge dot={hasUnreadChats} size="default">
			<WechatWorkOutlined style={{ fontSize: 17, marginInlineEnd: "10px" }} />
		</Badge>
	);
};
const items: MenuItem[] = [
	getItem("Dashboard", "/admin/dashboard", <HomeOutlined />),
	getItem("User", "/admin/users", <UserOutlined />),
	getItem("Payment Overview", "/admin/payment-overview", <DollarOutlined />),
	getItem("Reports", "/admin/reports", <FileTextOutlined />),
	// getItem('Notifications ', '/admin/notifications', <NotificationIcon />),
	getItem(
		"Subscription Management",
		"/admin/subscription",
		<CreditCardOutlined />
	),
	// getItem('Notifications', '/admin/notifications', <NotificationOutlined />),
	// getItem('Chats', '/admin/chat', <ChatIcon />),
];

const accountMenuItems = [
	getItem("Profile", "/admin/profile", <ProfileOutlined />),
];

const AdminSidebar = ({ collapsed }: { collapsed: boolean }) => (
	<BaseSidebar
		title="Admin"
		collapsed={collapsed}
		items={items}
		accountMenuItems={accountMenuItems}
	/>
);

export default AdminSidebar;
