import { useCallback, useMemo } from 'react';
import { useContainer } from './useContainer';

export function useStats() {
  const { getWeeklyStats: getWeeklyStatsUseCase, getMuscleBalance: getMuscleBalanceUseCase, getTrainingFrequency: getTrainingFrequencyUseCase } = useContainer();

  const getWeeklyStats = useCallback(
    (startDate: string, endDate: string) => getWeeklyStatsUseCase.execute(startDate, endDate),
    [getWeeklyStatsUseCase],
  );

  const getMuscleBalance = useCallback(
    (startDate: string, endDate: string) => getMuscleBalanceUseCase.execute(startDate, endDate),
    [getMuscleBalanceUseCase],
  );

  const getTrainingFrequency = useCallback(
    (startDate: string, endDate: string) => getTrainingFrequencyUseCase.execute(startDate, endDate),
    [getTrainingFrequencyUseCase],
  );

  return useMemo(() => ({
    getWeeklyStats,
    getMuscleBalance,
    getTrainingFrequency,
  }), [getWeeklyStats, getMuscleBalance, getTrainingFrequency]);
}
