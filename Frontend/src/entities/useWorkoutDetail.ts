import { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { useWorkout } from '@/hooks/domain/useWorkout';
import type { WorkoutDTO } from '@shared';

// Re-export for backward compatibility with existing consumers
export { useWorkoutStats } from './useWorkoutStats';

interface WorkoutDetailState {
  workout: WorkoutDTO | null;
  loading: boolean;
  loadError: boolean;
}

export function useWorkoutDetail(id: string | undefined): WorkoutDetailState {
  const workoutService = useWorkout();

  const [workout, setWorkout] = useState<WorkoutDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const load = async () => {
      try {
        const data = await workoutService.getWorkoutById(id);
        if (!cancelled) setWorkout(data);
      } catch (error) {
        console.error('[useWorkoutDetail] failed to load workout:', error);
        if (!cancelled) {
          Toast.show({ type: 'error', text1: 'Error al cargar entrenamiento', position: 'top' });
          setLoadError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [id, workoutService]);

  return { workout, loading, loadError };
}
