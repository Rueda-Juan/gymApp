/**
 * Routine entity — a reusable workout template.
 * Maps to the `routines` table in SQLite.
 */
export interface Routine {
  readonly id: string;
  name: string;
  notes: string | null;
  exercises: RoutineExercise[];
  createdAt: Date;
}

/**
 * RoutineExercise — an exercise entry within a routine template.
 * Maps to the `routine_exercises` table in SQLite.
 */
export interface RoutineExercise {
  readonly id: string;
  exerciseId: string;
  orderIndex: number;
  targetSets: number;
  /** Bottom of the rep range (e.g. 8 in "8-12"). */
  minReps: number;
  /** Top of the rep range (e.g. 12 in "8-12"). Also used as targetReps. */
  maxReps: number;
}
