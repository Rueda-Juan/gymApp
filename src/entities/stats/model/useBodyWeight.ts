import { useCallback, useMemo } from 'react';
import { useStatsDb } from '../db/useStatsDb';
import type { BodyWeight } from '@kernel';

export function useBodyWeight() {
  const {
    logBodyWeight: logBW,
    getBodyWeightHistory: getHistory,
    updateBodyWeight: updateBW,
    deleteBodyWeight: deleteBW,
  } = useStatsDb();

  const logBodyWeight = useCallback(
    (params: Omit<BodyWeight, 'id' | 'date'>) =>
      logBW(params.weight, params.notes || undefined),
    [logBW]
  );

  const getBodyWeightHistory = useCallback(
    (startDate: string, endDate: string) =>
      getHistory(startDate, endDate),
    [getHistory]
  );

  const updateBodyWeight = useCallback(
    (params: { id: string; weight: number; notes?: string }) =>
      updateBW(params.id, params.weight, params.notes),
    [updateBW]
  );

  const deleteBodyWeight = useCallback(
    (bodyWeightId: string) =>
      deleteBW(bodyWeightId),
    [deleteBW]
  );

  return useMemo(() => ({
    logBodyWeight,
    getBodyWeightHistory,
    updateBodyWeight,
    deleteBodyWeight,
  }), [
    logBodyWeight,
    getBodyWeightHistory,
    updateBodyWeight,
    deleteBodyWeight
  ]);
}
