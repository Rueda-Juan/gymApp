import type { CreateExerciseUseCase } from '../../application/useCases/CreateExerciseUseCase';
import type { UpdateExerciseUseCase } from '../../application/useCases/UpdateExerciseUseCase';
import type { DeleteExerciseUseCase } from '../../application/useCases/DeleteExerciseUseCase';
import type { GetExerciseHistoryUseCase } from '../../application/useCases/GetExerciseHistoryUseCase';
import type { Exercise } from '../../domain/entities/Exercise';

export class ExerciseService {
  constructor(
    private readonly _createExercise: CreateExerciseUseCase,
    private readonly _updateExercise: UpdateExerciseUseCase,
    private readonly _deleteExercise: DeleteExerciseUseCase,
    private readonly _getExerciseHistory: GetExerciseHistoryUseCase,
  ) {}

  async createExercise(params: Omit<Exercise, 'id'>) {
    return this._createExercise.execute(params);
  }

  async updateExercise(id: string, params: Partial<Omit<Exercise, 'id'>>) {
    return this._updateExercise.execute(id, params);
  }

  async deleteExercise(id: string) {
    return this._deleteExercise.execute(id);
  }

  async getExerciseHistory(exerciseId: string, limit?: number) {
    return this._getExerciseHistory.execute(exerciseId, limit);
  }
}
