import React, { useCallback, useEffect, useState } from "react";
import { Linking, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

import { COLORS } from "../constants/theme";

type Props = {
	visible: boolean;
	onScanned: (value: string) => void;
	onClose: () => void;
};

export function QRScannerModal({ visible, onScanned, onClose }: Props) {
	const [permission, requestPermission] = useCameraPermissions();
	const [scanned, setScanned] = useState(false);

	useEffect(() => {
		if (visible && !permission) {
			requestPermission();
		}
	}, [visible, permission, requestPermission]);

	const handleRequestPermission = useCallback(async () => {
		const result = await requestPermission();
		if (result?.status === "denied" && result.canAskAgain === false) {
			Linking.openSettings();
		}
	}, [requestPermission]);

	useEffect(() => {
		if (visible) {
			setScanned(false);
		}
	}, [visible]);

	const handleBarCodeScanned = useCallback(
		({ data }: { data: string }) => {
			if (scanned) {
				return;
			}

			setScanned(true);
			onScanned(data);
			onClose();
		},
		[scanned, onScanned, onClose],
	);

	return (
		<Modal
			visible={visible}
			animationType="slide"
			presentationStyle="fullScreen"
			onRequestClose={onClose}
		>
			<View style={styles.container}>
				{permission?.granted === false ? (
					<View style={styles.messageContainer}>
						<Text style={styles.messageText}>Camera permission denied</Text>
						<TouchableOpacity style={styles.retryButton} onPress={handleRequestPermission}>
							<Text style={styles.retryText}>Grant Permission</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
							<Text style={styles.secondaryText}>Close</Text>
						</TouchableOpacity>
					</View>
				) : permission ? (
					<CameraView
						style={StyleSheet.absoluteFillObject}
						facing="back"
						barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
						onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
					/>
				) : (
					<View style={styles.messageContainer}>
						<Text style={styles.messageText}>Requesting camera permission…</Text>
					</View>
				)}

				<View style={styles.overlay} pointerEvents="box-none">
					<TouchableOpacity style={styles.closeButton} onPress={onClose}>
						<Text style={styles.closeText}>✕</Text>
					</TouchableOpacity>

					<View style={styles.scanArea} />
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#000",
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
		alignItems: "center",
		justifyContent: "center",
	},
	scanArea: {
		width: 240,
		height: 240,
		borderRadius: 16,
		borderWidth: 2,
		borderColor: COLORS.primary,
		backgroundColor: "rgba(255, 255, 255, 0.08)",
	},
	closeButton: {
		position: "absolute",
		top: 48,
		right: 24,
		backgroundColor: "rgba(0, 0, 0, 0.6)",
		borderRadius: 20,
		paddingVertical: 8,
		paddingHorizontal: 12,
	},
	closeText: {
		color: COLORS.surface,
		fontSize: 16,
		fontWeight: "700",
	},
	messageContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#000",
	},
	messageText: {
		color: COLORS.surface,
		fontSize: 16,
	},
	retryButton: {
		marginTop: 12,
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 8,
		backgroundColor: COLORS.primary,
	},
	retryText: {
		color: COLORS.surface,
		fontWeight: "700",
		fontSize: 14,
	},
	secondaryButton: {
		marginTop: 8,
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: COLORS.surface,
	},
	secondaryText: {
		color: COLORS.surface,
		fontWeight: "700",
		fontSize: 14,
	},
});
