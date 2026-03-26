import { useCallback, useMemo } from 'react';
import { useContainer } from './useContainer';

/**
 * Hook that exposes all statistics-related operations.
 * Wraps StatsService from the DI container.
 */
export function useStats() {
  const { statsService } = useContainer();

  const getWeeklyStats = useCallback(
    (startDate: string, endDate: string) =>
      statsService.getWeeklyStats(startDate, endDate),
    [statsService],
  );

  const getMuscleBalance = useCallback(
    (startDate: string, endDate: string) =>
      statsService.getMuscleBalance(startDate, endDate),
    [statsService],
  );

  const getTrainingFrequency = useCallback(
    (startDate: string, endDate: string) =>
      statsService.getTrainingFrequency(startDate, endDate),
    [statsService],
  );

  return useMemo(() => ({
    getWeeklyStats,
    getMuscleBalance,
    getTrainingFrequency,
  }), [getWeeklyStats, getMuscleBalance, getTrainingFrequency]);
}
