import React from "react";
import { Text, View } from "react-native";

import { COLORS, FONTS } from "../constants/theme";

type Props = {
	title: string;
	subtitle?: string;
};

export function SectionHeader({ title, subtitle }: Props) {
	return (
		<View
			style={{
				marginBottom: 16,
				marginTop: 8,
				borderBottomWidth: 1,
				borderBottomColor: COLORS.border,
			}}
		>
			<Text
				style={{
					fontSize: FONTS.md,
					fontWeight: "700",
					color: COLORS.textPrimary,
				}}
			>
				{title}
			</Text>

			{subtitle ? (
				<Text
					style={{
						fontSize: FONTS.sm,
						color: COLORS.textSecondary,
						marginTop: 4,
					}}
				>
					{subtitle}
				</Text>
			) : null}
		</View>
	);
}
