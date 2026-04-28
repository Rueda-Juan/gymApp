import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import Toast from 'react-native-toast-message';
import type { WorkoutDTO, Routine } from '@kernel';
import { useWorkout } from '@/entities/workout';
import { useRoutineApi } from '@/entities/routine';
import { calculateWeeklyStreak } from '@/entities/stats';
import { getExerciseName } from '@/entities/exercise';

const HISTORY_DAYS_WINDOW = 30;
const RECENT_HISTORY_LIMIT = 5;
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export interface RoutineWithLastPerformed extends Routine {
  lastPerformed?: string;
  exercises: any[];
}


interface HomeStats {
  streak: number;
  weeklyCount: number;
}

interface HomeData {
  history: WorkoutDTO[];
  routines: RoutineWithLastPerformed[];
  stats: HomeStats;
}

const INITIAL_DATA: HomeData = {
  history: [],
  routines: [],
  stats: { streak: 0, weeklyCount: 0 },
};

import type { MuscleGroup } from '@kernel';

function toMuscleGroupArray(muscles?: string[]): MuscleGroup[] | undefined {
  if (!muscles) return undefined;
  return muscles.filter((m): m is MuscleGroup =>
    [
      'chest', 'upper-chest', 'mid-chest', 'lower-chest',
      'back', 'lats', 'upper-back', 'mid-back', 'lower-back',
      'shoulders', 'front-delts', 'side-delts', 'rear-delts',
      'biceps', 'triceps', 'forearms',
      'legs', 'quads', 'hamstrings', 'glutes', 'calves',
      'abs', 'core', 'traps',
    ].includes(m)
  ) as MuscleGroup[];
}

function attachLastPerformed(routine: Routine, history: WorkoutDTO[]): RoutineWithLastPerformed {
  const routineHistory = history.filter(w => w.routineId === routine.id);
  const base: Omit<RoutineWithLastPerformed, 'lastPerformed'> = {
    ...routine,
    muscles: toMuscleGroupArray(routine.muscles),
    exercises: routine.exercises,
  };
  if (!routineHistory.length) return { ...base, lastPerformed: undefined };

  const latest = routineHistory.reduce((a, b) =>
    new Date(a.date) > new Date(b.date) ? a : b,
  );

  return {
    ...base,
    lastPerformed: formatDistanceToNow(new Date(latest.date), { addSuffix: true, locale: es }),
  };
}

function countWorkoutsThisWeek(history: WorkoutDTO[]): number {
  const oneWeekAgo = new Date(Date.now() - ONE_WEEK_MS);
  return history.filter(w => new Date(w.date) > oneWeekAgo).length;
}

export function formatRoutineExercises(routine: RoutineWithLastPerformed): string {
  return routine.exercises
    .map((re: any) => getExerciseName({ name: re.exerciseId }))
    .filter(Boolean)
    .join(' · ');
}

export function useHomeData() {
  const workoutService = useWorkout();
  const routineService = useRoutineApi();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<HomeData>(INITIAL_DATA);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const history = await workoutService.getHistory(HISTORY_DAYS_WINDOW);
      const routines = await routineService.getRoutines();

      const routinesWithLastPerformed = routines.map((r: any) => attachLastPerformed(r, history));

      setData({
        history: history.slice(0, RECENT_HISTORY_LIMIT),
        routines: routinesWithLastPerformed,
        stats: {
          streak: calculateWeeklyStreak(history),
          weeklyCount: countWorkoutsThisWeek(history),
        },
      });
    } catch (error) {
      console.error('[Home] Failed to load data:', error);
      Toast.show({ type: 'error', text1: 'Error al cargar datos', position: 'top' });
    } finally {
      setLoading(false);
    }
  }, [workoutService, routineService]);

  useFocusEffect(
    useCallback(() => {
      void loadData();
    }, [loadData]),
  );

  const lastWorkout = data.history[0] ?? null;

  return { loading, data, lastWorkout };
}
