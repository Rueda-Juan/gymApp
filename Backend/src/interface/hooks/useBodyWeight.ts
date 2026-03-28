import { useCallback, useMemo } from 'react';
import { useContainer } from './useContainer';
import type { BodyWeightEntry } from '../../domain/entities/BodyWeightEntry';
import type { UpdateBodyWeightInput } from '../../application/useCases/stats/UpdateBodyWeightUseCase';

/**
 * Hook that exposes body weight tracking operations.
 * Wraps BodyWeightService from the DI container.
 */
export function useBodyWeight() {
  const { bodyWeightService } = useContainer();

  const logBodyWeight = useCallback(
    (params: Omit<BodyWeightEntry, 'id' | 'createdAt'>) =>
      bodyWeightService.logBodyWeight(params),
    [bodyWeightService],
  );

  const getBodyWeightHistory = useCallback(
    (startDate: Date, endDate: Date) =>
      bodyWeightService.getBodyWeightHistory(startDate, endDate),
    [bodyWeightService],
  );

  const updateBodyWeight = useCallback(
    (params: UpdateBodyWeightInput) =>
      bodyWeightService.updateBodyWeight(params),
    [bodyWeightService],
  );

  const deleteBodyWeight = useCallback(
    (bodyWeightId: string) =>
      bodyWeightService.deleteBodyWeight(bodyWeightId),
    [bodyWeightService],
  );

  return useMemo(() => ({
    logBodyWeight,
    getBodyWeightHistory,
    updateBodyWeight,
    deleteBodyWeight,
  }), [logBodyWeight, getBodyWeightHistory, updateBodyWeight, deleteBodyWeight]);
}
