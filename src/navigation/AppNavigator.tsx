import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { COLORS } from "../constants/theme";
import { CheckinScreen } from "../screens/CheckinScreen";
import { FinishClassScreen } from "../screens/FinishClassScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { LoginScreen } from "../screens/LoginScreen";
import type { NavigationParams } from "../types";

const Stack = createStackNavigator<NavigationParams>();

export function AppNavigator() {
	return (
		<Stack.Navigator
			initialRouteName="Login"
			screenOptions={{
				headerStyle: { backgroundColor: COLORS.primary },
				headerTintColor: "#FFFFFF",
				headerTitleStyle: { fontWeight: "bold" },
			}}
		>
			<Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
			<Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
			<Stack.Screen name="Checkin" component={CheckinScreen} options={{ title: "Step 1: Check In" }} />
			<Stack.Screen
				name="FinishClass"
				component={FinishClassScreen}
				options={{ title: "Step 2: Finish Class" }}
			/>
		</Stack.Navigator>
	);
}
