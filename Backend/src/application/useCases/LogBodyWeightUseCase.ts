import type { BodyWeightRepository } from '../../domain/repositories/BodyWeightRepository';
import type { BodyWeightEntry } from '../../domain/entities/BodyWeightEntry';
import { generateId } from '../../shared/utils/generateId';

export class LogBodyWeightUseCase {
  constructor(private readonly bodyWeightRepo: BodyWeightRepository) {}

  async execute(params: Omit<BodyWeightEntry, 'id' | 'createdAt'>): Promise<BodyWeightEntry> {
    const entry: BodyWeightEntry = {
      ...params,
      id: generateId(),
      createdAt: new Date(),
    };

    await this.bodyWeightRepo.save(entry);
    return entry;
  }
}
