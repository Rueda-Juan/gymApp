import type { Exercise } from '../entities/Exercise';

/**
 * Repository interface for Exercise data access.
 * Implemented by SQLiteExerciseRepository in infrastructure.
 */
export interface ExerciseRepository {
  getAll(): Promise<Exercise[]>;
  getById(id: string): Promise<Exercise | null>;
  search(query: string): Promise<Exercise[]>;
  getByMuscleGroup(muscle: string): Promise<Exercise[]>;
  save(exercise: Exercise): Promise<void>;
  delete(id: string): Promise<void>;
}
