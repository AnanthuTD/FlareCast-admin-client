export interface PromotionalVideo {
	id: string;
	category: "PROMOTIONAL" | "NEW_FEATURE";
	hidden: boolean;
	videoId: string;
	priority: number;
	startDate?: string | null;
	endDate?: string | null;
	title?: string | null;
	description?: string | null;
	createdBy: string;
	createdAt: string;
	updatedAt: string;
	hslUrl?: string;
	thumbnailsUrl?: string;
	posterUrl?: string;
}
