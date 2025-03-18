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
	VideoCameraOutlined
} from "@ant-design/icons";
import { getItem } from "@/components/layoutHelpers";
import { Badge } from "antd";
// import useChat from '@/hooks/fetchUnreadChatsStatus';
// import { useNotification } from "@/components/NotificationContext";
import BaseSidebar, { MenuItem } from "@/components/BaseSidebar";

/* const NotificationIcon = () => {
	const { unreadNotificationCount } = useNotification();

	return (
		<Badge size="small" count={unreadNotificationCount}>
			<BellOutlined style={{ fontSize: 17, marginInlineEnd: "10px" }} />
		</Badge>
	);
}; */

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
	getItem("Dashboard", "/dashboard", <HomeOutlined />),
	getItem("User", "/users", <UserOutlined />),
	getItem("CMS", "/cms", <VideoCameraOutlined />),
	getItem("Payment Overview", "/payment-overview", <DollarOutlined />),
	getItem("Reports", "/reports", <FileTextOutlined />),
	// getItem('Notifications ', '/notifications', <NotificationIcon />),
	getItem(
		"Subscription Management",
		"/subscription",
		<CreditCardOutlined />
	),
	// getItem('Notifications', '/notifications', <NotificationOutlined />),
	// getItem('Chats', '/chat', <ChatIcon />),
];

const accountMenuItems = [
	getItem("Profile", "/profile", <ProfileOutlined />),
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
