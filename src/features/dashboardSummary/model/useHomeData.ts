import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import Toast from 'react-native-toast-message';
import { Workout, RoutineWithLastPerformed, WorkoutWithExercises, RoutineExerciseWithExercise, RoutineWithExercises } from '@kernel';
import { useWorkoutDb } from '@/entities/workout';
import { useRoutineDb } from '@/entities/routine';
import { calculateWeeklyStreak } from '@/entities/stats';
import { getExerciseName } from '@/entities/exercise';

const HISTORY_DAYS_WINDOW = 30;
const RECENT_HISTORY_LIMIT = 5;
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;


interface HomeStats {
  streak: number;
  weeklyCount: number;
}

interface HomeData {
  history: WorkoutWithExercises[];
  routines: RoutineWithLastPerformed[];
  stats: HomeStats;
}

const INITIAL_DATA: HomeData = {
  history: [],
  routines: [],
  stats: { streak: 0, weeklyCount: 0 },
};





function attachLastPerformed(routine: RoutineWithExercises, history: WorkoutWithExercises[]): RoutineWithLastPerformed {
  const routineHistory = history.filter(w => w.routineId === routine.id);
  
  const exercises = (routine.routineExercises || []) as RoutineExerciseWithExercise[];
  const routineMuscles = Array.from(new Set(
    exercises
      .map((re: RoutineExerciseWithExercise) => re.exercise?.primaryMuscle)
      .filter(Boolean)
  )) as string[];

  let lastPerformed: string | null = null;
  if (routineHistory.length > 0) {
    const latest = routineHistory.reduce((a, b) =>
      new Date(a.date) > new Date(b.date) ? a : b,
    );
    lastPerformed = formatDistanceToNow(new Date(latest.date), { addSuffix: true, locale: es });
  }

  const result: RoutineWithLastPerformed = {
    ...routine,
    exercises,
    muscles: routineMuscles,
    lastPerformed,
  };
  return result;
}

function countWorkoutsThisWeek(history: Workout[]): number {
  const oneWeekAgo = new Date(Date.now() - ONE_WEEK_MS);
  return history.filter(w => new Date(w.date) > oneWeekAgo).length;
}

export function formatRoutineExercises(routine: RoutineWithLastPerformed): string {
  return (routine.exercises || [])
    .map((re) => {
      const name = re.exercise?.name || re.exerciseId;
      const nameEs = re.exercise?.nameEs;
      return getExerciseName({ name, nameEs });
    })
    .filter(Boolean)
    .join(' · ');
}

export function useHomeData() {
  const workoutService = useWorkoutDb();
  const routineService = useRoutineDb();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<HomeData>(INITIAL_DATA);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const history = await workoutService.getHistory(HISTORY_DAYS_WINDOW) as WorkoutWithExercises[];
      const routines = await routineService.getRoutines();

      const routinesWithLastPerformed: RoutineWithLastPerformed[] = routines.map((r) => attachLastPerformed(r, history));

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

