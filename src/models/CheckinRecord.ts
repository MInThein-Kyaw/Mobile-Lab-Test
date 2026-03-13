import type { CheckinRecord } from "../types";

const NUMERIC_FIELDS = new Set([
	"id",
	"checkinLat",
	"checkinLng",
	"checkoutLat",
	"checkoutLng",
	"checkinAccuracy",
	"checkoutAccuracy",
	"moodBefore",
	"moodAfter",
]);

export function toDbRow(record: CheckinRecord): Record<string, any> {
	const row: Record<string, any> = {};

	for (const [key, value] of Object.entries(record as Record<string, any>)) {
		row[key] = value === undefined ? null : value;
	}

	return row;
}

export function fromDbRow(row: Record<string, any>): CheckinRecord {
	const record: Record<string, any> = {};

	for (const [key, value] of Object.entries(row)) {
		if (value === null || value === undefined) {
			record[key] = null;
			continue;
		}

		if (NUMERIC_FIELDS.has(key)) {
			record[key] = Number(value);
			continue;
		}

		record[key] = value;
	}

	return record as CheckinRecord;
}
