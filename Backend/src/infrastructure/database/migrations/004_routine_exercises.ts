import type * as SQLite from 'expo-sqlite';

/**
 * Migration 004 — routine_exercises table.
 * Join table: exercises within a routine template.
 */
export const version = 4;
export const name = '004_routine_exercises';

export async function up(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS routine_exercises (
      id           TEXT PRIMARY KEY,
      routine_id   TEXT NOT NULL,
      exercise_id  TEXT NOT NULL,
      order_index  INTEGER NOT NULL DEFAULT 0,
      target_sets  INTEGER,
      target_reps  INTEGER,
      FOREIGN KEY (routine_id)  REFERENCES routines(id)  ON DELETE CASCADE,
      FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE RESTRICT
    );

    CREATE INDEX IF NOT EXISTS idx_routine_exercises_routine  ON routine_exercises(routine_id);
    CREATE INDEX IF NOT EXISTS idx_routine_exercises_exercise ON routine_exercises(exercise_id);
  `);
}
