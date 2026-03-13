import React, { useCallback, useState } from "react";
import {
	Alert,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";

import { COLORS, FONTS } from "../constants/theme";
import { getFirebaseApp } from "../services/firebase";
import type { NavigationParams } from "../types";

type Navigation = StackNavigationProp<NavigationParams, "Login">;

type Props = {
	navigation: Navigation;
};

export function LoginScreen({ navigation }: Props) {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [mode, setMode] = useState<"login" | "signup">("login");
	const [loading, setLoading] = useState(false);

	const handleSubmit = useCallback(async () => {
		if (!username.trim() || !email.trim() || !password.trim()) {
			Alert.alert("Missing info", "Please fill username, email, and password.");
			return;
		}

		setLoading(true);
		try {
			const { auth } = getFirebaseApp();
			const trimmedEmail = email.trim();
			const trimmedUsername = username.trim();

			if (mode === "login") {
				await signInWithEmailAndPassword(auth, trimmedEmail, password);
			} else {
				const cred = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
				if (cred.user && trimmedUsername) {
					await updateProfile(cred.user, { displayName: trimmedUsername }).catch(() => {});
				}
			}

			navigation.replace("Home");
		} catch (error: any) {
			const message = typeof error?.message === "string" ? error.message : "Authentication failed";
			Alert.alert("Auth error", message);
		} finally {
			setLoading(false);
		}
	}, [email, mode, navigation, password, username]);

	const toggleMode = useCallback(() => {
		setMode((prev) => (prev === "login" ? "signup" : "login"));
	}, []);

	return (
		<SafeAreaView style={styles.safeArea}>
			<KeyboardAvoidingView
				style={styles.flex}
				behavior={Platform.select({ ios: "padding", android: undefined })}
				keyboardVerticalOffset={Platform.OS === "ios" ? 48 : 0}
			>
				<ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
					<View style={styles.card}>
						<View style={styles.header}>
							<Text style={styles.badge}>Smart Check-in</Text>
							<Text style={styles.title}>{mode === "login" ? "Welcome back" : "Create account"}</Text>
							<Text style={styles.subtitle}>
								Access your classes, scan check-ins, and track reflections.
							</Text>
						</View>

						<View style={styles.formGroup}>
							<Text style={styles.label}>Username</Text>
							<TextInput
								value={username}
								onChangeText={setUsername}
								style={styles.input}
								placeholder="janedoe"
								placeholderTextColor={COLORS.textSecondary}
								autoCapitalize="none"
								returnKeyType="next"
							/>
						</View>

						<View style={styles.formGroup}>
							<Text style={styles.label}>Email</Text>
							<TextInput
								value={email}
								onChangeText={setEmail}
								style={styles.input}
								placeholder="jane@example.com"
								placeholderTextColor={COLORS.textSecondary}
								keyboardType="email-address"
								autoCapitalize="none"
								autoComplete="email"
								returnKeyType="next"
							/>
						</View>

						<View style={styles.formGroup}>
							<Text style={styles.label}>Password</Text>
							<TextInput
								value={password}
								onChangeText={setPassword}
								style={styles.input}
								placeholder="••••••••"
								placeholderTextColor={COLORS.textSecondary}
								secureTextEntry
								returnKeyType="done"
							/>
						</View>

						<TouchableOpacity style={styles.primaryButton} onPress={handleSubmit} disabled={loading}>
							<Text style={styles.primaryButtonText}>
								{loading ? "Please wait..." : mode === "login" ? "Login" : "Sign Up"}
							</Text>
						</TouchableOpacity>

						<TouchableOpacity onPress={toggleMode} style={styles.switchRow}>
							<Text style={styles.switchText}>
								{mode === "login" ? "New here? Create an account" : "Have an account? Log in"}
							</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: COLORS.background,
	},
	flex: {
		flex: 1,
	},
	content: {
		flexGrow: 1,
		padding: 20,
		justifyContent: "center",
	},
	card: {
		backgroundColor: COLORS.surface,
		borderRadius: 16,
		padding: 20,
		borderWidth: 1,
		borderColor: COLORS.border,
		shadowColor: "#000",
		shadowOpacity: 0.2,
		shadowOffset: { width: 0, height: 8 },
		shadowRadius: 16,
		elevation: 6,
	},
	header: {
		marginBottom: 24,
	},
	badge: {
		alignSelf: "flex-start",
		backgroundColor: COLORS.primary,
		color: COLORS.surface,
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 999,
		fontSize: FONTS.sm,
		fontWeight: "700",
	},
	title: {
		marginTop: 16,
		fontSize: FONTS.xl,
		fontWeight: "800",
		color: COLORS.textPrimary,
	},
	subtitle: {
		marginTop: 8,
		color: COLORS.textSecondary,
		fontSize: FONTS.sm,
		lineHeight: 20,
	},
	formGroup: {
		marginBottom: 16,
	},
	label: {
		color: COLORS.textSecondary,
		marginBottom: 8,
		fontSize: FONTS.sm,
		fontWeight: "600",
	},
	input: {
		borderWidth: 1,
		borderColor: COLORS.border,
		borderRadius: 10,
		paddingHorizontal: 12,
		paddingVertical: 12,
		color: COLORS.textPrimary,
		backgroundColor: COLORS.background,
		fontSize: FONTS.md,
	},
	primaryButton: {
		backgroundColor: COLORS.primary,
		borderRadius: 12,
		paddingVertical: 14,
		alignItems: "center",
		marginTop: 8,
	},
	primaryButtonText: {
		color: COLORS.surface,
		fontSize: FONTS.md,
		fontWeight: "700",
	},
	switchRow: {
		marginTop: 16,
		alignItems: "center",
	},
	switchText: {
		color: COLORS.primary,
		fontWeight: "700",
		fontSize: FONTS.sm,
	},
});
