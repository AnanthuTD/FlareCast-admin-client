"use client";

import { useEffect } from "react";
import { useDashboardSocket } from "@/hooks/useDashboardSocket";
import { DashboardStats } from "./DashboardStats";
import { VideoStatusTable } from "./VideoStatusTable";
import { SubscriptionTable } from "./SubscriptionTable";
import { Row, Col, Divider } from "antd";
import { VideoStatus } from "@/types/types";
import { AdminDashboardSkeleton } from "@/app/(main)/dashboard/loading";
import StatusDashboardPie, {
	StatusCountDisplayPie,
} from "./StatusCountDisplayPie";
import StatusDashboardBar, {
	StatusCountDisplayBar,
} from "./StatusCountDisplayBar";

interface StatusBreakdown {
	processing: VideoStatus[];
	success: VideoStatus[];
	failed: VideoStatus[];
}

// Helper to separate videos by status
const separateByStatus = (
	videos: Record<string, VideoStatus>
): StatusBreakdown => {
	const processing: VideoStatus[] = [];
	const success: VideoStatus[] = [];
	const failed: VideoStatus[] = [];

	Object.values(videos).forEach((video) => {
		switch (video.status.toUpperCase()) {
			case "PROCESSING":
				processing.push(video);
				break;
			case "SUCCESS":
				success.push(video);
				break;
			case "FAILED":
				failed.push(video);
				break;
		}
	});

	return { processing, success, failed };
};

export const ClientDashboard = () => {
	const { state, isConnected } = useDashboardSocket();

	useEffect(() => {
		console.log("ClientDashboard state: ", state);
	}, [state]);

	if (!isConnected) return <AdminDashboardSkeleton />;

	// Separate statuses for each category
	const transcoding = separateByStatus(state.transcodingVideos);
	const processed = separateByStatus(state.processedVideos);
	const transcriptions = separateByStatus(state.transcriptions);
	const titleSummaries = separateByStatus(state.titleSummaries);
	const thumbnails = separateByStatus(state.thumbnails);

	return (
		<>
			<DashboardStats state={state} />

			<Divider />

			<StatusDashboardPie data={state} />

			<Divider />

			<StatusDashboardBar data={state} />

			{/* Video Processing Sections */}
			{/* <Row gutter={[16, 16]} className="mt-6">
				<Col xs={24} md={8}>
					<VideoStatusTable
						title="Transcoding - Processing"
						data={transcoding.processing}
					/>
				</Col>
				<Col xs={24} md={8}>
					<VideoStatusTable
						title="Transcoding - Completed"
						data={transcoding.success}
					/>
				</Col>
				<Col xs={24} md={8}>
					<VideoStatusTable
						title="Transcoding - Failed"
						data={transcoding.failed}
					/>
				</Col>
			</Row>

			<Row gutter={[16, 16]} className="mt-6">
				<Col xs={24} md={8}>
					<VideoStatusTable
						title="Processed Videos - Success"
						data={processed.success}
					/>
				</Col>
				<Col xs={24} md={8}>
					<VideoStatusTable
						title="Processed Videos - Processing"
						data={processed.processing}
					/>
				</Col>
				<Col xs={24} md={8}>
					<VideoStatusTable
						title="Processed Videos - Failed"
						data={processed.failed}
					/>
				</Col>
			</Row>

			<Row gutter={[16, 16]} className="mt-6">
				<Col xs={24} md={8}>
					<VideoStatusTable
						title="Transcriptions - Processing"
						data={transcriptions.processing}
					/>
				</Col>
				<Col xs={24} md={8}>
					<VideoStatusTable
						title="Transcriptions - Completed"
						data={transcriptions.success}
					/>
				</Col>
				<Col xs={24} md={8}>
					<VideoStatusTable
						title="Transcriptions - Failed"
						data={transcriptions.failed}
					/>
				</Col>
			</Row>

			<Row gutter={[16, 16]} className="mt-6">
				<Col xs={24} md={8}>
					<VideoStatusTable
						title="Title & Summary - Processing"
						data={titleSummaries.processing}
					/>
				</Col>
				<Col xs={24} md={8}>
					<VideoStatusTable
						title="Title & Summary - Completed"
						data={titleSummaries.success}
					/>
				</Col>
				<Col xs={24} md={8}>
					<VideoStatusTable
						title="Title & Summary - Failed"
						data={titleSummaries.failed}
					/>
				</Col>
			</Row>

			<Row gutter={[16, 16]} className="mt-6">
				<Col xs={24} md={8}>
					<VideoStatusTable
						title="Thumbnails - Processing"
						data={thumbnails.processing}
					/>
				</Col>
				<Col xs={24} md={8}>
					<VideoStatusTable
						title="Thumbnails - Completed"
						data={thumbnails.success}
					/>
				</Col>
				<Col xs={24} md={8}>
					<VideoStatusTable
						title="Thumbnails - Failed"
						data={thumbnails.failed}
					/>
				</Col>
			</Row> */}

			<Row gutter={[16, 16]} className="mt-6">
				<Col xs={24} md={12}>
					<SubscriptionTable subscriptions={state.subscriptions} />
				</Col>
			</Row>
		</>
	);
};
