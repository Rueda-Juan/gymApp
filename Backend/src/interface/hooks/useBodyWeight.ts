import { useCallback, useMemo } from 'react';
import { useContainer } from './useContainer';
import type { BodyWeightEntry } from '../../domain/entities/BodyWeightEntry';
import type { UpdateBodyWeightInput } from '../../application/useCases/stats/UpdateBodyWeightUseCase';

export function useBodyWeight() {
  const { logBodyWeight: logBodyWeightUseCase, getBodyWeightHistory: getBodyWeightHistoryUseCase, updateBodyWeight: updateBodyWeightUseCase, deleteBodyWeight: deleteBodyWeightUseCase } = useContainer();

  const logBodyWeight = useCallback(
    (params: Omit<BodyWeightEntry, 'id' | 'createdAt'>) => logBodyWeightUseCase.execute(params),
    [logBodyWeightUseCase],
  );

  const getBodyWeightHistory = useCallback(
    (startDate: string, endDate: string) => getBodyWeightHistoryUseCase.execute(startDate, endDate),
    [getBodyWeightHistoryUseCase],
  );

  const updateBodyWeight = useCallback(
    (params: UpdateBodyWeightInput) => updateBodyWeightUseCase.execute(params),
    [updateBodyWeightUseCase],
  );

  const deleteBodyWeight = useCallback(
    (bodyWeightId: string) => deleteBodyWeightUseCase.execute(bodyWeightId),
    [deleteBodyWeightUseCase],
  );

  return useMemo(() => ({
    logBodyWeight,
    getBodyWeightHistory,
    updateBodyWeight,
    deleteBodyWeight,
  }), [logBodyWeight, getBodyWeightHistory, updateBodyWeight, deleteBodyWeight]);
}
