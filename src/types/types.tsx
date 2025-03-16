export interface User {
	id: string;
	email: string;
	[key: string]: any;
}

export interface UserState {
	user: User | null;
	isAuthenticated: boolean;
	loading: boolean;
	error: string | null;
}

export interface Credentials {
	email: string;
	password: string;
}

export interface LoginPayload {
	user: User;
}

export interface SubscriptionPlan {
	id: string;
	planId: string; // Razorpay plan ID
	name: string;
	price: number;
	interval: number;
	productLimit: number; // Renamed to videoPerMonth for clarity
	period: "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY";
	description?: string;
	videoPerMonth: number; // Renamed from productLimit
	duration: number; // Changed to number (5-minute default)
	workspace: number; // Changed to number (1 workspace default)
	aiFeature: boolean; // Changed to boolean (true for Limited, false for Unlimited)
	isActive: boolean; // Add status
	createdAt: string;
	updatedAt: string;
}

export interface VideoStatus {
	videoId: string;
	status: "processing" | "success" | "failed";
	[key: string]: any; // For additional fields like transcription, title, etc.
}

export interface SubscriptionUpdate {
	userId: string;
	status: string;
}

export interface AdminDashboardHook {
	state: AdminDashboardState
	isConnected: boolean;
}

export interface AdminDashboardState {
	activeUsers: number;
	newSignups: number;
  totalUsers: number;
	transcodingVideos: Record<string, VideoStatus>;
	processedVideos: Record<string, VideoStatus>;
	transcriptions: Record<string, VideoStatus>;
	titleSummaries: Record<string, VideoStatus>;
	thumbnails: Record<string, VideoStatus>;
	subscriptions: SubscriptionUpdate[];
	activeSubscriptionsCount: number;
}
