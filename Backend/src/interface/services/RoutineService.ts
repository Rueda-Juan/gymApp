import type { CreateRoutineUseCase } from '../../application/useCases/CreateRoutineUseCase';
import type { UpdateRoutineUseCase } from '../../application/useCases/UpdateRoutineUseCase';
import type { DeleteRoutineUseCase } from '../../application/useCases/DeleteRoutineUseCase';
import type { DuplicateRoutineUseCase } from '../../application/useCases/DuplicateRoutineUseCase';
import type { Routine } from '../../domain/entities/Routine';

export class RoutineService {
  constructor(
    private readonly _createRoutine: CreateRoutineUseCase,
    private readonly _updateRoutine: UpdateRoutineUseCase,
    private readonly _deleteRoutine: DeleteRoutineUseCase,
    private readonly _duplicateRoutine: DuplicateRoutineUseCase,
  ) {}

  async createRoutine(params: Omit<Routine, 'id' | 'createdAt'>) {
    return this._createRoutine.execute(params);
  }

  async updateRoutine(id: string, params: Partial<Omit<Routine, 'id' | 'createdAt'>>) {
    return this._updateRoutine.execute(id, params);
  }

  async deleteRoutine(id: string) {
    return this._deleteRoutine.execute(id);
  }

  async duplicateRoutine(id: string) {
    return this._duplicateRoutine.execute(id);
  }
}
