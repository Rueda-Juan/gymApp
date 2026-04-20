import type * as SQLite from 'expo-sqlite';

/**
 * Migration 012 — add anatomical_representation_svg to exercises.
 * Adds the anatomical_representation_svg column to store the muscle SVG representation path.
 */
export const version = 12;
export const name = '012_add_anatomical_svg_to_exercises';

export async function up(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    ALTER TABLE exercises ADD COLUMN anatomical_representation_svg TEXT;
  `);
}
