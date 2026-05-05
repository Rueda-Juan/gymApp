import { useCallback } from 'react';
import { useStatsDb } from '../db/useStatsDb';
import { detectBrokenRecords } from './stats-calculator';
import { WorkoutSet, ExerciseStats } from '@kernel';

export function useAchievementEvaluator() {
  const { getExerciseStats } = useStatsDb();

  /**
   * Evaluate a set against PRs asynchronously without interrupting the main thread
   */
  const evaluateSet = useCallback(
    async (exerciseId: string, set: WorkoutSet) => {
      try {
        const stats = await getExerciseStats(exerciseId);
        // Map domain stats to ExerciseStats format if needed
        const domainStats: ExerciseStats | null = stats ? {
          ...stats,
          updatedAt: stats.updatedAt || new Date().toISOString(),
        } : null;

        const brokenRecords = detectBrokenRecords(domainStats as ExerciseStats | null, {
          weight: set.weight || 0,
          reps: set.reps || 0,
        });

        return brokenRecords;
      } catch (error) {
        console.warn('Error al evaluar PR:', error);
        return [];
      }
    },
    [getExerciseStats]
  );

  return { evaluateSet };
}
