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
  name?: string;
  nameEs?: string | null;
  orderIndex: number;
  skipped: boolean;
  notes: string | null;
  supersetGroup: number | null;
  sets: WorkoutSet[];
}
