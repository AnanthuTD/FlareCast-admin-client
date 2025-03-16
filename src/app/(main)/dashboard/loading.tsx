import { Row, Col } from "antd";
import { SkeletonStats } from "@/components/global/dashboard/SkeletonStats";
import { SkeletonTable } from "@/components/global/dashboard/SkeletonTable";

export const AdminDashboardSkeleton = () => (
	<>
		{/* Skeleton for Stats */}
		<SkeletonStats />

		{/* Skeleton for Video Processing Sections */}
		<Row gutter={[16, 16]} className="mt-6">
			<Col xs={24} md={12}>
				<SkeletonTable title="Transcoding - Processing" />
			</Col>
			<Col xs={24} md={12}>
				<SkeletonTable title="Transcoding - Completed" />
			</Col>
			<Col xs={24} md={12}>
				<SkeletonTable title="Transcoding - Failed" />
			</Col>
		</Row>
		<Row gutter={[16, 16]} className="mt-6">
			<Col xs={24} md={12}>
				<SkeletonTable title="Processed Videos" />
			</Col>
			<Col xs={24} md={12}>
				<SkeletonTable title="Transcriptions - Processing" />
			</Col>
			<Col xs={24} md={12}>
				<SkeletonTable title="Transcriptions - Failed" />
			</Col>
		</Row>
		<Row gutter={[16, 16]} className="mt-6">
			<Col xs={24} md={12}>
				<SkeletonTable title="Transcriptions - Completed" />
			</Col>
			<Col xs={24} md={12}>
				<SkeletonTable title="Title & Summary - Processing" />
			</Col>
			<Col xs={24} md={12}>
				<SkeletonTable title="Title & Summary - Failed" />
			</Col>
		</Row>
		<Row gutter={[16, 16]} className="mt-6">
			<Col xs={24} md={12}>
				<SkeletonTable title="Title & Summary - Completed" />
			</Col>
			<Col xs={24} md={12}>
				<SkeletonTable title="Thumbnails - Processing" />
			</Col>
			<Col xs={24} md={12}>
				<SkeletonTable title="Thumbnails - Failed" />
			</Col>
		</Row>
		<Row gutter={[16, 16]} className="mt-6">
			<Col xs={24} md={12}>
				<SkeletonTable title="Thumbnails - Completed" />
			</Col>
			<Col xs={24} md={12}>
				<SkeletonTable title="Recent Subscription Updates" />
			</Col>
		</Row>
	</>
);

export default function Loading() {
	return <AdminDashboardSkeleton />;
}
