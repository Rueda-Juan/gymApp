import type { Exercise } from '../../../domain/entities/Exercise';
import type { ExerciseRepository } from '../../../domain/repositories/ExerciseRepository';

export class GetExercisesUseCase {
  constructor(private readonly exerciseRepository: ExerciseRepository) {}

  async execute(): Promise<Exercise[]> {
    return this.exerciseRepository.getAll();
  }
}
