import type { Routine } from '../../../domain/entities/Routine';
import type { RoutineRepository } from '../../../domain/repositories/RoutineRepository';

export class GetRoutineByIdUseCase {
  constructor(private readonly routineRepository: RoutineRepository) {}

  async execute(id: string): Promise<Routine | null> {
    return this.routineRepository.getById(id);
  }
}
