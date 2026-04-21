import { useCallback } from 'react';
import type { RoutineWithLastPerformed } from './useHomeData';
import { getExerciseName } from '@/utils/exercise';

// Hook para formatear la lista de ejercicios de una rutina
export function useRoutineExercisesLabel() {
  return useCallback((routine: RoutineWithLastPerformed) => {
    return routine.exercises
      .map(re => getExerciseName(re.exerciseId))
      .filter(Boolean)
      .join(' · ');
  }, []);
}
