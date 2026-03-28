import type { RoutineRepository } from '../../../domain/repositories/RoutineRepository';
import type { RoutineExercise } from '../../../domain/entities/Routine';
import { NotFoundError } from '../../../shared/errors';

export class GetRoutineExercisesUseCase {
  constructor(private readonly routineRepository: RoutineRepository) {}

  async execute(routineId: string): Promise<RoutineExercise[]> {
    const routine = await this.routineRepository.getById(routineId);
    if (!routine) {
      throw new NotFoundError(`Rutina con ID ${routineId} no encontrada`);
    }

    return routine.exercises.sort((a, b) => a.orderIndex - b.orderIndex);
  }
}
