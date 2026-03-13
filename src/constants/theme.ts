import type { MoodOption } from "../types";

export const MOOD_OPTIONS: MoodOption[] = [
	{ score: 1, emoji: "😡", label: "Very Negative" },
	{ score: 2, emoji: "🙁", label: "Negative" },
	{ score: 3, emoji: "😐", label: "Neutral" },
	{ score: 4, emoji: "🙂", label: "Positive" },
	{ score: 5, emoji: "😄", label: "Very Positive" },
];

export const COLORS = {
	primary: "#0F9B6C", // dark green
	primaryLight: "#1CA878",
	success: "#1DBF73",
	danger: "#E35D6A",
	warning: "#D9A441",
	background: "#0F1115", // light black
	surface: "#171B21",
	textPrimary: "#E6E9EE",
	textSecondary: "#A7AFBC",
	border: "#2A2F36",
};

export const FONTS = {
	xs: 12,
	sm: 14,
	md: 16,
	lg: 18,
	xl: 22,
	xxl: 28,
};
