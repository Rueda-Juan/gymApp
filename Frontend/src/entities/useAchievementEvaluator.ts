import { useCallback } from 'react';
import { useDI } from '@/context/DIContext';
import type { WorkoutSetDTO } from '@shared';

export function useAchievementEvaluator() {
  const { evaluateSetPR } = useDI();

  /**
   * Evaluate a set against PRs asynchronously without interrupting the main thread
   */
  const evaluateSet = useCallback(
    async (exerciseId: string, set: WorkoutSetDTO) => {
      try {
        const brokenRecords = await evaluateSetPR.execute(exerciseId, set);
        return brokenRecords;
      } catch (error) {
        // En caso de error de lectura, retornar array vacío para no bloquear la app
         
        console.warn('Error al evaluar PR:', error);
        return [];
      }
    },
    [evaluateSetPR]
  );

  return { evaluateSet };
}
