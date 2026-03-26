import { useCallback, useMemo } from 'react';
import { useContainer } from './useContainer';
import type { Routine } from '../../domain/entities/Routine';

/**
 * Hook that exposes all routine-related operations.
 * Wraps RoutineService from the DI container.
 */
export function useRoutines() {
  const { routineService } = useContainer();

  const createRoutine = useCallback(
    (params: Omit<Routine, 'id' | 'createdAt'>) =>
      routineService.createRoutine(params),
    [routineService],
  );

  const updateRoutine = useCallback(
    (id: string, params: Partial<Omit<Routine, 'id' | 'createdAt'>>) =>
      routineService.updateRoutine(id, params),
    [routineService],
  );

  const deleteRoutine = useCallback(
    (id: string) => routineService.deleteRoutine(id),
    [routineService],
  );

  const duplicateRoutine = useCallback(
    (id: string) => routineService.duplicateRoutine(id),
    [routineService],
  );

  return useMemo(() => ({
    createRoutine,
    updateRoutine,
    deleteRoutine,
    duplicateRoutine,
  }), [createRoutine, updateRoutine, deleteRoutine, duplicateRoutine]);
}
