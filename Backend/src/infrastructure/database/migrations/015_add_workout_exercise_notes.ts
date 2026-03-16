import type * as SQLite from 'expo-sqlite';

/**
 * Migration 015 — Add notes column to workout_exercises.
 * Allows per-exercise notes within a workout session.
 */
export const version = 15;
export const name = '015_add_workout_exercise_notes';

export async function up(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    ALTER TABLE workout_exercises ADD COLUMN notes TEXT;
  `);
}
