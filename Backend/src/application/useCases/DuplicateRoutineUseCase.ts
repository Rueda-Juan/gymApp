import type { RoutineRepository } from '../../domain/repositories/RoutineRepository';
import { NotFoundError } from '../../shared/errors';
import type { Routine } from '../../domain/entities/Routine';
import { generateId } from '../../shared/utils/generateId';

export class DuplicateRoutineUseCase {
  constructor(private readonly routineRepository: RoutineRepository) {}

  async execute(id: string): Promise<Routine> {
    const existing = await this.routineRepository.getById(id);
    if (!existing) {
      throw new NotFoundError(`Rutina con ID ${id} no encontrada`);
    }

    const duplicatedRoutine: Routine = {
      ...existing,
      id: generateId(),
      name: `${existing.name} (Copia)`,
      createdAt: new Date(),
      exercises: existing.exercises.map(ex => ({
        ...ex,
        id: generateId(), // New IDs for the duplicated exercises
      })),
    };

    await this.routineRepository.save(duplicatedRoutine);
    return duplicatedRoutine;
  }
}
