import type * as SQLite from 'expo-sqlite';

/**
 * Migration 019 — Add superset_group to workout_exercises and routine_exercises.
 * Exercises sharing the same superset_group number are performed together
 * (superset, circuit, giant set). NULL = standalone exercise.
 */
export const version = 19;
export const name = '019_superset_groups';

export async function up(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    ALTER TABLE workout_exercises ADD COLUMN superset_group INTEGER DEFAULT NULL;
  `);

  await db.execAsync(`
    ALTER TABLE routine_exercises ADD COLUMN superset_group INTEGER DEFAULT NULL;
  `);
}
