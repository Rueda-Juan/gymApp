import type { RoutineRepository } from '../../../domain/repositories/RoutineRepository';
import { generateId } from '../../../shared/utils/generateId';
import { ValidationError } from '../../../shared/errors';
import type { Routine } from '../../../domain/entities/Routine';

export class CreateRoutineUseCase {
  constructor(private readonly routineRepository: RoutineRepository) {}

  async execute(params: Omit<Routine, 'id' | 'createdAt'>): Promise<Routine> {
    if (!params.name || params.name.trim() === '') {
      throw new ValidationError('El nombre de la rutina es requerido', { name: ['El nombre de la rutina es requerido'] });
    }

    const newRoutine: Routine = {
      ...params,
      id: generateId(),
      createdAt: new Date(),
      exercises: params.exercises.map(ex => ({
        ...ex,
        id: ex.id || generateId(),
      })),
    };

    await this.routineRepository.save(newRoutine);
    return newRoutine;
  }
}
