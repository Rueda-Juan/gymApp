import { useCallback, useMemo } from 'react';
import { useContainer } from './useContainer';
import type { WorkoutSet } from '../../domain/entities/WorkoutSet';
import type { SessionContext } from '../../domain/valueObjects/SessionContext';
import type { WarmupStyle } from '../../application/useCases/exercises/SuggestWarmup';

export function useWorkout() {
  const { startWorkout: startWorkoutUseCase, finishWorkout: finishWorkoutUseCase, deleteWorkout: deleteWorkoutUseCase, recordSet: recordSetUseCase, updateSet: updateSetUseCase, deleteSet: deleteSetUseCase, skipExercise: skipExerciseUseCase, addExerciseToWorkout: addExerciseToWorkoutUseCase, reorderWorkoutExercises: reorderWorkoutExercisesUseCase, deleteWorkoutExercise: deleteWorkoutExerciseUseCase, updateWorkoutExercise: updateWorkoutExerciseUseCase, suggestWeight: suggestWeightUseCase, suggestWarmup: suggestWarmupUseCase } = useContainer();

  const startWorkout = useCallback((routineId: string | null) => startWorkoutUseCase.execute(routineId), [startWorkoutUseCase]);
  const finishWorkout = useCallback((workoutId: string) => finishWorkoutUseCase.execute(workoutId), [finishWorkoutUseCase]);
  const deleteWorkout = useCallback((workoutId: string) => deleteWorkoutUseCase.execute(workoutId), [deleteWorkoutUseCase]);
  const recordSet = useCallback((workoutId: string, set: WorkoutSet) => recordSetUseCase.execute(workoutId, set), [recordSetUseCase]);
  const updateSet = useCallback((workoutId: string, dateStr: string, set: WorkoutSet) => updateSetUseCase.execute(workoutId, dateStr, set), [updateSetUseCase]);
  const deleteSet = useCallback((workoutId: string, setId: string, exerciseId: string, dateStr: string) => deleteSetUseCase.execute(workoutId, setId, exerciseId, dateStr), [deleteSetUseCase]);
  const skipExercise = useCallback((workoutId: string, exerciseId: string) => skipExerciseUseCase.execute(workoutId, exerciseId), [skipExerciseUseCase]);
  const addExerciseToWorkout = useCallback((workoutId: string, exerciseId: string) => addExerciseToWorkoutUseCase.execute(workoutId, exerciseId), [addExerciseToWorkoutUseCase]);
  const reorderWorkoutExercises = useCallback((workoutId: string, exerciseIds: string[]) => reorderWorkoutExercisesUseCase.execute(workoutId, exerciseIds), [reorderWorkoutExercisesUseCase]);
  const deleteWorkoutExercise = useCallback((workoutId: string, workoutExerciseId: string) => deleteWorkoutExerciseUseCase.execute(workoutId, workoutExerciseId), [deleteWorkoutExerciseUseCase]);
  const updateWorkoutExercise = useCallback((workoutId: string, workoutExerciseId: string, notes?: string) => updateWorkoutExerciseUseCase.execute({ workoutId, workoutExerciseId, ...(notes !== undefined && { notes }) }), [updateWorkoutExerciseUseCase]);
  const suggestWeight = useCallback((exerciseId: string) => suggestWeightUseCase.execute(exerciseId), [suggestWeightUseCase]);
  const suggestWarmup = useCallback((exerciseId: string, sessionContext: SessionContext, warmupStyle?: WarmupStyle, targetWeight?: number) => suggestWarmupUseCase.execute(exerciseId, sessionContext, warmupStyle, targetWeight), [suggestWarmupUseCase]);

  return useMemo(() => ({
    startWorkout, finishWorkout, deleteWorkout, recordSet, updateSet, deleteSet, skipExercise, addExerciseToWorkout, reorderWorkoutExercises, deleteWorkoutExercise, updateWorkoutExercise, suggestWeight, suggestWarmup
  }), [ startWorkout, finishWorkout, deleteWorkout, recordSet, updateSet, deleteSet, skipExercise, addExerciseToWorkout, reorderWorkoutExercises, deleteWorkoutExercise, updateWorkoutExercise, suggestWeight, suggestWarmup ]);
}
