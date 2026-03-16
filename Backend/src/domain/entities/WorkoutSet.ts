import type { SetType } from '../valueObjects/SetType';

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
  /** Purpose/intensity of the set */
  setType: SetType;
  /** Rest time taken after this set in seconds. Null if not tracked. */
  restSeconds: number | null;
  durationSeconds: number;
  completed: boolean;
  skipped: boolean;
  createdAt: Date;
}
