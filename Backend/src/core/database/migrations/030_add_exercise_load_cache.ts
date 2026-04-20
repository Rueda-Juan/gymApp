import type * as SQLite from 'expo-sqlite';

export const version = 30;
export const name = '030_add_exercise_load_cache';

export async function up(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS exercise_load_cache (
      exercise_id        TEXT PRIMARY KEY,
      recommended_weight REAL NOT NULL,
      basis              TEXT NOT NULL CHECK(basis IN ('progressive_overload', 'last_set', 'deload', 'failure_recovery', 'default')),
      last_weight        REAL,
      last_reps          INTEGER,
      sessions_analyzed  INTEGER NOT NULL DEFAULT 0,
      updated_at         DATETIME NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
    );
  `);
}
