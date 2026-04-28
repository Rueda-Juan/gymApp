import type { WorkoutExercise } from './workout-exercise.entity';

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
