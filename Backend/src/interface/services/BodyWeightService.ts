import type { LogBodyWeightUseCase } from '../../application/useCases/stats/LogBodyWeightUseCase';
import type { GetBodyWeightHistoryUseCase } from '../../application/useCases/stats/GetBodyWeightHistoryUseCase';
import type { UpdateBodyWeightUseCase, UpdateBodyWeightInput } from '../../application/useCases/stats/UpdateBodyWeightUseCase';
import type { DeleteBodyWeightUseCase } from '../../application/useCases/stats/DeleteBodyWeightUseCase';
import type { BodyWeightEntry } from '../../domain/entities/BodyWeightEntry';

export class BodyWeightService {
  constructor(
    private readonly _logBodyWeight: LogBodyWeightUseCase,
    private readonly _getBodyWeightHistory: GetBodyWeightHistoryUseCase,
    private readonly _updateBodyWeight: UpdateBodyWeightUseCase,
    private readonly _deleteBodyWeight: DeleteBodyWeightUseCase,
  ) {}

  async logBodyWeight(params: Omit<BodyWeightEntry, 'id' | 'createdAt'>) {
    return this._logBodyWeight.execute(params);
  }

  async getBodyWeightHistory(startDate: Date, endDate: Date) {
    return this._getBodyWeightHistory.execute(startDate, endDate);
  }

  async updateBodyWeight(params: UpdateBodyWeightInput) {
    return this._updateBodyWeight.execute(params);
  }

  async deleteBodyWeight(bodyWeightId: string) {
    return this._deleteBodyWeight.execute(bodyWeightId);
  }
}
