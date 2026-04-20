import type * as SQLite from 'expo-sqlite';

/**
 * Migration 009 — personal_records table.
 * Personal bests categorized by record type.
 */
export const version = 9;
export const name = '009_personal_records';

export async function up(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS personal_records (
      id           TEXT PRIMARY KEY,
      exercise_id  TEXT NOT NULL,
      record_type  TEXT NOT NULL CHECK (record_type IN ('max_weight', 'max_reps', 'max_volume', 'estimated_1rm')),
      value        REAL NOT NULL,
      set_id       TEXT,
      date         DATETIME NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE,
      FOREIGN KEY (set_id)      REFERENCES sets(id)      ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS idx_personal_records_exercise ON personal_records(exercise_id);
    CREATE INDEX IF NOT EXISTS idx_personal_records_type     ON personal_records(record_type);
  `);
}
