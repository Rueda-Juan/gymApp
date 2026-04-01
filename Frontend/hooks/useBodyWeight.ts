import { useCallback, useMemo } from 'react';
import { useDI } from '../context/DIContext';
import type { BodyWeightEntry, UpdateBodyWeightInput } from 'backend/shared/types';

export function useBodyWeight() {
  const { bodyWeightService } = useDI();

  const logBodyWeight = useCallback(
    (params: Omit<BodyWeightEntry, 'id' | 'createdAt'>) =>
      bodyWeightService.logBodyWeight(params),
    [bodyWeightService]
  );

  const getBodyWeightHistory = useCallback(
    (startDate: string, endDate: string) =>
      bodyWeightService.getBodyWeightHistory(startDate, endDate),
    [bodyWeightService]
  );

  const updateBodyWeight = useCallback(
    (params: UpdateBodyWeightInput) =>
      bodyWeightService.updateBodyWeight(params),
    [bodyWeightService]
  );

  const deleteBodyWeight = useCallback(
    (bodyWeightId: string) =>
      bodyWeightService.deleteBodyWeight(bodyWeightId),
    [bodyWeightService]
  );

  return useMemo(() => ({
    logBodyWeight,
    getBodyWeightHistory,
    updateBodyWeight,
    deleteBodyWeight,
  }), [logBodyWeight, getBodyWeightHistory, updateBodyWeight, deleteBodyWeight]);
}