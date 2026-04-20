import type * as SQLite from 'expo-sqlite';

/**
 * Migration 011 — Add RIR to sets, rep-range to routine_exercises.
 * Supports the double-progression progressive overload algorithm.
 */
export const version = 11;
export const name = '011_add_rir_and_rep_range';

export async function up(db: SQLite.SQLiteDatabase): Promise<void> {
  // Add RIR (Repetitions In Reserve) to sets — NULL = not reported
  await db.execAsync(`
    ALTER TABLE sets ADD COLUMN rir INTEGER DEFAULT NULL;
  `);

  // Add rep-range columns to routine_exercises
  await db.execAsync(`
    ALTER TABLE routine_exercises ADD COLUMN min_reps INTEGER;
  `);
  await db.execAsync(`
    ALTER TABLE routine_exercises ADD COLUMN max_reps INTEGER;
  `);

  // Backfill: existing rows use target_reps as minReps, +4 as maxReps
  await db.execAsync(`
    UPDATE routine_exercises
       SET min_reps = target_reps,
           max_reps = target_reps + 4
     WHERE min_reps IS NULL;
  `);
}
