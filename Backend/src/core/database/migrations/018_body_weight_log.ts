import type * as SQLite from 'expo-sqlite';

/**
 * Migration 018 — Create body_weight_log table.
 * Tracks the user's body weight over time for bodyweight exercise calculations
 * and progress tracking.
 */
export const version = 18;
export const name = '018_body_weight_log';

export async function up(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS body_weight_log (
      id         TEXT PRIMARY KEY,
      weight     REAL NOT NULL CHECK (weight > 0),
      date       DATE NOT NULL,
      notes      TEXT,
      created_at DATETIME DEFAULT (datetime('now'))
    );
  `);

  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_body_weight_log_date ON body_weight_log(date);
  `);
}
