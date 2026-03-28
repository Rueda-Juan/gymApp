import type { BodyWeightRepository } from '../../../domain/repositories/BodyWeightRepository';
import { NotFoundError } from '../../../shared/errors';

export class DeleteBodyWeightUseCase {
  constructor(private readonly bodyWeightRepo: BodyWeightRepository) {}

  async execute(bodyWeightId: string): Promise<void> {
    // Get the entry to verify it exists
    const entries = await this.bodyWeightRepo.getByDateRange(
      new Date('2000-01-01'),
      new Date('2099-12-31'),
    );
    const entry = entries.find((e) => e.id === bodyWeightId);

    if (!entry) {
      throw new NotFoundError(`Body weight entry con ID ${bodyWeightId} no encontrada`);
    }

    await this.bodyWeightRepo.delete(bodyWeightId);
  }
}
