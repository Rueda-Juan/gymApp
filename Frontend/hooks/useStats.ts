import { useCallback, useMemo } from 'react';
import { useDI } from '../context/DIContext';

export function useStats() {
  const {
    getWeeklyStats: getWeeklyUC,
    getMuscleBalance: getMuscleUC,
    getTrainingFrequency: getFreqUC,
  } = useDI();

  const getWeeklyStats = useCallback(
    (startDate: string, endDate: string) => getWeeklyUC.execute(startDate, endDate),
    [getWeeklyUC, getMuscleUC, getFreqUC]
  );

  const getMuscleBalance = useCallback(
    (startDate: string, endDate: string) => getMuscleUC.execute(startDate, endDate),
    [getWeeklyUC, getMuscleUC, getFreqUC]
  );

  const getTrainingFrequency = useCallback(
    (startDate: string, endDate: string) => getFreqUC.execute(startDate, endDate),
    [getWeeklyUC, getMuscleUC, getFreqUC]
  );

  return useMemo(() => ({
    getWeeklyStats,
    getMuscleBalance,
    getTrainingFrequency,
  }), [getWeeklyStats, getMuscleBalance, getTrainingFrequency]);
}