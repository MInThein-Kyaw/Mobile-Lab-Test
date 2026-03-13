import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { COLORS, FONTS, MOOD_OPTIONS } from "../constants/theme";
import type { MoodOption } from "../types";

type Props = {
	selectedMood: number;
	onSelect: (score: number) => void;
};

export function MoodSelector({ selectedMood, onSelect }: Props) {
	return (
		<View
			style={{
				flexDirection: "row",
				justifyContent: "space-between",
			}}
		>
			{MOOD_OPTIONS.map((option: MoodOption) => {
				const isSelected = selectedMood === option.score;

				return (
					<TouchableOpacity
						key={option.score}
						onPress={() => onSelect(option.score)}
						style={{
							backgroundColor: isSelected ? COLORS.primaryLight : "transparent",
							borderRadius: 12,
							borderWidth: isSelected ? 2 : 0,
							borderColor: isSelected ? COLORS.primary : "transparent",
							padding: 8,
							flex: 1,
							alignItems: "center",
							marginHorizontal: 4,
						}}
					>
						<Text style={{ fontSize: 32, textAlign: "center" }}>{option.emoji}</Text>
						<Text
							style={{
								fontSize: 10,
								textAlign: "center",
								color: COLORS.textSecondary,
								marginTop: 4,
							}}
						>
							{option.label}
						</Text>
					</TouchableOpacity>
				);
			})}
		</View>
	);
}
