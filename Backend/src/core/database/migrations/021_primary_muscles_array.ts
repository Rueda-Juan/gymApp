import type * as SQLite from 'expo-sqlite';

/**
 * Migration 021 — Convert primary_muscle (single TEXT) to primary_muscles (JSON array TEXT).
 * Also adds exercise_type column ('compound' | 'isolation').
 * 
 * SQLite doesn't support RENAME COLUMN in older versions, so we:
 * 1. Add new columns
 * 2. Migrate data from old column to new format
 * 3. (Keep old column for backward compat — SQLite can't DROP COLUMN easily)
 */
export const version = 21;
export const name = '021_primary_muscles_array';

export async function up(db: SQLite.SQLiteDatabase): Promise<void> {
  // Add new columns
  await db.execAsync(`
    ALTER TABLE exercises ADD COLUMN primary_muscles TEXT;
  `);
  await db.execAsync(`
    ALTER TABLE exercises ADD COLUMN exercise_type TEXT DEFAULT 'isolation';
  `);

  // Migrate existing data: wrap single primary_muscle into JSON array
  // e.g. 'chest' → '["chest"]', 'other' → '["other"]'
  await db.execAsync(`
    UPDATE exercises 
    SET primary_muscles = '["' || primary_muscle || '"]'
    WHERE primary_muscles IS NULL;
  `);
}
