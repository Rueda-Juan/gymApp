import type * as SQLite from 'expo-sqlite';

/**
 * Migration 003 — routines table.
 * Reusable workout templates created by the user.
 */
export const version = 3;
export const name = '003_routines';

export async function up(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS routines (
      id         TEXT PRIMARY KEY,
      name       TEXT NOT NULL,
      notes      TEXT,
      created_at DATETIME DEFAULT (datetime('now'))
    );
  `);
}
