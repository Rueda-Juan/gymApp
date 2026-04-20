import type * as SQLite from 'expo-sqlite';

/**
 * Migration 007 — sets table.
 * Individual set records (weight, reps, duration) during a workout.
 */
export const version = 7;
export const name = '007_sets';

export async function up(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS sets (
      id               TEXT PRIMARY KEY,
      workout_id       TEXT NOT NULL,
      exercise_id      TEXT NOT NULL,
      set_number       INTEGER NOT NULL,
      weight           REAL DEFAULT 0 CHECK (weight >= 0),
      reps             INTEGER DEFAULT 0 CHECK (reps >= 0),
      duration_seconds INTEGER DEFAULT 0,
      completed        BOOLEAN DEFAULT 0,
      skipped          BOOLEAN DEFAULT 0,
      created_at       DATETIME DEFAULT (datetime('now')),
      FOREIGN KEY (workout_id)  REFERENCES workouts(id)  ON DELETE CASCADE,
      FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE RESTRICT
    );

    CREATE INDEX IF NOT EXISTS idx_sets_exercise   ON sets(exercise_id);
    CREATE INDEX IF NOT EXISTS idx_sets_workout    ON sets(workout_id);
    CREATE INDEX IF NOT EXISTS idx_sets_created_at ON sets(created_at);
  `);
}
