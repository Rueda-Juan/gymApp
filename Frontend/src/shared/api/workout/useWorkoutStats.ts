import { useMemo } from 'react';
import type { WorkoutSet } from '@kernel';

function calculateVolume(workout: WorkoutSet): number {
  return (workout as any).exercises.reduce((total: any, ex: any) => {
    const exerciseVolume = ex.sets
      .filter((set: any) => set.completed)
      .reduce((sum: any, set: any) => sum + set.weight * set.reps, 0);
    return total + exerciseVolume;
  }, 0);
}

export function useWorkoutStats(workout: WorkoutSet | null) {
  const totalVolume = useMemo(() => {
    if (!workout) return 0;
    return calculateVolume(workout);
  }, [workout]);

  const totalSets = useMemo(() => {
    if (!workout) return 0;
    return (workout as any).exercises.reduce((acc: any, ex: any) => acc + ex.sets.length, 0);
  }, [workout]);

  const formattedDate = useMemo(() => {
    if (!(workout as any)?.date) return '—';
    try {
      return new Intl.DateTimeFormat('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date((workout as any).date));
    } catch {
      return '—';
    }
  }, [(workout as any)?.date]);

  const formattedDuration = useMemo(() => {
    if (!workout) return '—';
    const minutes = Math.round(((workout as any).durationSeconds ?? 0) / 60);
    return `${minutes} min`;
  }, [workout]);

  return { totalVolume, totalSets, formattedDate, formattedDuration };
}
