import { useEffect, useState } from "react";
import { EventName } from "../utils/socket/eventNames";
import {
	VideoStatus,
	SubscriptionUpdate,
	AdminDashboardHook,
	AdminDashboardState,
} from "@/types/types";
import { useSocket } from "./useSocket";

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
	});
	console.log(`${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/admin-dashboard`);
	const { onEvent: onVideoEvent, isConnected: isVideoSocketConnected } =
	useSocket(
		`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin-dashboard` as string,
		"/video/socket.io"
	);
	const { onEvent, isConnected } = useSocket(
		`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin-dashboard` as string,
		"/user/socket.io"
	);

	useEffect(() => {
		onEvent("connect", () => {
			console.log("Connected to admin dashboard WebSocket");
		});

			onVideoEvent(
			EventName.ADMIN_DASHBOARD_INITIAL_DATA,
			(data: AdminDashboardState) => {
				setState(prev=>({...prev, ...data}));
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

		onEvent(EventName.NEW_USER_SIGNUP, (data: { data: any }) => {
			setState((prev) => ({
				...prev,
				newSignups: data.newSignups,
			}));
		});

		onVideoEvent(EventName.VIDEO_TRANSCODE, (data: VideoStatus) => {
			setState((prev) => ({
				...prev,
				transcodingVideos: { ...prev.transcodingVideos, [data.videoId]: data },
			}));
		});

		onVideoEvent(EventName.VIDEO_PROCESSED, (data: VideoStatus) => {
			setState((prev) => ({
				...prev,
				processedVideos: { ...prev.processedVideos, [data.videoId]: data },
			}));
		});

		onVideoEvent(EventName.TRANSCRIPTION, (data: VideoStatus) => {
			setState((prev) => ({
				...prev,
				transcriptions: { ...prev.transcriptions, [data.videoId]: data },
			}));
		});

		onVideoEvent(EventName.TITLE_SUMMARY, (data: VideoStatus) => {
			setState((prev) => ({
				...prev,
				titleSummaries: { ...prev.titleSummaries, [data.videoId]: data },
			}));
		});

		onVideoEvent(EventName.THUMBNAIL, (data: VideoStatus) => {
			setState((prev) => ({
				...prev,
				thumbnails: { ...prev.thumbnails, [data.videoId]: data },
			}));
		});

		onEvent(EventName.SUBSCRIPTION_UPDATE, (data: SubscriptionUpdate) => {
			setState((prev) => ({
				...prev,
				subscriptions: [data, ...prev.subscriptions].slice(0, 5),
			}));
		});

		onEvent("error", (error: { message: string }) => {
			console.error("Socket error:", error.message);
		});

		onVideoEvent("error", (error: { message: string }) => {
			console.error("Socket error:", error.message);
		});
	}, [onEvent, onVideoEvent]);

	return { state, isConnected: isConnected && isVideoSocketConnected };
};
