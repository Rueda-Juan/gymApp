import type { MuscleGroup } from '@shared';
import type { WorkoutSet } from './workout-set.entity';

/**
 * WorkoutExercise — an exercise performed during a workout.
 * Maps to the `workout_exercises` table in SQLite.
 */
export interface WorkoutExercise {
  readonly id: string;
  exerciseId: string;
  name?: string;
  nameEs?: string | null;
  primaryMuscles?: MuscleGroup[];
  secondaryMuscles?: MuscleGroup[];
  orderIndex: number;
  skipped: boolean;
  notes: string | null;
  supersetGroup: number | null;
  sets: WorkoutSet[];
}
