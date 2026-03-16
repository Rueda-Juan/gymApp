import type { StatsRepository } from '../../domain/repositories/StatsRepository';
import type { DailyStats } from '../../domain/entities/DailyStats';

export class GetWeeklyStatsUseCase {
  constructor(private readonly statsRepo: StatsRepository) {}

  async execute(startDate: string, endDate: string): Promise<DailyStats[]> {
    return this.statsRepo.getWeeklyStats(startDate, endDate);
  }
}
