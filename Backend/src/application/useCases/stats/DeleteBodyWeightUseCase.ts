import type { BodyWeightRepository } from '../../../domain/repositories/BodyWeightRepository';
import { NotFoundError } from '../../../shared/errors';

export class DeleteBodyWeightUseCase {
  constructor(private readonly bodyWeightRepo: BodyWeightRepository) {}

  async execute(bodyWeightId: string): Promise<void> {
    const entry = await this.bodyWeightRepo.getById(bodyWeightId);

    if (!entry) {
      throw new NotFoundError(`Body weight entry con ID ${bodyWeightId} no encontrada`);
    }

    await this.bodyWeightRepo.delete(bodyWeightId);
  }
}
