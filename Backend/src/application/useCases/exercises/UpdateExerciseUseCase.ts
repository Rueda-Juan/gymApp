import type { ExerciseRepository } from '../../../domain/repositories/ExerciseRepository';
import { ValidationError, NotFoundError } from '../../../shared/errors';
import type { Exercise } from '../../../domain/entities/Exercise';

export class UpdateExerciseUseCase {
  constructor(private readonly exerciseRepository: ExerciseRepository) {}

  async execute(id: string, params: Partial<Omit<Exercise, 'id'>>): Promise<Exercise> {
    const existing = await this.exerciseRepository.getById(id);
    if (!existing) {
      throw new NotFoundError(`Ejercicio con ID ${id} no encontrado`);
    }

    if (params.name !== undefined && params.name.trim() === '') {
      throw new ValidationError('El nombre del ejercicio no puede estar vacío', { name: ['El nombre no puede estar vacío'] });
    }

    const updatedExercise: Exercise = {
      ...existing,
      ...params,
    };

    await this.exerciseRepository.save(updatedExercise);
    return updatedExercise;
  }
}
