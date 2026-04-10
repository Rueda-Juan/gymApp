import { useCallback, useMemo } from 'react';
import { useDI } from '@/context/DIContext';
import type { BodyWeightEntry, UpdateBodyWeightInput } from 'backend/shared/types';

export function useBodyWeight() {
  const {
    logBodyWeight: logBWUC,
    getBodyWeightHistory: getHistoryUC,
    updateBodyWeight: updateBWUC,
    deleteBodyWeight: deleteBWUC,
  } = useDI();

  const logBodyWeight = useCallback(
    (params: Omit<BodyWeightEntry, 'id' | 'createdAt'>) =>
      logBWUC.execute(params),
    [logBWUC, getHistoryUC, updateBWUC, deleteBWUC]
  );

  const getBodyWeightHistory = useCallback(
    (startDate: string, endDate: string) =>
      getHistoryUC.execute(startDate, endDate),
    [getHistoryUC]
  );

  const updateBodyWeight = useCallback(
    (params: UpdateBodyWeightInput) =>
      updateBWUC.execute(params),
    [logBWUC, getHistoryUC, updateBWUC, deleteBWUC]
  );

  const deleteBodyWeight = useCallback(
    (bodyWeightId: string) =>
      deleteBWUC.execute(bodyWeightId),
    [logBWUC, getHistoryUC, updateBWUC, deleteBWUC]
  );

  return useMemo(() => ({
    logBodyWeight,
    getBodyWeightHistory,
    updateBodyWeight,
    deleteBodyWeight,
  }), [logBodyWeight, getBodyWeightHistory, updateBodyWeight, deleteBodyWeight]);
}
