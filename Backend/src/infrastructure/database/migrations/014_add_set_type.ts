import type * as SQLite from 'expo-sqlite';

/**
 * Migration 014 — Add set type to sets table.
 * Supports normal, warmup, dropset, and failure set types.
 */
export const version = 14;
export const name = '014_add_set_type';

export async function up(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    ALTER TABLE sets ADD COLUMN set_type TEXT DEFAULT 'normal'
      CHECK (set_type IN ('normal', 'warmup', 'dropset', 'failure'));
  `);
}
