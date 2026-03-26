import { useCallback, useMemo } from 'react';
import { useContainer } from './useContainer';
import type { Exercise } from '../../domain/entities/Exercise';

/**
 * Hook that exposes all exercise-related operations.
 * Wraps ExerciseService from the DI container.
 */
export function useExercises() {
  const { exerciseService } = useContainer();

  const createExercise = useCallback(
    (params: Omit<Exercise, 'id'>) => exerciseService.createExercise(params),
    [exerciseService],
  );

  const updateExercise = useCallback(
    (id: string, params: Partial<Omit<Exercise, 'id'>>) =>
      exerciseService.updateExercise(id, params),
    [exerciseService],
  );

  const deleteExercise = useCallback(
    (id: string) => exerciseService.deleteExercise(id),
    [exerciseService],
  );

  const getExerciseHistory = useCallback(
    (exerciseId: string, limit?: number) =>
      exerciseService.getExerciseHistory(exerciseId, limit),
    [exerciseService],
  );

  return useMemo(() => ({
    createExercise,
    updateExercise,
    deleteExercise,
    getExerciseHistory,
  }), [createExercise, updateExercise, deleteExercise, getExerciseHistory]);
}
