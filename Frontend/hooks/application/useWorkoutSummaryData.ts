import { useState, useEffect } from 'react';
import { useWorkout } from '@/hooks/domain/useWorkout';
import Toast from 'react-native-toast-message';

const PREVIOUS_HISTORY_LIMIT = 200;

export interface SummarySet {
  id: string;
  weight: number;
  reps: number;
  isCompleted?: boolean;
}

export interface SummaryExercise {
  id: string;
  exerciseId: string;
  name?: string;
  nameEs?: string | null;
  supersetGroup?: number | null;
  sets: SummarySet[];
}

export interface SummaryWorkout {
  id: string;
  routineId: string | null;
  date: string | Date;
  durationSeconds: number;
  exercises: SummaryExercise[];
}

export interface SummaryPersonalRecord {
  exerciseId: string;
  recordType: string;
  value: number;
}

export function useWorkoutSummaryData(workoutId: string | undefined) {
  const workoutService = useWorkout();
  const [workout, setWorkout] = useState<SummaryWorkout | null>(null);
  const [previousWorkout, setPreviousWorkout] = useState<SummaryWorkout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workoutId) { setLoading(false); return; }

    const loadAll = async () => {
      try {
        const result = await workoutService.getWorkoutById(workoutId);
        const currentWorkout = result as SummaryWorkout | null;
        setWorkout(currentWorkout);

        if (currentWorkout?.date) {
          const history = await workoutService.getHistory(PREVIOUS_HISTORY_LIMIT);
          const currentWorkoutTime = new Date(currentWorkout.date).getTime();
          const previous = (history as SummaryWorkout[])
            .filter(entry => entry.id !== currentWorkout.id)
            .filter(entry => new Date(entry.date).getTime() < currentWorkoutTime)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] ?? null;
          setPreviousWorkout(previous);
        }
      } catch (error) {
        console.error('[useWorkoutSummaryData] failed to load workout:', error);
        Toast.show({ type: 'error', text1: 'Error al cargar resumen', position: 'top' });
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, [workoutId, workoutService]);

  return { workout, previousWorkout, loading };
}
