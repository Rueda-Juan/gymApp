import type { RoutineExercise as RoutineExercisePayload, Routine } from 'backend/shared/types';
import { getExerciseName } from '@/utils/exercise';

/**
 * Parses a rep range string like "8-12" or "10" into { min, max }.
 * Returns { min: 0, max: 0 } for unrecognised input.
 */
export function parseRepRange(reps: string | number): { min: number; max: number } {
  const str = String(reps).trim();
  const parts = str.split('-');

  if (parts.length === 2 && !isNaN(Number(parts[0])) && !isNaN(Number(parts[1]))) {
    return { min: Number(parts[0].trim()), max: Number(parts[1].trim()) };
  }

  const value = parseInt(str) || 0;
  return { min: value, max: value };
}

/**
 * Estimates workout duration in minutes given the exercises and rest time between sets.
 * Formula: totalSets × (1 + restTimerSeconds / 60)
 */
export function calculateEstimatedDurationMinutes(
  exercises: { sets: number }[],
  restTimerSeconds: number,
): number {
  const totalSets = exercises.reduce((acc, ex) => acc + ex.sets, 0);
  return Math.round(totalSets * (1 + restTimerSeconds / 60));
}

interface StoreExercise {
  id: string;
  sets: number;
  reps: string;
  supersetGroup?: number | null;
}

export function mapStoreExercisesToPayload(
  exercises: StoreExercise[],
  idFactory: () => string = () => '',
): RoutineExercisePayload[] {
  return exercises.map((e, index) => {
    const { min: minReps, max: maxReps } = e.reps ? parseRepRange(e.reps) : { min: 10, max: 10 };
    return {
      id: idFactory(),
      exerciseId: e.id,
      orderIndex: index,
      targetSets: e.sets,
      minReps,
      maxReps,
      restSeconds: null,
      supersetGroup: e.supersetGroup ?? null,
    };
  });
}

export function formatRoutineExerciseNames(exercises: Routine['exercises']): string {
  const segments: string[] = [];
  let i = 0;
  while (i < exercises.length) {
    const ex = exercises[i];
    const name = ex.exercise ? getExerciseName(ex.exercise) : '';
    if (ex.supersetGroup != null) {
      const groupNames = [name];
      let j = i + 1;
      while (j < exercises.length && exercises[j].supersetGroup === ex.supersetGroup) {
        groupNames.push(exercises[j].exercise ? getExerciseName(exercises[j].exercise!) : '');
        j++;
      }
      segments.push(groupNames.filter(Boolean).join(' + '));
      i = j;
    } else {
      if (name) segments.push(name);
      i++;
    }
  }
  return segments.join(', ');
}
