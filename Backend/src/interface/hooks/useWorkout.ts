import { useCallback, useMemo } from 'react';
import { useContainer } from './useContainer';
import type { WorkoutSet } from '../../domain/entities/WorkoutSet';
import type { SessionContext } from '../../domain/valueObjects/SessionContext';
import type { WarmupStyle } from '../../application/useCases/exercises/SuggestWeight';

/**
 * Hook that exposes all workout-related operations.
 * Wraps WorkoutService from the DI container.
 */
export function useWorkout() {
  const { workoutService } = useContainer();

  const startWorkout = useCallback(
    (routineId: string | null) => workoutService.startWorkout(routineId),
    [workoutService],
  );

  const finishWorkout = useCallback(
    (workoutId: string) => workoutService.finishWorkout(workoutId),
    [workoutService],
  );

  const deleteWorkout = useCallback(
    (workoutId: string) => workoutService.deleteWorkout(workoutId),
    [workoutService],
  );

  const recordSet = useCallback(
    (workoutId: string, set: WorkoutSet) => workoutService.recordSet(workoutId, set),
    [workoutService],
  );

  const updateSet = useCallback(
    (workoutId: string, dateStr: string, set: WorkoutSet) =>
      workoutService.updateSet(workoutId, dateStr, set),
    [workoutService],
  );

  const deleteSet = useCallback(
    (workoutId: string, setId: string, exerciseId: string, dateStr: string) =>
      workoutService.deleteSet(workoutId, setId, exerciseId, dateStr),
    [workoutService],
  );

  const skipExercise = useCallback(
    (workoutId: string, exerciseId: string) =>
      workoutService.skipExercise(workoutId, exerciseId),
    [workoutService],
  );

  const addExerciseToWorkout = useCallback(
    (workoutId: string, exerciseId: string) =>
      workoutService.addExerciseToWorkout(workoutId, exerciseId),
    [workoutService],
  );

  const reorderWorkoutExercises = useCallback(
    (workoutId: string, exerciseIds: string[]) =>
      workoutService.reorderWorkoutExercises(workoutId, exerciseIds),
    [workoutService],
  );

  const suggestWeight = useCallback(
    (exerciseId: string) => workoutService.suggestWeight(exerciseId),
    [workoutService],
  );

  const suggestWarmup = useCallback(
    (exerciseId: string, sessionContext: SessionContext, warmupStyle?: WarmupStyle, targetWeight?: number) =>
      workoutService.suggestWarmup(exerciseId, sessionContext, warmupStyle, targetWeight),
    [workoutService],
  );

  return useMemo(() => ({
    startWorkout,
    finishWorkout,
    deleteWorkout,
    recordSet,
    updateSet,
    deleteSet,
    skipExercise,
    addExerciseToWorkout,
    reorderWorkoutExercises,
    suggestWeight,
    suggestWarmup,
  }), [
    startWorkout, finishWorkout, deleteWorkout,
    recordSet, updateSet, deleteSet,
    skipExercise, addExerciseToWorkout, reorderWorkoutExercises,
    suggestWeight, suggestWarmup,
  ]);
}
