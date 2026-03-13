import * as SQLite from "expo-sqlite";

import { fromDbRow, toDbRow } from "../models/CheckinRecord";
import type { CheckinRecord } from "../types";

let db: SQLite.SQLiteDatabase | null = null;
let initPromise: Promise<void> | null = null;

async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
	await DatabaseService.init();
	return db as SQLite.SQLiteDatabase;
}

export const DatabaseService = {
	async init(): Promise<void> {
		if (db) {
			return;
		}

		if (!initPromise) {
			initPromise = (async () => {
				const database = await SQLite.openDatabaseAsync("checkin.db");

				await database.execAsync(`
					CREATE TABLE IF NOT EXISTS checkin_records (
						recordId TEXT PRIMARY KEY,
						studentId TEXT,
						checkinTimestamp TEXT,
						checkinLat REAL,
						checkinLng REAL,
						qrCodeValue TEXT,
						prevTopic TEXT,
						expectedTopic TEXT,
						moodBefore INTEGER,
						checkoutTimestamp TEXT,
						checkoutLat REAL,
						checkoutLng REAL,
						learnedToday TEXT,
						classFeedback TEXT
					);
				`);

				db = database;
			})()
				.catch((error) => {
					db = null;
					throw error;
				})
				.finally(() => {
					initPromise = null;
				});
		}

		await initPromise;
	},

	async insertCheckin(record: CheckinRecord): Promise<void> {
		const database = await getDatabase();
		const row = toDbRow(record);

		await database.runAsync(
			`
				INSERT INTO checkin_records (
					recordId,
					studentId,
					checkinTimestamp,
					checkinLat,
					checkinLng,
					qrCodeValue,
					prevTopic,
					expectedTopic,
					moodBefore
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
			`,
			[
				row.recordId,
				row.studentId,
				row.checkinTimestamp,
				row.checkinLat,
				row.checkinLng,
				row.qrCodeValue,
				row.prevTopic,
				row.expectedTopic,
				row.moodBefore,
			],
		);
	},

	async updateCheckout(recordId: string, data: Partial<CheckinRecord>): Promise<void> {
		const database = await getDatabase();
		const row = toDbRow(data as CheckinRecord);

		await database.runAsync(
			`
				UPDATE checkin_records
				SET
					checkoutTimestamp = ?,
					checkoutLat = ?,
					checkoutLng = ?,
					learnedToday = ?,
					classFeedback = ?
				WHERE recordId = ?
			`,
			[
				row.checkoutTimestamp,
				row.checkoutLat,
				row.checkoutLng,
				row.learnedToday,
				row.classFeedback,
				recordId,
			],
		);
	},

	async getAllRecords(): Promise<CheckinRecord[]> {
		const database = await getDatabase();
		const rows = await database.getAllAsync<Record<string, any>>(`
			SELECT *
			FROM checkin_records
			ORDER BY checkinTimestamp DESC
		`);

		return rows.map((row) => fromDbRow(row));
	},

	async getLatestCheckin(): Promise<CheckinRecord | null> {
		const database = await getDatabase();
		const row = await database.getFirstAsync<Record<string, any>>(`
			SELECT *
			FROM checkin_records
			WHERE checkoutTimestamp IS NULL
			ORDER BY checkinTimestamp DESC
			LIMIT 1
		`);

		if (!row) {
			return null;
		}

		return fromDbRow(row);
	},
};

void DatabaseService.init();
