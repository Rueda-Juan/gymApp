import type { Workout } from '../entities/Workout';
import type { WorkoutSet } from '../entities/WorkoutSet';

/**
 * Repository interface for Workout data access.
 * Implemented by SQLiteWorkoutRepository in infrastructure.
 */
export interface WorkoutRepository {
  getById(id: string): Promise<Workout | null>;
  getByDateRange(start: Date, end: Date): Promise<Workout[]>;
  getRecent(limit: number): Promise<Workout[]>;
  save(workout: Workout): Promise<void>;
  delete(id: string): Promise<void>;
  addSet(workoutId: string, set: WorkoutSet): Promise<void>;
  markExerciseSkipped(workoutId: string, exerciseId: string): Promise<void>;
}
