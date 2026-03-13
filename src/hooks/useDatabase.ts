import { useCallback, useEffect, useState } from "react";

import { DatabaseService } from "../services/DatabaseService";
import type { CheckinRecord } from "../types";

type HookState = {
	records: CheckinRecord[];
	loading: boolean;
};

export function useDatabase() {
	const [state, setState] = useState<HookState>({
		records: [],
		loading: true,
	});

	const refreshRecords = useCallback(async () => {
		setState((prev) => ({ ...prev, loading: true }));

		try {
			const records = await DatabaseService.getAllRecords();
			setState({ records, loading: false });
		} catch (error) {
			setState((prev) => ({ ...prev, loading: false }));
			throw error;
		}
	}, []);

	useEffect(() => {
		(async () => {
			try {
				await DatabaseService.init();
				await refreshRecords();
			} catch (error) {
				setState((prev) => ({ ...prev, loading: false }));
				// Let consumers handle any surfaced errors from refresh calls
			}
		})();
	}, [refreshRecords]);

	const insertCheckin = useCallback(async (record: CheckinRecord) => {
		await DatabaseService.insertCheckin(record);
		await refreshRecords();
	}, [refreshRecords]);

	const updateCheckout = useCallback(async (recordId: string, data: Partial<CheckinRecord>) => {
		await DatabaseService.updateCheckout(recordId, data);
		await refreshRecords();
	}, [refreshRecords]);

	const getLatestCheckin = useCallback(async () => {
		return DatabaseService.getLatestCheckin();
	}, []);

	return {
		records: state.records,
		loading: state.loading,
		insertCheckin,
		updateCheckout,
		getLatestCheckin,
		refreshRecords,
	};
}
