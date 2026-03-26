import type { Routine } from '../../../domain/entities/Routine';
import type { RoutineRepository } from '../../../domain/repositories/RoutineRepository';

export class GetRoutinesUseCase {
  constructor(private readonly routineRepository: RoutineRepository) {}

  async execute(): Promise<Routine[]> {
    return this.routineRepository.getAll();
  }
}
