import { useCallback, useMemo } from 'react';
import { useDI } from '@/shared/context/DIContext';
import type { UpdateBodyWeightInput, BodyWeight } from '@kernel/types';

export function useBodyWeight() {
  const {
    logBodyWeight: logBWUC,
    getBodyWeightHistory: getHistoryUC,
    updateBodyWeight: updateBWUC,
    deleteBodyWeight: deleteBWUC,
  } = useDI();

  const logBodyWeight = useCallback(
    (params: Omit<BodyWeight, 'id' | 'createdAt'>) =>
      logBWUC.execute(params),
    [logBWUC]
  );

  const getBodyWeightHistory = useCallback(
    (startDate: string, endDate: string) =>
      getHistoryUC.execute(startDate, endDate),
    [getHistoryUC]
  );

  const updateBodyWeight = useCallback(
    (params: UpdateBodyWeightInput) =>
      updateBWUC.execute(params),
    [updateBWUC]
  );

  const deleteBodyWeight = useCallback(
    (bodyWeightId: string) =>
      deleteBWUC.execute(bodyWeightId),
    [deleteBWUC]
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
