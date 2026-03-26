import type { CreateExerciseUseCase } from '../../application/useCases/exercises/CreateExerciseUseCase';
import type { UpdateExerciseUseCase } from '../../application/useCases/exercises/UpdateExerciseUseCase';
import type { DeleteExerciseUseCase } from '../../application/useCases/exercises/DeleteExerciseUseCase';
import type { GetExerciseHistoryUseCase } from '../../application/useCases/exercises/GetExerciseHistoryUseCase';
import type { GetExercisesUseCase } from '../../application/useCases/exercises/GetExercisesUseCase';
import type { GetExerciseByIdUseCase } from '../../application/useCases/exercises/GetExerciseByIdUseCase';
import type { Exercise } from '../../domain/entities/Exercise';

export class ExerciseService {
  constructor(
    private readonly _createExercise: CreateExerciseUseCase,
    private readonly _updateExercise: UpdateExerciseUseCase,
    private readonly _deleteExercise: DeleteExerciseUseCase,
    private readonly _getExerciseHistory: GetExerciseHistoryUseCase,
    private readonly _getExercises: GetExercisesUseCase,
    private readonly _getExerciseById: GetExerciseByIdUseCase,
  ) {}

  async getAll() {
    return this._getExercises.execute();
  }

  async getById(id: string) {
    return this._getExerciseById.execute(id);
  }

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
