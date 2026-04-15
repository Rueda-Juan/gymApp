import { useCallback } from 'react';
import { useDI } from '@/context/DIContext';
import type { WorkoutSet } from 'backend/domain/entities/WorkoutSet';

export function useAchievementEvaluator() {
  const { evaluateSetPR } = useDI();

  /**
   * Evaluate a set against PRs asynchronously without interrupting the main thread
   */
  const evaluateSet = useCallback(
    async (exerciseId: string, set: WorkoutSet) => {
      try {
        const brokenRecords = await evaluateSetPR.execute(exerciseId, set);
        return brokenRecords;
      } catch (error) {
        // En caso de error de lectura, retornar array vacío para no bloquear la app
        // eslint-disable-next-line no-console
        console.warn('Error al evaluar PR:', error);
        return [];
      }
    },
    [evaluateSetPR]
  );

  return { evaluateSet };
}
