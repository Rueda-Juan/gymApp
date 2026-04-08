import { useCallback, useMemo } from 'react';
import { useContainer } from './useContainer';
import type { Routine, RoutineExercise } from '../../domain/entities/Routine';

export function useRoutines() {
  const { getRoutines: getRoutinesUseCase, getRoutineById: getRoutineByIdUseCase, createRoutine: createRoutineUseCase, updateRoutine: updateRoutineUseCase, deleteRoutine: deleteRoutineUseCase, duplicateRoutine: duplicateRoutineUseCase, getRoutineExercises: getRoutineExercisesUseCase } = useContainer();

  const getRoutines = useCallback(
    () => getRoutinesUseCase.execute(),
    [getRoutinesUseCase],
  );

  const getRoutineById = useCallback(
    (id: string) => getRoutineByIdUseCase.execute(id),
    [getRoutineByIdUseCase],
  );

  const createRoutine = useCallback(
    (params: Omit<Routine, 'id' | 'createdAt'>) => createRoutineUseCase.execute(params),
    [createRoutineUseCase],
  );

  const updateRoutine = useCallback(
    (id: string, params: Partial<Omit<Routine, 'id' | 'createdAt'>>) => updateRoutineUseCase.execute(id, params),
    [updateRoutineUseCase],
  );

  const deleteRoutine = useCallback(
    (id: string) => deleteRoutineUseCase.execute(id),
    [deleteRoutineUseCase],
  );

  const duplicateRoutine = useCallback(
    (id: string) => duplicateRoutineUseCase.execute(id),
    [duplicateRoutineUseCase],
  );

  const getExercises = useCallback(
    (routineId: string): Promise<RoutineExercise[]> => getRoutineExercisesUseCase.execute(routineId),
    [getRoutineExercisesUseCase],
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
