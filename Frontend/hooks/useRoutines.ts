import { useCallback, useMemo } from 'react';
import { useDI } from '../context/DIContext';
import type { Routine, RoutineExercise } from 'backend/shared/types';

export function useRoutines() {
  const { routineService } = useDI();

  const getRoutines = useCallback(
    () => routineService.getAll(),
    [routineService]
  );

  const getRoutineById = useCallback(
    (id: string) => routineService.getById(id),
    [routineService]
  );

  const createRoutine = useCallback(
    (params: Omit<Routine, 'id' | 'createdAt'>) =>
      routineService.createRoutine(params),
    [routineService]
  );

  const updateRoutine = useCallback(
    (id: string, params: Partial<Omit<Routine, 'id' | 'createdAt'>>) =>
      routineService.updateRoutine(id, params),
    [routineService]
  );

  const deleteRoutine = useCallback(
    (id: string) => routineService.deleteRoutine(id),
    [routineService]
  );

  const duplicateRoutine = useCallback(
    (id: string) => routineService.duplicateRoutine(id),
    [routineService]
  );

  const getExercises = useCallback(
    (routineId: string): Promise<RoutineExercise[]> =>
      routineService.getExercises(routineId),
    [routineService]
  );

  return useMemo(() => ({
    getRoutines,
    getRoutineById,
    createRoutine,
    updateRoutine,
    deleteRoutine,
    duplicateRoutine,
    getExercises,
  }), [getRoutines, getRoutineById, createRoutine, updateRoutine, deleteRoutine, duplicateRoutine, getExercises]);
}