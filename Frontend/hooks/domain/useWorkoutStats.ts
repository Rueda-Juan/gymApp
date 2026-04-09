import { useMemo } from 'react';
import type { Workout } from 'backend/domain/entities/Workout';

function calculateVolume(workout: Workout): number {
  return workout.exercises.reduce((total, ex) => {
    const exerciseVolume = ex.sets
      .filter(set => set.completed)
      .reduce((sum, set) => sum + set.weight * set.reps, 0);
    return total + exerciseVolume;
  }, 0);
}

export function useWorkoutStats(workout: Workout | null) {
  const totalVolume = useMemo(() => {
    if (!workout) return 0;
    return calculateVolume(workout);
  }, [workout]);

  const totalSets = useMemo(() => {
    if (!workout) return 0;
    return workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  }, [workout]);

  const formattedDate = useMemo(() => {
    if (!workout?.date) return '—';
    try {
      return new Intl.DateTimeFormat('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(workout.date));
    } catch {
      return '—';
    }
  }, [workout?.date]);

  const formattedDuration = useMemo(() => {
    if (!workout) return '—';
    const minutes = Math.round(workout.durationSeconds / 60);
    return `${minutes} min`;
  }, [workout]);

  return { totalVolume, totalSets, formattedDate, formattedDuration };
}
