import type { WorkoutSet } from './WorkoutSet';

/**
 * Workout entity — an actual training session instance.
 * Maps to the `workouts` table in SQLite.
 */
export interface Workout {
  readonly id: string;
  routineId: string | null;
  date: Date;
  durationSeconds: number;
  notes: string | null;
  exercises: WorkoutExercise[];
}

/**
 * WorkoutExercise — an exercise performed during a workout.
 * Maps to the `workout_exercises` table in SQLite.
 */
export interface WorkoutExercise {
  readonly id: string;
  exerciseId: string;
  orderIndex: number;
  skipped: boolean;
  sets: WorkoutSet[];
}
