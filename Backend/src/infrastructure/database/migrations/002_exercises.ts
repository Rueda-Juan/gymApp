import type * as SQLite from 'expo-sqlite';

/**
 * Migration 002 — exercises table.
 * Catalog of available exercises with metadata.
 */
export const version = 2;
export const name = '002_exercises';

export async function up(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS exercises (
      id               TEXT PRIMARY KEY,
      name             TEXT NOT NULL,
      primary_muscle   TEXT NOT NULL,
      secondary_muscles TEXT,
      equipment        TEXT,
      weight_increment REAL DEFAULT 2.5,
      animation_path   TEXT,
      description      TEXT
    );
  `);
}
