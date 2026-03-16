import type { BodyWeightRepository } from '../../domain/repositories/BodyWeightRepository';
import type { BodyWeightEntry } from '../../domain/entities/BodyWeightEntry';

export class GetBodyWeightHistoryUseCase {
  constructor(private readonly bodyWeightRepo: BodyWeightRepository) {}

  async execute(startDate: Date, endDate: Date): Promise<BodyWeightEntry[]> {
    return this.bodyWeightRepo.getByDateRange(startDate, endDate);
  }
}
