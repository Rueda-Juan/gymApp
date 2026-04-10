import { useCallback, useMemo } from 'react';
import { useContainer } from './useContainer';
import type { Exercise } from '../../domain/entities/Exercise';

export function useExercises() {
  const { createExercise: createExerciseUseCase, updateExercise: updateExerciseUseCase, deleteExercise: deleteExerciseUseCase, getExerciseHistory: getExerciseHistoryUseCase } = useContainer();

  const createExercise = useCallback(
    (params: Omit<Exercise, 'id'>) => createExerciseUseCase.execute(params),
    [createExerciseUseCase],
  );

  const updateExercise = useCallback(
    (id: string, params: Partial<Omit<Exercise, 'id'>>) => updateExerciseUseCase.execute(id, params),
    [updateExerciseUseCase],
  );

  const deleteExercise = useCallback(
    (id: string) => deleteExerciseUseCase.execute(id),
    [deleteExerciseUseCase],
  );

  const getExerciseHistory = useCallback(
    (exerciseId: string, limit?: number) => getExerciseHistoryUseCase.execute(exerciseId, limit),
    [getExerciseHistoryUseCase],
  );

  return useMemo(() => ({
    createExercise,
    updateExercise,
    deleteExercise,
    getExerciseHistory,
  }), [createExercise, updateExercise, deleteExercise, getExerciseHistory]);
}
