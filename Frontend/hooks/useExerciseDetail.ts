import { useState, useEffect, useCallback, useMemo } from 'react';
import Toast from 'react-native-toast-message';
import { useExercises } from '@/hooks/useExercises';
import type { Exercise } from 'backend/domain/entities/Exercise';
import type { WorkoutSet } from 'backend/domain/entities/WorkoutSet';

interface ExerciseDetailState {
  exercise: Exercise | null;
  history: WorkoutSet[];
  maxWeight: number;
  loading: boolean;
  loadError: boolean;
  reload: () => void;
}

export function useExerciseDetail(id: string | undefined): ExerciseDetailState {
  const exerciseService = useExercises();

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [history, setHistory] = useState<WorkoutSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      setLoadError(false);
      setLoading(true);
      const [exData, histData] = await Promise.all([
        exerciseService.getById(id),
        exerciseService.getExerciseHistory(id),
      ]);
      setExercise(exData);
      setHistory(histData);
    } catch (error) {
      console.error('[useExerciseDetail] failed to load exercise:', error);
      Toast.show({ type: 'error', text1: 'Error al cargar el ejercicio', position: 'top' });
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [id, exerciseService]);

  useEffect(() => {
    load();
  }, [load]);

  const maxWeight = useMemo(
    () => history.reduce((max, set) => (set.weight > max ? set.weight : max), 0),
    [history],
  );

  return { exercise, history, maxWeight, loading, loadError, reload: load };
}
