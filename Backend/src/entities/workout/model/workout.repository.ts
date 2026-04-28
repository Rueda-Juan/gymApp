import type { Workout } from './workout.entity';
import type { WorkoutExercise } from './workout-exercise.entity';
import type { WorkoutSet } from './workout-set.entity';

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
  
  /** Adds a new set to an existing workout exercise */
  addSet(workoutId: string, exerciseId: string, set: WorkoutSet): Promise<void>;
  
  /** Updates an existing set */
  updateSet(workoutId: string, set: WorkoutSet): Promise<void>;
  
  /** Deletes an existing set from a workout */
  deleteSet(workoutId: string, setId: string): Promise<void>;

  /** Marks an exercise as skipped in a workout */
  markExerciseSkipped(workoutId: string, exerciseId: string, skipped: boolean): Promise<void>;

  /** Adds a new exercise to an active workout */
  addExercise(workoutId: string, exercise: WorkoutExercise): Promise<void>;

  /** Reorders exercises within a workout */
  reorderExercises(workoutId: string, exerciseIds: string[]): Promise<void>;

  /** Deletes a specific exercise from a workout */
  deleteExercise(workoutId: string, workoutExerciseId: string): Promise<void>;

  /** Updates notes for a workout exercise */
  updateExerciseNotes(workoutId: string, workoutExerciseId: string, notes: string | null): Promise<void>;

  /** Gets the most recent sets for a specific exercise across workouts */
  getExerciseHistory(exerciseId: string, limit?: number): Promise<WorkoutSet[]>;

  /**
   * Gets the sets (ordered by set_number) from the single most recent
   * completed workout in which this exercise was performed.
   * Returns an empty array if no history exists.
   */
  getPreviousSets(exerciseId: string): Promise<WorkoutSet[]>;
}
