import type * as SQLite from 'expo-sqlite';

/**
 * Migration 032 — add partial_reps to sets table.
 */
export const version = 32;
export const name = '032_add_partial_reps';

export async function up(db: SQLite.SQLiteDatabase): Promise<void> {
  // SQLite doesn't support adding a column with a CHECK constraint in one go easily
  // or ADD COLUMN IF NOT EXISTS in all versions, but here we just need to add it.
  await db.execAsync(`
    ALTER TABLE sets ADD COLUMN partial_reps INTEGER DEFAULT 0;
  `);
}
