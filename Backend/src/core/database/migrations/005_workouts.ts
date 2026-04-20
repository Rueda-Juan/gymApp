import type * as SQLite from 'expo-sqlite';

/**
 * Migration 005 — workouts table.
 * Actual training session instances.
 */
export const version = 5;
export const name = '005_workouts';

export async function up(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS workouts (
      id               TEXT PRIMARY KEY,
      routine_id       TEXT,
      date             DATETIME NOT NULL DEFAULT (datetime('now')),
      duration_seconds INTEGER DEFAULT 0,
      notes            TEXT,
      FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS idx_workouts_date       ON workouts(date);
    CREATE INDEX IF NOT EXISTS idx_workouts_routine_id ON workouts(routine_id);
  `);
}
