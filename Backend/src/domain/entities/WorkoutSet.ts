/**
 * WorkoutSet entity — a single set recorded during a workout.
 * Maps to the `sets` table in SQLite.
 */
export interface WorkoutSet {
  readonly id: string;
  exerciseId: string;
  setNumber: number;
  weight: number;
  reps: number;
  /** Repetitions In Reserve — how many reps the user had left before failure. Null if not reported. */
  rir: number | null;
  durationSeconds: number;
  completed: boolean;
  skipped: boolean;
  createdAt: Date;
}
