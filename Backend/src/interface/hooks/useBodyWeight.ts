import { useCallback, useMemo } from 'react';
import { useContainer } from './useContainer';
import type { BodyWeightEntry } from '../../domain/entities/BodyWeightEntry';

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

  return useMemo(() => ({
    logBodyWeight,
    getBodyWeightHistory,
  }), [logBodyWeight, getBodyWeightHistory]);
}
