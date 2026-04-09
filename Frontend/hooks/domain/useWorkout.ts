import { useCallback, useMemo } from 'react';
import { useDI } from '@/context/DIContext';
import type { WorkoutSet, SessionContext, WarmupStyle } from 'backend/shared/types';
import type { WorkoutExerciseState } from '@/store/useActiveWorkout';

const VALID_SET_TYPES = ['warmup', 'normal', 'failure', 'dropset'] as const;
type SetType = typeof VALID_SET_TYPES[number];

function asSetType(raw: string): SetType {
  const isValid = (VALID_SET_TYPES as readonly string[]).includes(raw);
  return isValid ? (raw as SetType) : 'normal';
}

function mapExerciseStateToBackend(ex: WorkoutExerciseState, orderIndex: number) {
  return {
    id: ex.id,
    exerciseId: ex.exerciseId,
    orderIndex,
    skipped: ex.status === 'skipped',
    notes: null,
    supersetGroup: ex.supersetGroup ?? null,
    sets: ex.sets
      .filter(s => s.isCompleted && s.reps > 0)
      .map((s, idx) => ({
        id: s.id,
        exerciseId: ex.exerciseId,
        setNumber: idx + 1,
        weight: s.weight,
        reps: s.reps,
        rir: s.rir ?? null,
        setType: asSetType(s.type),
        restSeconds: null,
        durationSeconds: 0,
        completed: true,
        skipped: false,
        createdAt: new Date(),
      })),
  };
}

export function useWorkout() {
  const {
    startWorkout: startUC,
    finishWorkout: finishUC,
    deleteWorkout: deleteUC,
    recordSet: recSetUC,
    updateSet: upSetUC,
    deleteSet: delSetUC,
    skipExercise: skipExUC,
    addExerciseToWorkout: addExUC,
    reorderWorkoutExercises: reorderUC,
    deleteWorkoutExercise: delExUC,
    updateWorkoutExercise: upwkExUC,
    suggestWeight: sugWUC,
    getWorkoutHistory: getHistUC,
    getWorkoutById: getByIdUC,
    suggestWarmup: sugWarmUC,
    recordAllSets: recAllUC,
    getPreviousSets: getPrevUC,
  } = useDI();

  const startWorkout = useCallback(
    (routineId: string | null) => startUC.execute(routineId),
    [startUC]
  );

  const finishWorkout = useCallback(
    (workoutId: string) => finishUC.execute(workoutId),
    [finishUC]
  );

  const deleteWorkout = useCallback(
    (workoutId: string) => deleteUC.execute(workoutId),
    [deleteUC]
  );

  const recordSet = useCallback(
    (workoutId: string, set: WorkoutSet) => recSetUC.execute(workoutId, set),
    [recSetUC]
  );

  const updateSet = useCallback(
    (workoutId: string, dateStr: string, set: WorkoutSet) => upSetUC.execute(workoutId, dateStr, set),
    [upSetUC]
  );

  const deleteSet = useCallback(
    (workoutId: string, setId: string, exerciseId: string, dateStr: string) => delSetUC.execute(workoutId, setId, exerciseId, dateStr),
    [delSetUC]
  );

  const skipExercise = useCallback(
    (workoutId: string, exerciseId: string) => skipExUC.execute(workoutId, exerciseId),
    [skipExUC]
  );

  const addExerciseToWorkout = useCallback(
    (workoutId: string, exerciseId: string) => addExUC.execute(workoutId, exerciseId),
    [addExUC]
  );

  const reorderWorkoutExercises = useCallback(
    (workoutId: string, exerciseIds: string[]) => reorderUC.execute(workoutId, exerciseIds),
    [reorderUC]
  );

  const deleteWorkoutExercise = useCallback(
    (workoutId: string, workoutExerciseId: string) => delExUC.execute(workoutId, workoutExerciseId),
    [delExUC]
  );

  const updateWorkoutExercise = useCallback(
    (workoutId: string, workoutExerciseId: string, notes?: string) => upwkExUC.execute({ workoutId, workoutExerciseId, notes }),
    [upwkExUC]
  );

  const suggestWeight = useCallback(
    (exerciseId: string) => sugWUC.execute(exerciseId),
    [sugWUC]
  );

  const getHistory = useCallback(
    (limit?: number) => getHistUC.execute(limit),
    [getHistUC]
  );

  const getWorkoutById = useCallback(
    (id: string) => getByIdUC.execute(id),
    [getByIdUC]
  );

  const suggestWarmup = useCallback(
    (exerciseId: string, sessionContext: SessionContext, warmupStyle?: WarmupStyle, targetWeight?: number) => sugWarmUC.execute(exerciseId, sessionContext, warmupStyle, targetWeight),
    [sugWarmUC]
  );

  const recordAllSets = useCallback(
    (workoutId: string, exercises: WorkoutExerciseState[]) =>
      recAllUC.execute(workoutId, exercises.map((ex, idx) => mapExerciseStateToBackend(ex, idx))),
    [recAllUC]
  );

  const getPreviousSets = useCallback(
    (exerciseId: string) => getPrevUC.execute(exerciseId),
    [getPrevUC]
  );

  return useMemo(() => ({
    startWorkout,
    finishWorkout,
    deleteWorkout,
    recordSet,
    recordAllSets,
    getPreviousSets,
    updateSet,
    deleteSet,
    skipExercise,
    addExerciseToWorkout,
    reorderWorkoutExercises,
    deleteWorkoutExercise,
    updateWorkoutExercise,
    suggestWeight,
    suggestWarmup,
    getHistory,
    getWorkoutById,
  }), [
    startWorkout, finishWorkout, deleteWorkout, recordSet, recordAllSets,
    getPreviousSets, updateSet,
    deleteSet, skipExercise, addExerciseToWorkout, reorderWorkoutExercises,
    deleteWorkoutExercise, updateWorkoutExercise, suggestWeight, suggestWarmup,
    getHistory, getWorkoutById
  ]);
}
