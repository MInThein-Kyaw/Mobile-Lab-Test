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

import { COLORS, FONTS } from "../constants/theme";
import { QRScannerModal } from "../components/QRScannerModal";
import { SectionHeader } from "../components/SectionHeader";
import { useDatabase } from "../hooks/useDatabase";
import { useLocation } from "../hooks/useLocation";
import type { NavigationParams } from "../types";

type Navigation = StackNavigationProp<NavigationParams, "FinishClass">;

type Props = {
	navigation: Navigation;
};

export function FinishClassScreen({ navigation }: Props) {
	const { location, loading: locationLoading, error: locationError, refreshLocation } = useLocation();
	const { getLatestCheckin, updateCheckout } = useDatabase();

	const [qrCodeValue, setQrCodeValue] = useState<string | null>(null);
	const [showScanner, setShowScanner] = useState(false);
	const [learnedToday, setLearnedToday] = useState("");
	const [classFeedback, setClassFeedback] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [lastFinishMessage, setLastFinishMessage] = useState<string | null>(null);

	const locationText = useMemo(() => {
		if (!location) return null;
		return `📍 Lat: ${location.latitude.toFixed(5)}  Lng: ${location.longitude.toFixed(5)}`;
	}, [location]);

	const handleSubmit = useCallback(async () => {
		if (!location || !qrCodeValue || !learnedToday.trim()) {
			Alert.alert("Incomplete", "Please fill in all fields");
			return;
		}

		setIsSubmitting(true);
		try {
			const latest = await getLatestCheckin();

			if (!latest || latest.checkoutTimestamp) {
				Alert.alert("Error", "No active check-in found. Please check in first.");
				return;
			}

			const finishTime = new Date().toISOString();
			await updateCheckout(latest.recordId, {
				checkoutTimestamp: finishTime,
				checkoutLat: location.latitude,
				checkoutLng: location.longitude,
				qrCodeValue,
				learnedToday,
				classFeedback: classFeedback.trim() ? classFeedback : null,
			});
			setLastFinishMessage(`Finished at ${new Date(finishTime).toLocaleString()}`);

			Alert.alert("Done!", "Class session completed!", [
				{
					text: "OK",
					onPress: () => navigation.goBack(),
				},
			]);
		} catch (error: any) {
			const message = typeof error?.message === "string" ? error.message : "Failed to finish class";
			Alert.alert("Error", message);
		} finally {
			setIsSubmitting(false);
		}
	}, [location, qrCodeValue, learnedToday, classFeedback, getLatestCheckin, updateCheckout, navigation]);

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

				<SectionHeader title="Scan QR Code Again" />
				<View style={styles.sectionBody}>
					<TouchableOpacity style={styles.secondaryButton} onPress={() => setShowScanner(true)}>
						<Text style={styles.secondaryButtonText}>Scan QR Code 📷</Text>
					</TouchableOpacity>

					{qrCodeValue ? <Text style={styles.successText}>✅ Scanned: {qrCodeValue}</Text> : null}
				</View>

				<SectionHeader title="Post-Class Reflection" />
				<View style={styles.sectionBody}>
					<TextInput
						value={learnedToday}
						onChangeText={setLearnedToday}
						placeholder="What did you learn in today's class?"
						placeholderTextColor={COLORS.textSecondary}
						multiline
						style={[styles.textInput, { minHeight: 100 }]}
					/>
					<TextInput
						value={classFeedback}
						onChangeText={setClassFeedback}
						placeholder="Any feedback about the class or instructor?"
						placeholderTextColor={COLORS.textSecondary}
						multiline
						style={[styles.textInput, { minHeight: 80, marginTop: 12 }]}
					/>
				</View>

				<TouchableOpacity
					style={[styles.primaryButton, isSubmitting && styles.disabledButton]}
					onPress={handleSubmit}
					disabled={isSubmitting}
				>
					<Text style={styles.primaryButtonText}>{isSubmitting ? "Submitting..." : "Finish Class ✓"}</Text>
				</TouchableOpacity>

					{lastFinishMessage ? <Text style={styles.successText}>{lastFinishMessage}</Text> : null}
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
