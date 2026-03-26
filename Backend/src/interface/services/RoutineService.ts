import type { CreateRoutineUseCase } from '../../application/useCases/routines/CreateRoutineUseCase';
import type { UpdateRoutineUseCase } from '../../application/useCases/routines/UpdateRoutineUseCase';
import type { DeleteRoutineUseCase } from '../../application/useCases/routines/DeleteRoutineUseCase';
import type { DuplicateRoutineUseCase } from '../../application/useCases/routines/DuplicateRoutineUseCase';
import type { GetRoutinesUseCase } from '../../application/useCases/routines/GetRoutinesUseCase';
import type { GetRoutineByIdUseCase } from '../../application/useCases/routines/GetRoutineByIdUseCase';
import type { Routine } from '../../domain/entities/Routine';

export class RoutineService {
  constructor(
    private readonly _createRoutine: CreateRoutineUseCase,
    private readonly _updateRoutine: UpdateRoutineUseCase,
    private readonly _deleteRoutine: DeleteRoutineUseCase,
    private readonly _duplicateRoutine: DuplicateRoutineUseCase,
    private readonly _getRoutines: GetRoutinesUseCase,
    private readonly _getRoutineById: GetRoutineByIdUseCase,
  ) {}

  async getAll() {
    return this._getRoutines.execute();
  }

  async getById(id: string) {
    return this._getRoutineById.execute(id);
  }

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
