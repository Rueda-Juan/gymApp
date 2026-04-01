import type { StartWorkoutUseCase } from '../../application/useCases/workouts/StartWorkout';
import type { FinishWorkoutUseCase } from '../../application/useCases/workouts/FinishWorkout';
import type { DeleteWorkoutUseCase } from '../../application/useCases/workouts/DeleteWorkoutUseCase';
import type { RecordSetUseCase } from '../../application/useCases/workouts/RecordSet';
import type { RecordAllSetsUseCase } from '../../application/useCases/workouts/RecordAllSetsUseCase';
import type { UpdateSetUseCase } from '../../application/useCases/workouts/UpdateSetUseCase';
import type { DeleteSetUseCase } from '../../application/useCases/workouts/DeleteSetUseCase';
import type { SkipExerciseUseCase } from '../../application/useCases/workouts/SkipExercise';
import type { AddExerciseToWorkoutUseCase } from '../../application/useCases/workouts/AddExerciseToWorkoutUseCase';
import type { ReorderWorkoutExercisesUseCase } from '../../application/useCases/workouts/ReorderWorkoutExercisesUseCase';
import type { DeleteWorkoutExerciseUseCase } from '../../application/useCases/workouts/DeleteWorkoutExerciseUseCase';
import type { UpdateWorkoutExerciseUseCase } from '../../application/useCases/workouts/UpdateWorkoutExerciseUseCase';
import type { SuggestWeightUseCase, WarmupStyle } from '../../application/useCases/exercises/SuggestWeight';
import type { GetWorkoutHistoryUseCase } from '../../application/useCases/workouts/GetWorkoutHistoryUseCase';
import type { GetWorkoutByIdUseCase } from '../../application/useCases/workouts/GetWorkoutByIdUseCase';
import type { GetPreviousSetsUseCase } from '../../application/useCases/exercises/GetPreviousSetsUseCase';
import type { SessionContext } from '../../domain/valueObjects/SessionContext';
import type { WorkoutSet } from '../../domain/entities/WorkoutSet';
import type { WorkoutExercise } from '../../domain/entities/Workout';

export class WorkoutService {
  constructor(
    private readonly _startWorkout: StartWorkoutUseCase,
    private readonly _finishWorkout: FinishWorkoutUseCase,
    private readonly _deleteWorkout: DeleteWorkoutUseCase,
    private readonly _recordSet: RecordSetUseCase,
    private readonly _recordAllSets: RecordAllSetsUseCase,
    private readonly _updateSet: UpdateSetUseCase,
    private readonly _deleteSet: DeleteSetUseCase,
    private readonly _skipExercise: SkipExerciseUseCase,
    private readonly _addExerciseToWorkout: AddExerciseToWorkoutUseCase,
    private readonly _reorderWorkoutExercises: ReorderWorkoutExercisesUseCase,
    private readonly _deleteWorkoutExercise: DeleteWorkoutExerciseUseCase,
    private readonly _updateWorkoutExercise: UpdateWorkoutExerciseUseCase,
    private readonly _suggestWeight: SuggestWeightUseCase,
    private readonly _getHistory: GetWorkoutHistoryUseCase,
    private readonly _getById: GetWorkoutByIdUseCase,
    private readonly _getPreviousSets: GetPreviousSetsUseCase,
  ) {}

  async getHistory(limit?: number) {
    return this._getHistory.execute(limit);
  }

  async getById(id: string) {
    return this._getById.execute(id);
  }

  async startWorkout(routineId: string | null) {
    return this._startWorkout.execute(routineId);
  }

  async finishWorkout(workoutId: string) {
    return this._finishWorkout.execute(workoutId);
  }

  async deleteWorkout(workoutId: string) {
    return this._deleteWorkout.execute(workoutId);
  }

  async recordSet(workoutId: string, set: WorkoutSet) {
    return this._recordSet.execute(workoutId, set);
  }

  async recordAllSets(workoutId: string, exercises: WorkoutExercise[]) {
    return this._recordAllSets.execute(workoutId, exercises);
  }

  async getPreviousSets(exerciseId: string) {
    return this._getPreviousSets.execute(exerciseId);
  }

  async updateSet(workoutId: string, dateStr: string, set: WorkoutSet) {
    return this._updateSet.execute(workoutId, dateStr, set);
  }

  async deleteSet(workoutId: string, setId: string, exerciseId: string, dateStr: string) {
    return this._deleteSet.execute(workoutId, setId, exerciseId, dateStr);
  }

  async skipExercise(workoutId: string, exerciseId: string) {
    return this._skipExercise.execute(workoutId, exerciseId);
  }

  async addExerciseToWorkout(workoutId: string, exerciseId: string) {
    return this._addExerciseToWorkout.execute(workoutId, exerciseId);
  }

  async reorderWorkoutExercises(workoutId: string, exerciseIds: string[]) {
    return this._reorderWorkoutExercises.execute(workoutId, exerciseIds);
  }

  async deleteWorkoutExercise(workoutId: string, workoutExerciseId: string) {
    return this._deleteWorkoutExercise.execute(workoutId, workoutExerciseId);
  }

  async updateWorkoutExercise(workoutId: string, workoutExerciseId: string, notes?: string) {
    return this._updateWorkoutExercise.execute({ workoutId, workoutExerciseId, ...(notes !== undefined && { notes }) });
  }

  async suggestWeight(exerciseId: string) {
    return this._suggestWeight.execute(exerciseId);
  }

  async suggestWarmup(exerciseId: string, sessionContext: SessionContext, warmupStyle?: WarmupStyle, targetWeight?: number) {
    return this._suggestWeight.suggestWarmup(exerciseId, sessionContext, warmupStyle, targetWeight);
  }
}
