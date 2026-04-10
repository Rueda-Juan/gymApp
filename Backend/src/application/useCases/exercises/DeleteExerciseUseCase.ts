import type { ExerciseRepository } from '../../../domain/repositories/ExerciseRepository';
import { ValidationError, NotFoundError } from '../../../shared/errors';

export class DeleteExerciseUseCase {
  constructor(private readonly exerciseRepository: ExerciseRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.exerciseRepository.getById(id);
    if (!existing) {
      throw new NotFoundError(`Ejercicio con ID ${id} no encontrado`);
    }

    const inUse = await this.exerciseRepository.isInUse(id);

    if (inUse) {
      if (existing.isCustom) {
        await this.exerciseRepository.archive(id);
        return;
      }
      throw new ValidationError(
        'No se puede eliminar un ejercicio del catálogo que está en uso',
        { general: ['En uso'] },
      );
    }

    await this.exerciseRepository.delete(id);
  }
}
