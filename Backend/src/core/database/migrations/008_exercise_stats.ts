import type * as SQLite from 'expo-sqlite';

/**
 * Migration 008 — exercise_stats table.
 * Precomputed aggregate statistics per exercise.
 */
export const version = 8;
export const name = '008_exercise_stats';

export async function up(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS exercise_stats (
      exercise_id    TEXT PRIMARY KEY,
      max_weight     REAL DEFAULT 0,
      max_volume     REAL DEFAULT 0,
      estimated_1rm  REAL DEFAULT 0,
      total_sets     INTEGER DEFAULT 0,
      total_reps     INTEGER DEFAULT 0,
      total_volume   REAL DEFAULT 0,
      last_performed DATETIME,
      updated_at     DATETIME DEFAULT (datetime('now')),
      FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
    );
  `);
}
