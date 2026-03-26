import type { ExerciseRepository } from '../../../domain/repositories/ExerciseRepository';
import { generateId } from '../../../shared/utils/generateId';
import { ValidationError } from '../../../shared/errors';
import type { Exercise } from '../../../domain/entities/Exercise';

export class CreateExerciseUseCase {
  constructor(private readonly exerciseRepository: ExerciseRepository) {}

  async execute(params: Omit<Exercise, 'id'>): Promise<Exercise> {
    if (!params.name || params.name.trim() === '') {
      throw new ValidationError('El nombre del ejercicio es requerido', { name: ['El nombre del ejercicio es requerido'] });
    }

    const newExercise: Exercise = {
      ...params,
      id: generateId(),
    };

    await this.exerciseRepository.save(newExercise);
    return newExercise;
  }
}
