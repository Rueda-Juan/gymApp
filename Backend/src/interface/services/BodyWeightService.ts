import type { LogBodyWeightUseCase } from '../../application/useCases/stats/LogBodyWeightUseCase';
import type { GetBodyWeightHistoryUseCase } from '../../application/useCases/stats/GetBodyWeightHistoryUseCase';
import type { BodyWeightEntry } from '../../domain/entities/BodyWeightEntry';

export class BodyWeightService {
  constructor(
    private readonly _logBodyWeight: LogBodyWeightUseCase,
    private readonly _getBodyWeightHistory: GetBodyWeightHistoryUseCase,
  ) {}

  async logBodyWeight(params: Omit<BodyWeightEntry, 'id' | 'createdAt'>) {
    return this._logBodyWeight.execute(params);
  }

  async getBodyWeightHistory(startDate: Date, endDate: Date) {
    return this._getBodyWeightHistory.execute(startDate, endDate);
  }
}
