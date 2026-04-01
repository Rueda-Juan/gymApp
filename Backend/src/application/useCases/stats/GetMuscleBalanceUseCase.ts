import type { StatsRepository } from '../../../domain/repositories/StatsRepository';

export interface MuscleVolumeDistribution {
  muscle: string;
  volume: number;
  sets: number;
}

export class GetMuscleBalanceUseCase {
  constructor(private readonly statsRepo: StatsRepository) {}

  async execute(startDate: string, endDate: string): Promise<MuscleVolumeDistribution[]> {
    return this.statsRepo.getMuscleVolumeDistribution(startDate, endDate);
  }
}
