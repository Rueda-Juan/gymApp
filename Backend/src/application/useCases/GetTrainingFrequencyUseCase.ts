import type { StatsRepository } from '../../domain/repositories/StatsRepository';

export class GetTrainingFrequencyUseCase {
  constructor(private readonly statsRepo: StatsRepository) {}

  async execute(startDate: string, endDate: string) {
    const dailyStats = await this.statsRepo.getWeeklyStats(startDate, endDate);
    const workoutsPerDay = dailyStats.reduce((acc, stat) => {
      acc[stat.date] = stat.workoutCount;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalWorkouts: dailyStats.reduce((sum, stat) => sum + stat.workoutCount, 0),
      workoutsPerDay,
    };
  }
}
