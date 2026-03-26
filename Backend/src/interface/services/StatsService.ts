import type { GetWeeklyStatsUseCase } from '../../application/useCases/stats/GetWeeklyStatsUseCase';
import type { GetMuscleBalanceUseCase } from '../../application/useCases/stats/GetMuscleBalanceUseCase';
import type { GetTrainingFrequencyUseCase } from '../../application/useCases/stats/GetTrainingFrequencyUseCase';

export class StatsService {
  constructor(
    private readonly _getWeeklyStats: GetWeeklyStatsUseCase,
    private readonly _getMuscleBalance: GetMuscleBalanceUseCase,
    private readonly _getTrainingFrequency: GetTrainingFrequencyUseCase,
  ) {}

  async getWeeklyStats(startDate: string, endDate: string) {
    return this._getWeeklyStats.execute(startDate, endDate);
  }

  async getMuscleBalance(startDate: string, endDate: string) {
    return this._getMuscleBalance.execute(startDate, endDate);
  }

  async getTrainingFrequency(startDate: string, endDate: string) {
    return this._getTrainingFrequency.execute(startDate, endDate);
  }
}
