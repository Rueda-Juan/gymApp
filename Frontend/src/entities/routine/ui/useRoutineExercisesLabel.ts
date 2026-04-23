import { useCallback } from 'react';
import type { RoutineWithLastPerformed } from '../model/types';
import { getExerciseName } from '@/shared/lib/exercise';

// Hook para formatear la lista de ejercicios de una rutina
export function useRoutineExercisesLabel() {
  return useCallback((routine: RoutineWithLastPerformed) => {
    return routine.exercises
      .map((re: any) => getExerciseName(re.exerciseId))
      .filter(Boolean)
      .join(' · ');
  }, []);
}
