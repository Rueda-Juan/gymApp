import type * as SQLite from 'expo-sqlite';

/**
 * Migration 010 — daily_stats table.
 * Aggregated daily training statistics for charts and metrics.
 */
export const version = 10;
export const name = '010_daily_stats';

export async function up(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS daily_stats (
      date           DATE PRIMARY KEY,
      total_volume   REAL DEFAULT 0,
      total_sets     INTEGER DEFAULT 0,
      total_reps     INTEGER DEFAULT 0,
      workout_count  INTEGER DEFAULT 0,
      total_duration INTEGER DEFAULT 0
    );
  `);
}
