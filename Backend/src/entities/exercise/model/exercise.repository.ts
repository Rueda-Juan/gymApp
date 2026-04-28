import type { Exercise } from './exercise.entity';

/**
 * Repository interface for Exercise data access.
 * Implemented by SQLiteExerciseRepository in infrastructure.
 */
export interface ExerciseRepository {
  getAll(): Promise<Exercise[]>;
  getById(id: string): Promise<Exercise | null>;
  getByKey(exerciseKey: string): Promise<Exercise | null>;
  search(query: string): Promise<Exercise[]>;
  getByMuscleGroup(muscle: string): Promise<Exercise[]>;

  /** Checks if the exercise is used in any routine or workout */
  isInUse(id: string): Promise<boolean>;
  save(exercise: Exercise): Promise<void>;
  /** Soft-deletes the exercise by setting is_archived = true */
  archive(id: string): Promise<void>;
  delete(id: string): Promise<void>;
}
