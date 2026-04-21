import { useCallback } from 'react';
import type { RoutineWithLastPerformed } from './useHomeData';

export function useLastPerformedLabel() {
  return useCallback((routine: RoutineWithLastPerformed) => {
    return routine.lastPerformed ? `Hace ${routine.lastPerformed}` : 'Nunca';
  }, []);
}
