import type { StatsRepository } from '../../domain/repositories/StatsRepository';

export class GetMuscleBalanceUseCase {
  constructor(private readonly statsRepo: StatsRepository) {}

  async execute(startDate: string, endDate: string) {
    return this.statsRepo.getMuscleVolumeDistribution(startDate, endDate);
  }
}
