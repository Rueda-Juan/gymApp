import type { StartWorkoutUseCase } from '../../application/useCases/StartWorkout';
import type { FinishWorkoutUseCase } from '../../application/useCases/FinishWorkout';
import type { DeleteWorkoutUseCase } from '../../application/useCases/DeleteWorkoutUseCase';
import type { RecordSetUseCase } from '../../application/useCases/RecordSet';
import type { UpdateSetUseCase } from '../../application/useCases/UpdateSetUseCase';
import type { DeleteSetUseCase } from '../../application/useCases/DeleteSetUseCase';
import type { SkipExerciseUseCase } from '../../application/useCases/SkipExercise';
import type { AddExerciseToWorkoutUseCase } from '../../application/useCases/AddExerciseToWorkoutUseCase';
import type { ReorderWorkoutExercisesUseCase } from '../../application/useCases/ReorderWorkoutExercisesUseCase';
import type { SuggestWeightUseCase } from '../../application/useCases/SuggestWeight';
import type { WorkoutSet } from '../../domain/entities/WorkoutSet';

export class WorkoutService {
  constructor(
    private readonly _startWorkout: StartWorkoutUseCase,
    private readonly _finishWorkout: FinishWorkoutUseCase,
    private readonly _deleteWorkout: DeleteWorkoutUseCase,
    private readonly _recordSet: RecordSetUseCase,
    private readonly _updateSet: UpdateSetUseCase,
    private readonly _deleteSet: DeleteSetUseCase,
    private readonly _skipExercise: SkipExerciseUseCase,
    private readonly _addExerciseToWorkout: AddExerciseToWorkoutUseCase,
    private readonly _reorderWorkoutExercises: ReorderWorkoutExercisesUseCase,
    private readonly _suggestWeight: SuggestWeightUseCase,
  ) {}

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

  async suggestWeight(exerciseId: string) {
    return this._suggestWeight.execute(exerciseId);
  }
}
