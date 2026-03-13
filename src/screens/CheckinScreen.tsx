import React, { useCallback, useMemo, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import type { StackNavigationProp } from "@react-navigation/stack";
import uuid from "react-native-uuid";

import { COLORS, FONTS } from "../constants/theme";
import { MoodSelector } from "../components/MoodSelector";
import { QRScannerModal } from "../components/QRScannerModal";
import { SectionHeader } from "../components/SectionHeader";
import { useDatabase } from "../hooks/useDatabase";
import { useLocation } from "../hooks/useLocation";
import type { CheckinRecord, NavigationParams } from "../types";

type Navigation = StackNavigationProp<NavigationParams, "Checkin">;

type Props = {
	navigation: Navigation;
};

export function CheckinScreen({ navigation }: Props) {
	const { location, loading: locationLoading, error: locationError, refreshLocation } = useLocation();
	const { insertCheckin } = useDatabase();

	const [qrCodeValue, setQrCodeValue] = useState<string | null>(null);
	const [showScanner, setShowScanner] = useState(false);
	const [prevTopic, setPrevTopic] = useState("");
	const [expectedTopic, setExpectedTopic] = useState("");
	const [selectedMood, setSelectedMood] = useState<number>(0);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const locationText = useMemo(() => {
		if (!location) return null;
		return `📍 Lat: ${location.latitude.toFixed(5)}  Lng: ${location.longitude.toFixed(5)}`;
	}, [location]);

	const handleSubmit = useCallback(async () => {
		if (!location || !qrCodeValue || !prevTopic.trim() || !expectedTopic.trim() || selectedMood <= 0) {
			Alert.alert("Incomplete", "Please fill in all fields");
			return;
		}

		setIsSubmitting(true);
		try {
			const recordId = String(uuid.v4());
			const now = new Date().toISOString();

			const record: CheckinRecord = {
				recordId,
				studentId: "STU001",
				checkinTimestamp: now,
				checkinLat: location.latitude,
				checkinLng: location.longitude,
				qrCodeValue,
				prevTopic,
				expectedTopic,
				moodBefore: selectedMood,
				checkoutTimestamp: null,
				checkoutLat: null,
				checkoutLng: null,
				learnedToday: null,
				classFeedback: null,
			};

			await insertCheckin(record);

			Alert.alert("Success", "Check-in recorded!", [
				{
					text: "OK",
					onPress: () => navigation.goBack(),
				},
			]);
		} catch (error: any) {
			const message = typeof error?.message === "string" ? error.message : "Failed to submit check-in";
			Alert.alert("Error", message);
		} finally {
			setIsSubmitting(false);
		}
	}, [location, qrCodeValue, prevTopic, expectedTopic, selectedMood, insertCheckin, navigation]);

	return (
		<KeyboardAvoidingView
			style={styles.safeArea}
			behavior={Platform.select({ ios: "padding", android: undefined })}
			keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
		>
			<ScrollView contentContainerStyle={styles.content}>
				<SectionHeader title="Your Location" />

				<View style={styles.sectionBody}>
					{locationLoading ? (
						<ActivityIndicator color={COLORS.primary} />
					) : locationError ? (
						<Text style={styles.errorText}>{locationError}</Text>
					) : location ? (
						<Text style={styles.successText}>{locationText}</Text>
					) : (
						<TouchableOpacity onPress={refreshLocation}>
							<Text style={styles.linkText}>Tap to retry location</Text>
						</TouchableOpacity>
					)}
				</View>

				<SectionHeader title="Scan Class QR Code" />
				<View style={styles.sectionBody}>
					<TouchableOpacity style={styles.secondaryButton} onPress={() => setShowScanner(true)}>
						<Text style={styles.secondaryButtonText}>Scan QR Code 📷</Text>
					</TouchableOpacity>

					{qrCodeValue ? <Text style={styles.successText}>✅ Scanned: {qrCodeValue}</Text> : null}
				</View>

				<SectionHeader title="Before Class Reflection" />
				<View style={styles.sectionBody}>
					<TextInput
						value={prevTopic}
						onChangeText={setPrevTopic}
						placeholder="What was covered in the previous class?"
						placeholderTextColor={COLORS.textSecondary}
						multiline
						style={styles.textInput}
					/>
					<TextInput
						value={expectedTopic}
						onChangeText={setExpectedTopic}
						placeholder="What do you expect to learn today?"
						placeholderTextColor={COLORS.textSecondary}
						multiline
						style={[styles.textInput, { marginTop: 12 }]}
					/>
				</View>

				<SectionHeader title="Your Mood Before Class" />
				<View style={styles.sectionBody}>
					<MoodSelector selectedMood={selectedMood} onSelect={setSelectedMood} />
				</View>

				<TouchableOpacity
					style={[styles.primaryButton, isSubmitting && styles.disabledButton]}
					onPress={handleSubmit}
					disabled={isSubmitting}
				>
					<Text style={styles.primaryButtonText}>{isSubmitting ? "Submitting..." : "Submit Check-in"}</Text>
				</TouchableOpacity>
			</ScrollView>

			<QRScannerModal
				visible={showScanner}
				onScanned={(val) => setQrCodeValue(val)}
				onClose={() => setShowScanner(false)}
			/>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: COLORS.background,
	},
	content: {
		padding: 16,
		paddingBottom: 32,
	},
	sectionBody: {
		marginBottom: 16,
	},
	textInput: {
		minHeight: 80,
		borderWidth: 1,
		borderColor: COLORS.border,
		borderRadius: 8,
		padding: 10,
		fontSize: FONTS.md,
		color: COLORS.textPrimary,
		textAlignVertical: "top",
	},
	primaryButton: {
		backgroundColor: COLORS.primary,
		borderRadius: 12,
		padding: 16,
		alignItems: "center",
		marginTop: 24,
	},
	primaryButtonText: {
		color: COLORS.surface,
		fontSize: FONTS.md,
		fontWeight: "700",
	},
	secondaryButton: {
		backgroundColor: "transparent",
		borderWidth: 1,
		borderColor: COLORS.primary,
		borderRadius: 12,
		padding: 12,
		alignItems: "center",
	},
	secondaryButtonText: {
		color: COLORS.primary,
		fontSize: FONTS.md,
		fontWeight: "700",
	},
	successText: {
		color: COLORS.success,
		fontSize: FONTS.sm,
		marginTop: 8,
	},
	errorText: {
		color: COLORS.danger,
		fontSize: FONTS.sm,
		marginTop: 8,
	},
	linkText: {
		color: COLORS.primary,
		fontSize: FONTS.sm,
		marginTop: 8,
	},
	disabledButton: {
		opacity: 0.6,
	},
});
