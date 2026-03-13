import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { StackNavigationProp } from "@react-navigation/stack";

import { COLORS, FONTS } from "../constants/theme";
import type { NavigationParams } from "../types";

type Navigation = StackNavigationProp<NavigationParams, "Home">;

type Props = {
	navigation: Navigation;
};

export function HomeScreen({ navigation }: Props) {
	return (
		<SafeAreaView style={styles.safeArea}>
			<ScrollView contentContainerStyle={styles.content}>
				<View style={styles.header}>
					<Text style={styles.emoji}>🏫</Text>
					<Text style={styles.title}>Smart Check-in</Text>
					<Text style={styles.subtitle}>Class Attendance & Learning Reflection</Text>
				</View>

				<View style={styles.buttons}>
					<TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate("Checkin")}>
						<Text style={styles.primaryButtonText}>Check In →</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.secondaryButton}
						onPress={() => navigation.navigate("FinishClass")}
					>
						<Text style={styles.secondaryButtonText}>Finish Class ✓</Text>
					</TouchableOpacity>
				</View>

				<Text style={styles.footer}>Individual work — 1305216 MobApp Dev</Text>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: COLORS.background,
	},
	content: {
		flexGrow: 1,
		paddingHorizontal: 24,
		alignItems: "center",
		justifyContent: "center",
	},
	header: {
		alignItems: "center",
	},
	emoji: {
		fontSize: 80,
		textAlign: "center",
	},
	title: {
		fontSize: FONTS.xxl,
		fontWeight: "700",
		color: COLORS.primary,
		marginTop: 8,
		textAlign: "center",
	},
	subtitle: {
		fontSize: FONTS.sm,
		color: COLORS.textSecondary,
		textAlign: "center",
		marginTop: 4,
	},
	buttons: {
		width: "100%",
		marginTop: 48,
	},
	primaryButton: {
		backgroundColor: COLORS.primary,
		borderRadius: 12,
		padding: 16,
		alignItems: "center",
	},
	primaryButtonText: {
		color: COLORS.surface,
		fontSize: FONTS.md,
		fontWeight: "700",
	},
	secondaryButton: {
		marginTop: 12,
		backgroundColor: "transparent",
		borderWidth: 2,
		borderColor: COLORS.primary,
		borderRadius: 12,
		padding: 16,
		alignItems: "center",
	},
	secondaryButtonText: {
		color: COLORS.primary,
		fontSize: FONTS.md,
		fontWeight: "700",
	},
	footer: {
		marginTop: 32,
		color: COLORS.textSecondary,
		fontSize: FONTS.xs,
		textAlign: "center",
	},
});
