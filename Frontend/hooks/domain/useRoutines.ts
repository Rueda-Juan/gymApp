import { useCallback, useMemo } from 'react';
import { useDI } from '@/context/DIContext';
import type { Routine, RoutineExercise } from 'backend/shared/types';

export function useRoutines() {
  const {
    createRoutine: createUC,
    updateRoutine: updateUC,
    deleteRoutine: deleteUC,
    duplicateRoutine: duplicateUC,
    getRoutines: getRoutinesUC,
    getRoutineById: getByIdUC,
    getRoutineExercises: getExercisesUC,
  } = useDI();

  const getRoutines = useCallback(
    () => getRoutinesUC.execute(),
    [createUC, updateUC, deleteUC, duplicateUC, getRoutinesUC, getByIdUC, getExercisesUC]
  );

  const getRoutineById = useCallback(
    (id: string) => getByIdUC.execute(id),
    [createUC, updateUC, deleteUC, duplicateUC, getRoutinesUC, getByIdUC, getExercisesUC]
  );

  const createRoutine = useCallback(
    (params: Omit<Routine, 'id' | 'createdAt'>) =>
      createUC.execute(params),
    [createUC, updateUC, deleteUC, duplicateUC, getRoutinesUC, getByIdUC, getExercisesUC]
  );

  const updateRoutine = useCallback(
    (id: string, params: Partial<Omit<Routine, 'id' | 'createdAt'>>) =>
      updateUC.execute(id, params),
    [createUC, updateUC, deleteUC, duplicateUC, getRoutinesUC, getByIdUC, getExercisesUC]
  );

  const deleteRoutine = useCallback(
    (id: string) => deleteUC.execute(id),
    [createUC, updateUC, deleteUC, duplicateUC, getRoutinesUC, getByIdUC, getExercisesUC]
  );

  const duplicateRoutine = useCallback(
    (id: string) => duplicateUC.execute(id),
    [createUC, updateUC, deleteUC, duplicateUC, getRoutinesUC, getByIdUC, getExercisesUC]
  );

  const getExercises = useCallback(
    (routineId: string): Promise<RoutineExercise[]> =>
      getExercisesUC.execute(routineId),
    [createUC, updateUC, deleteUC, duplicateUC, getRoutinesUC, getByIdUC, getExercisesUC]
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
