import { Card, Table, Tag } from "antd";
import { SubscriptionUpdate } from "@/types/types";

interface SubscriptionTableProps {
	subscriptions: SubscriptionUpdate[];
}

export const SubscriptionTable = ({
	subscriptions,
}: SubscriptionTableProps) => {
	const columns = [
		{ title: "Plan", dataIndex: ["plan", "name"], key: "plan" },
		{ title: "Amount", dataIndex: ["amount"], key: "planAmount" },
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
			render: (status: string) => (
				<Tag color={status === "active" ? "green" : "red"}>{status}</Tag>
			),
		},
	];

	return (
		<Card title="Recent Subscription Updates">
			<Table
				dataSource={subscriptions}
				columns={columns}
				pagination={false}
				size="small"
			/>
		</Card>
	);
};
