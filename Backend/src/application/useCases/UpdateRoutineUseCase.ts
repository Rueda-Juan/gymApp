import type { RoutineRepository } from '../../domain/repositories/RoutineRepository';
import { ValidationError, NotFoundError } from '../../shared/errors';
import type { Routine } from '../../domain/entities/Routine';
import { generateId } from '../../shared/utils/generateId';

export class UpdateRoutineUseCase {
  constructor(private readonly routineRepository: RoutineRepository) {}

  async execute(id: string, params: Partial<Omit<Routine, 'id' | 'createdAt'>>): Promise<Routine> {
    const existing = await this.routineRepository.getById(id);
    if (!existing) {
      throw new NotFoundError(`Rutina con ID ${id} no encontrada`);
    }

    if (params.name !== undefined && params.name.trim() === '') {
      throw new ValidationError('El nombre de la rutina no puede estar vacío', { name: ['El nombre no puede estar vacío'] });
    }

    const updatedRoutine: Routine = {
      ...existing,
      ...params,
      exercises: params.exercises ? params.exercises.map(ex => ({
        ...ex,
        id: ex.id || generateId(),
      })) : existing.exercises,
    };

    await this.routineRepository.save(updatedRoutine);
    return updatedRoutine;
  }
}
