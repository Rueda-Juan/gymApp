import { useCallback, useMemo } from 'react';
import { useDI } from '@/context/DIContext';
import type { Exercise } from 'backend/shared/types';

export function useExercises() {
  const {
    createExercise: createUC,
    updateExercise: updateUC,
    deleteExercise: deleteUC,
    getExerciseHistory: getHistoryUC,
    getExercises: getExercisesUC,
    getExerciseById: getByIdUC,
  } = useDI();

  const createExercise = useCallback(
    (params: Omit<Exercise, 'id'>) => createUC.execute(params),
    [createUC]
  );

  const createCustomExercise = useCallback(
    (params: Omit<Exercise, 'id'>) =>
      createUC.execute({ ...params, isCustom: true }),
    [createUC]
  );

  const updateExercise = useCallback(
    (id: string, params: Partial<Omit<Exercise, 'id'>>) => updateUC.execute(id, params),
    [updateUC]
  );

  const deleteExercise = useCallback(
    (id: string) => deleteUC.execute(id),
    [deleteUC]
  );

  const getExerciseHistory = useCallback(
    (exerciseId: string, limit?: number) => getHistoryUC.execute(exerciseId, limit),
    [getHistoryUC]
  );

  const getAll = useCallback(
    () => getExercisesUC.execute(),
    [getExercisesUC]
  );

  const getById = useCallback(
    (id: string) => getByIdUC.execute(id),
    [getByIdUC]
  );

  return useMemo(() => ({
    createExercise,
    createCustomExercise,
    updateExercise,
    deleteExercise,
    getExerciseHistory,
    getAll,
    getById,
  }), [createExercise, createCustomExercise, updateExercise, deleteExercise, getExerciseHistory, getAll, getById]);
}
