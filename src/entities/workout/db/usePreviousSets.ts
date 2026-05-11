import { useEffect, useRef, useCallback } from 'react';
import { useWorkoutDb } from './useWorkoutDb';
import { useActiveWorkout, ActiveWorkoutStore } from '../model/useActiveWorkout';
import { WorkoutSet } from '@kernel';

type ExerciseWithSets = {
  exerciseId: string;
  sets: { weight: number }[];
};

/**
 * Caches the previous sets for each exercise and exposes a helper
 * to resolve the suggested weight for a given set index.
 * Cache is automatically cleared when the workout session changes.
 */
export function usePreviousSets(activeExerciseId: string | undefined) {
  const workoutId = useActiveWorkout((s: ActiveWorkoutStore) => s.workoutId);
  const workoutService = useWorkoutDb();
  const previousSetsCache = useRef<Map<string, WorkoutSet[]>>(new Map());

  useEffect(() => {
    if (!activeExerciseId) return;
    if (previousSetsCache.current.has(activeExerciseId)) return;

    let cancelled = false;
    workoutService.getPreviousSets(activeExerciseId)
      .then((sets: WorkoutSet[]) => {
        if (!cancelled) previousSetsCache.current.set(activeExerciseId, sets);
      })
      .catch((err) => {
        if (!cancelled) console.warn('[usePreviousSets] failed to load:', err);
      });

    return () => { cancelled = true; };
  }, [activeExerciseId, workoutService]);

  useEffect(() => {
    previousSetsCache.current.clear();
  }, [workoutId]);

  const resolvePreviousWeight = useCallback(
    (exercise: ExerciseWithSets, setIndex: number): number => {
      const cachedSets = previousSetsCache.current.get(exercise.exerciseId);
      const historicalWeight = cachedSets?.[setIndex]?.weight;
      const fallback = setIndex > 0 ? exercise.sets[setIndex - 1].weight : 0;
      return historicalWeight ?? fallback;
    },
    [],
  );

  return { resolvePreviousWeight };
}
