import { useCallback, useMemo } from 'react';
import { useDI } from '../context/DIContext';
import type { WorkoutSet, SessionContext, WarmupStyle } from 'backend/shared/types';
import type { WorkoutExerciseState } from '@/store/useActiveWorkout';

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
        setType: s.type as 'warmup' | 'normal' | 'failure' | 'dropset',
        restSeconds: null,
        durationSeconds: 0,
        completed: true,
        skipped: false,
        createdAt: new Date(),
      })),
  };
}

export function useWorkout() {
  const { workoutService } = useDI();

  const startWorkout = useCallback(
    (routineId: string | null) => workoutService.startWorkout(routineId),
    [workoutService]
  );

  const finishWorkout = useCallback(
    (workoutId: string) => workoutService.finishWorkout(workoutId),
    [workoutService]
  );

  const deleteWorkout = useCallback(
    (workoutId: string) => workoutService.deleteWorkout(workoutId),
    [workoutService]
  );

  const recordSet = useCallback(
    (workoutId: string, set: WorkoutSet) => workoutService.recordSet(workoutId, set),
    [workoutService]
  );

  const updateSet = useCallback(
    (workoutId: string, dateStr: string, set: WorkoutSet) => workoutService.updateSet(workoutId, dateStr, set),
    [workoutService]
  );

  const deleteSet = useCallback(
    (workoutId: string, setId: string, exerciseId: string, dateStr: string) => workoutService.deleteSet(workoutId, setId, exerciseId, dateStr),
    [workoutService]
  );

  const skipExercise = useCallback(
    (workoutId: string, exerciseId: string) => workoutService.skipExercise(workoutId, exerciseId),
    [workoutService]
  );

  const addExerciseToWorkout = useCallback(
    (workoutId: string, exerciseId: string) => workoutService.addExerciseToWorkout(workoutId, exerciseId),
    [workoutService]
  );

  const reorderWorkoutExercises = useCallback(
    (workoutId: string, exerciseIds: string[]) => workoutService.reorderWorkoutExercises(workoutId, exerciseIds),
    [workoutService]
  );

  const deleteWorkoutExercise = useCallback(
    (workoutId: string, workoutExerciseId: string) => workoutService.deleteWorkoutExercise(workoutId, workoutExerciseId),
    [workoutService]
  );

  const updateWorkoutExercise = useCallback(
    (workoutId: string, workoutExerciseId: string, notes?: string) => workoutService.updateWorkoutExercise(workoutId, workoutExerciseId, notes),
    [workoutService]
  );

  const suggestWeight = useCallback(
    (exerciseId: string) => workoutService.suggestWeight(exerciseId),
    [workoutService]
  );

  const getHistory = useCallback(
    (limit?: number) => workoutService.getHistory(limit),
    [workoutService]
  );

  const getWorkoutById = useCallback(
    (id: string) => workoutService.getById(id),
    [workoutService]
  );

  const suggestWarmup = useCallback(
    (exerciseId: string, sessionContext: SessionContext, warmupStyle?: WarmupStyle, targetWeight?: number) => workoutService.suggestWarmup(exerciseId, sessionContext, warmupStyle, targetWeight),
    [workoutService]
  );

  const recordAllSets = useCallback(
    (workoutId: string, exercises: WorkoutExerciseState[]) =>
      workoutService.recordAllSets(workoutId, exercises.map((ex, idx) => mapExerciseStateToBackend(ex, idx))),
    [workoutService]
  );

  const getPreviousSets = useCallback(
    (exerciseId: string) => workoutService.getPreviousSets(exerciseId),
    [workoutService]
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