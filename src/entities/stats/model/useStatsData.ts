import { useState, useCallback, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { subDays } from 'date-fns';
import Toast from 'react-native-toast-message';
import { useStatsDb, useBodyWeight, usePersonalRecords } from '@/entities/stats';
import { calculateExercisesVolume, useWorkoutDb } from '@/entities/workout';
import type { BodyWeight, Workout, DailyStats, WorkoutWithExercises } from '@/shared/types/kernel';

const RECENT_DAYS_WINDOW = 30;
const FULL_HISTORY_LIMIT = 365;
const SECONDS_PER_HOUR = 3600;

interface StatsSummaries {
  workouts: number;
  volume: number;
  time: number;
  prs: number;
}

// interface StatsOverview {
//   weeklyStats: DailyStats[];
//   frequency: TrainingFrequencyResult;
// }

interface StatsData {
  weeklyStats: DailyStats[];
  frequency: { daysTrained: number; totalWorkouts: number };
}

export function useStatsData() {
  const { getWeeklyStats, getTrainingFrequency } = useStatsDb();
  const { getBodyWeightHistory } = useBodyWeight();
  const { getHistory } = useWorkoutDb();
  const { countSince } = usePersonalRecords();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [weightHistory, setWeightHistory] = useState<BodyWeight[]>([]);
  const [summaries, setSummaries] = useState<StatsSummaries>({ workouts: 0, volume: 0, time: 0, prs: 0 });
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutWithExercises[]>([]);

  const trainedDates = useMemo(() => new Set(
    workoutHistory.map((w: WorkoutWithExercises) => {
      const d = new Date(w.date);
      return [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, '0'),
        String(d.getDate()).padStart(2, '0'),
      ].join('-');
    })
  ), [workoutHistory]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const now = new Date();
      const recentCutoff = subDays(now, RECENT_DAYS_WINDOW);

      const [weeklyStats, frequency, weightData, fullHistory, prCount] = await Promise.all([
        getWeeklyStats(recentCutoff.toISOString(), now.toISOString()),
        getTrainingFrequency(recentCutoff.toISOString(), now.toISOString()),
        getBodyWeightHistory(recentCutoff.toISOString(), now.toISOString()),
        getHistory(FULL_HISTORY_LIMIT) as Promise<WorkoutWithExercises[]>,
        countSince(recentCutoff.toISOString()),
      ]);

      const recentHistory = fullHistory.filter((w: WorkoutWithExercises) => new Date(w.date) >= recentCutoff);
      setWorkoutHistory(fullHistory);

        const totalVolume = recentHistory.reduce(
        (acc: number, w: WorkoutWithExercises) => {
          const exercises = w.workoutExercises ?? [];
          return acc + calculateExercisesVolume(exercises, { completedOnly: true, defaultCompleted: false });
        },
        0,
      );
      const totalTime = recentHistory.reduce((acc: number, w: Workout) => acc + (w.durationSeconds || 0), 0);

      setSummaries({
        workouts: recentHistory.length,
        volume: totalVolume,
        time: Math.round(totalTime / SECONDS_PER_HOUR),
        prs: prCount,
      });
      setWeightHistory(
        [...weightData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      );
      setStats({ weeklyStats, frequency });
    } catch (error) {
      console.error('[useStatsData] failed to load stats:', error);
      Toast.show({ type: 'error', text1: 'Error al cargar estadísticas', position: 'top' });
    } finally {
      setLoading(false);
    }
  }, [getWeeklyStats, getTrainingFrequency, getBodyWeightHistory, getHistory, countSince]);

  useFocusEffect(
    useCallback(() => {
      void loadData();
    }, [loadData])
  );

  return { loading, stats, weightHistory, summaries, workoutHistory, trainedDates };
}
