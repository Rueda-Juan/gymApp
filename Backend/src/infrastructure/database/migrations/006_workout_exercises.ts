import type * as SQLite from 'expo-sqlite';

/**
 * Migration 006 — workout_exercises table.
 * Exercises performed during an actual workout session.
 */
export const version = 6;
export const name = '006_workout_exercises';

export async function up(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS workout_exercises (
      id          TEXT PRIMARY KEY,
      workout_id  TEXT NOT NULL,
      exercise_id TEXT NOT NULL,
      order_index INTEGER NOT NULL DEFAULT 0,
      skipped     BOOLEAN DEFAULT 0,
      FOREIGN KEY (workout_id)  REFERENCES workouts(id)  ON DELETE CASCADE,
      FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE RESTRICT
    );

    CREATE INDEX IF NOT EXISTS idx_workout_exercises_workout  ON workout_exercises(workout_id);
    CREATE INDEX IF NOT EXISTS idx_workout_exercises_exercise ON workout_exercises(exercise_id);
  `);
}
