import { useCallback } from 'react';
import { RoutineWithLastPerformed } from '@kernel';
import { getExerciseName } from '@/shared/lib/exercise';

import { RoutineExercise } from '@kernel';

// Hook para formatear la lista de ejercicios de una rutina
export function useRoutineExercisesLabel() {
  return useCallback((routine: RoutineWithLastPerformed) => {
    return (routine.exercises || [])
      .map((re: RoutineExercise & { exercise?: { name: string; nameEs?: string | null } }) => {
        const name = re.exercise?.name || re.exerciseId;
        const nameEs = re.exercise?.nameEs;
        return getExerciseName({ name, nameEs });
      })
      .filter(Boolean)
      .join(' · ');
  }, []);
}

