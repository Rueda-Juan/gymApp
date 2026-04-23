import { useCallback } from 'react';
import type { RoutineWithLastPerformed } from '@kernel';

export function useLastPerformedLabel() {
  return useCallback((routine: RoutineWithLastPerformed) => {
    return routine.lastPerformed ? `Hace ${routine.lastPerformed}` : 'Nunca';
  }, []);
}
