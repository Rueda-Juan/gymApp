import type { RoutineRepository } from '../../../domain/repositories/RoutineRepository';
import { NotFoundError } from '../../../shared/errors';

export class DeleteRoutineUseCase {
  constructor(private readonly routineRepository: RoutineRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.routineRepository.getById(id);
    if (!existing) {
      throw new NotFoundError(`Rutina con ID ${id} no encontrada`);
    }
    await this.routineRepository.delete(id);
  }
}
