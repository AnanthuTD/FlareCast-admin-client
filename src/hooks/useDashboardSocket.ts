import { useEffect, useState } from "react";
import { EventName } from "../utils/socket/eventNames";
import {
	VideoStatus,
	SubscriptionUpdate,
	AdminDashboardHook,
	AdminDashboardState,
} from "@/types/types";
import { useSocket } from "./useSocket";

// Helper function to remove a video from a specific category
const removeVideoFromCategory = (
	category: Record<string, VideoStatus>,
	videoId: string
): Record<string, VideoStatus> => {
	if (category[videoId]) {
		const { [videoId]: _, ...rest } = category;
		return rest;
	}
	return category;
};

export const useDashboardSocket = (): AdminDashboardHook => {
	const [state, setState] = useState<AdminDashboardHook["state"]>({
		activeUsers: 0,
		newSignups: 0,
		totalUsers: 0,
		transcodingVideos: {},
		processedVideos: {},
		transcriptions: {},
		titleSummaries: {},
		thumbnails: {},
		subscriptions: [],
		activeSubscriptionsCount: 0,
	});

	const {
		onEvent: onVideoEvent,
		isConnected: isVideoSocketConnected,
		emitEvent: videoEmit,
	} = useSocket(
		`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin-dashboard` as string,
		"/video/socket.io"
	);
	const { onEvent, isConnected, emitEvent } = useSocket(
		`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin-dashboard` as string,
		"/user/socket.io"
	);

	useEffect(() => {
		onEvent("connect", () => {
			console.log("Connected to admin dashboard WebSocket");
		});

		onVideoEvent(
			EventName.ADMIN_DASHBOARD_INITIAL_DATA,
			(data: AdminDashboardState, statusCount) => {
				setState((prev) => ({ ...prev, ...data, ...statusCount }));
			}
		);

		onEvent(
			EventName.ADMIN_DASHBOARD_INITIAL_DATA,
			(data: AdminDashboardState) => {
				console.log(data);
				setState((prev) => ({ ...prev, ...data }));
			}
		);

		onEvent(EventName.ACTIVE_USERS_COUNT, (data: { count: number }) => {
			setState((prev) => ({ ...prev, activeUsers: data.count }));
		});

		onEvent(EventName.NEW_USER_SIGNUP, (data: { newSignups: number }) => {
			setState((prev) => ({
				...prev,
				newSignups: data.newSignups,
			}));
		});

		onVideoEvent(EventName.VIDEO_TRANSCODE, (data: VideoStatus) => {
			setState((prev) => ({
				...prev,
				transcodingVideos: {
					...removeVideoFromCategory(prev.transcodingVideos, data.videoId),
					[data.videoId]: data,
				},
			}));
		});

		onVideoEvent(EventName.VIDEO_PROCESSED, (data: VideoStatus) => {
			setState((prev) => ({
				...prev,
				processedVideos: {
					...removeVideoFromCategory(prev.processedVideos, data.videoId),
					[data.videoId]: data,
				},
			}));
		});

		onVideoEvent(EventName.TRANSCRIPTION, (data: VideoStatus) => {
			setState((prev) => ({
				...prev,
				transcriptions: {
					...removeVideoFromCategory(prev.transcriptions, data.videoId),
					[data.videoId]: data,
				},
			}));
		});

		onVideoEvent(EventName.TITLE_SUMMARY, (data: VideoStatus) => {
			setState((prev) => ({
				...prev,
				titleSummaries: {
					...removeVideoFromCategory(prev.titleSummaries, data.videoId),
					[data.videoId]: data,
				},
			}));
		});

		onVideoEvent(EventName.THUMBNAIL, (data: VideoStatus) => {
			setState((prev) => ({
				...prev,
				thumbnails: {
					...removeVideoFromCategory(prev.thumbnails, data.videoId),
					[data.videoId]: data,
				},
			}));
		});

		onEvent(EventName.SUBSCRIPTION_UPDATE, (data: SubscriptionUpdate) => {
			setState((prev) => ({
				...prev,
				subscriptions: [data, ...prev.subscriptions].slice(0, 5),
			}));
			if (data.status === "active") {
				setState((prev) => ({
					...prev,
					activeSubscriptionsCount: prev.activeSubscriptionsCount + 1,
				}));
			}
		});

		onEvent("error", (error: { message: string }) => {
			console.error("Socket error:", error.message);
		});

		onVideoEvent("error", (error: { message: string }) => {
			console.error("Socket error:", error.message);
		});
	}, [onEvent, onVideoEvent]);

	const fetchInitialData = () => {
		videoEmit(EventName.ADMIN_DASHBOARD_INITIAL_DATA, null);
		emitEvent(EventName.ADMIN_DASHBOARD_INITIAL_DATA, null);
	};

	return { state, isConnected: isConnected && isVideoSocketConnected, fetchInitialData };
};
