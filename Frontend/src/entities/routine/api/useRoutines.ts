import { useCallback, useMemo } from 'react';
import { useDI } from '@/shared/context/DIContext';
import type { Routine, RoutineExercise } from '@kernel';

export function useRoutineApi() {
  const {
    createRoutine: createUC,
    updateRoutine: updateUC,
    deleteRoutine: deleteUC,
    duplicateRoutine: duplicateUC,
    getRoutines: getRoutinesUC,
    getRoutineById: getByIdUC,
    getExercises,
  } = useDI();

  const getRoutines = useCallback(
    () => getRoutinesUC.execute(),
    [createUC, updateUC, deleteUC, duplicateUC, getRoutinesUC, getByIdUC]
  );

  const getRoutineById = useCallback(
    (id: string) => getByIdUC.execute(id),
    [createUC, updateUC, deleteUC, duplicateUC, getRoutinesUC, getByIdUC]
  );

  const createRoutine = useCallback(
    (params: Omit<Routine, 'id' | 'createdAt'>) =>
      createUC.execute(params),
    [createUC, updateUC, deleteUC, duplicateUC, getRoutinesUC, getByIdUC]
  );

  const updateRoutine = useCallback(
    (id: string, params: Partial<Omit<Routine, 'id' | 'createdAt'>>) =>
      updateUC.execute(id, params),
    [createUC, updateUC, deleteUC, duplicateUC, getRoutinesUC, getByIdUC]
  );

  const deleteRoutine = useCallback(
    (id: string) => deleteUC.execute(id),
    [createUC, updateUC, deleteUC, duplicateUC, getRoutinesUC, getByIdUC]
  );

  const duplicateRoutine = useCallback(
    (id: string) => duplicateUC.execute(id),
    [createUC, updateUC, deleteUC, duplicateUC, getRoutinesUC, getByIdUC]
  );

  // getExercises viene directo de useDI

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
