import type { Exercise } from '../../../domain/entities/Exercise';
import type { ExerciseRepository } from '../../../domain/repositories/ExerciseRepository';

export class GetExerciseByIdUseCase {
  constructor(private readonly exerciseRepository: ExerciseRepository) {}

  async execute(id: string): Promise<Exercise | null> {
    return this.exerciseRepository.getById(id);
  }
}
