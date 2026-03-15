import type * as SQLite from 'expo-sqlite';
import { WGER_SEED_SQL } from '../../scripts/seed_wger';

/**
 * Migration 013 — Seed Wger Exercises
 * Populates the exercises table with default data from wger.
 */
export const version = 13;
export const name = '013_seed_wger_exercises';

export async function up(db: SQLite.SQLiteDatabase): Promise<void> {
  // Execute the massive seed SQL
  await db.execAsync(WGER_SEED_SQL);
}
