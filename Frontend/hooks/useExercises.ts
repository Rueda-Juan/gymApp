// hooks/useExercises.ts
import { useCallback, useMemo } from 'react';
import { useDI } from '../context/DIContext';
import type { Exercise } from 'backend/shared/types';

export function useExercises() {
  const { exerciseService } = useDI();

  const createExercise = useCallback(
    (params: Omit<Exercise, 'id'>) => exerciseService.createExercise(params),
    [exerciseService]
  );

  const updateExercise = useCallback(
    (id: string, params: Partial<Omit<Exercise, 'id'>>) => exerciseService.updateExercise(id, params),
    [exerciseService]
  );

  const deleteExercise = useCallback(
    (id: string) => exerciseService.deleteExercise(id),
    [exerciseService]
  );

  const getExerciseHistory = useCallback(
    (exerciseId: string, limit?: number) => exerciseService.getExerciseHistory(exerciseId, limit),
    [exerciseService]
  );

  const getAll = useCallback(
    () => exerciseService.getAll(),
    [exerciseService]
  );

  const getById = useCallback(
    (id: string) => exerciseService.getById(id),
    [exerciseService]
  );

  return useMemo(() => ({
    createExercise,
    updateExercise,
    deleteExercise,
    getExerciseHistory,
    getAll,
    getById,
  }), [createExercise, updateExercise, deleteExercise, getExerciseHistory, getAll, getById]);
}