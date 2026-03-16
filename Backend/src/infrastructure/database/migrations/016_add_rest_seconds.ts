import type * as SQLite from 'expo-sqlite';

/**
 * Migration 016 — Add rest_seconds to routine_exercises and sets.
 * - routine_exercises.rest_seconds: default rest time for this exercise in the routine
 * - sets.rest_seconds: actual rest time recorded after completing the set
 * The global default lives in user_preferences (migration 017).
 */
export const version = 16;
export const name = '016_add_rest_seconds';

export async function up(db: SQLite.SQLiteDatabase): Promise<void> {
  // Per-exercise override in routine template (NULL = use global default)
  await db.execAsync(`
    ALTER TABLE routine_exercises ADD COLUMN rest_seconds INTEGER DEFAULT NULL;
  `);

  // Actual rest time recorded per set (NULL = not tracked)
  await db.execAsync(`
    ALTER TABLE sets ADD COLUMN rest_seconds INTEGER DEFAULT NULL;
  `);
}
