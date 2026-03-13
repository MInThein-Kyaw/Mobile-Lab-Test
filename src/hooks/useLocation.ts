import { useCallback, useEffect, useState } from "react";
import * as Location from "expo-location";

import type { LocationData } from "../types";

type HookState = {
	location: LocationData | null;
	loading: boolean;
	error: string | null;
};

export function useLocation() {
	const [state, setState] = useState<HookState>({
		location: null,
		loading: true,
		error: null,
	});

	const fetchLocation = useCallback(async () => {
		try {
			setState((prev) => ({ ...prev, loading: true, error: null }));

			const permission = await Location.requestForegroundPermissionsAsync();
			if (permission.status !== "granted") {
				setState({ location: null, loading: false, error: "Location permission denied" });
				return;
			}

			const result = await Location.getCurrentPositionAsync({
				accuracy: Location.Accuracy.High,
			});

			const nextLocation: LocationData = {
				latitude: result.coords.latitude,
				longitude: result.coords.longitude,
				timestamp: result.timestamp,
			};

			setState({ location: nextLocation, loading: false, error: null });
		} catch (err: any) {
			const message = typeof err?.message === "string" ? err.message : "Failed to fetch location";
			setState({ location: null, loading: false, error: message });
		}
	}, []);

	useEffect(() => {
		void fetchLocation();
	}, [fetchLocation]);

	return {
		location: state.location,
		loading: state.loading,
		error: state.error,
		refreshLocation: fetchLocation,
	};
}
