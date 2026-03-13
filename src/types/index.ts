export type MoodOption = {
	score: number;
	emoji: string;
	label: string;
};

export type LocationData = {
	latitude: number;
	longitude: number;
	timestamp: number;
};

export interface CheckinRecord {
	recordId: string;
	studentId: string;
	checkinTimestamp: string;
	checkinLat: number | null;
	checkinLng: number | null;
	qrCodeValue: string | null;
	prevTopic: string | null;
	expectedTopic: string | null;
	moodBefore: number | null;
	checkoutTimestamp?: string | null;
	checkoutLat?: number | null;
	checkoutLng?: number | null;
	learnedToday?: string | null;
	classFeedback?: string | null;

	// Optional fields that may be present from other DB schemas / queries
	id?: number | null;
	checkinAccuracy?: number | null;
	checkoutAccuracy?: number | null;
	moodAfter?: number | null;
}

export type NavigationParams = {
	Login: undefined;
	Home: undefined;
	Checkin: undefined;
	FinishClass: undefined;
};
