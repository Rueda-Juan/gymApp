import { getExerciseName } from '@/shared/lib/exercise';
import type { RoutineExerciseWithExercise } from '@kernel';

/**
 * Parses a rep range string like "8-12" or "10" into { min, max }.
 */
export function parseRepRange(reps: string | number): { min: number; max: number } {
  const str = String(reps).trim();
  const parts = str.split('-');

  if (parts.length === 2 && !isNaN(Number(parts[0])) && !isNaN(Number(parts[1]))) {
    return {
      min: Number(parts[0].trim()),
      max: Number(parts[1].trim()),
    };
  }

  const value = parseInt(str) || 0;
  return { min: value, max: value };
}

/**
 * Estimates workout duration in minutes
 */
export function calculateEstimatedDurationMinutes(
  exercises: { sets: number }[],
  restTimerSeconds: number,
): number {
  const totalSets = exercises.reduce((acc, ex) => acc + ex.sets, 0);
  return Math.round(totalSets * (1 + restTimerSeconds / 60));
}

// ---------------------------
// TYPES
// ---------------------------
interface StoreExercise {
  id: string;
  sets: number;
  reps: string;
  supersetGroup?: number | null;
}

interface RoutineExerciseInput {
  id: string;
  exerciseId: string;
  order: number;
  targetSets: number;
  minReps: number;
  maxReps: number;
  restSeconds: number | null;
  supersetGroup: number | null;
}

// ---------------------------
// MAPPER (FIX PRINCIPAL)
// ---------------------------
export function mapStoreExercisesToRoutine(
  exercises: StoreExercise[],
  idFactory: () => string = () => crypto.randomUUID(),
): RoutineExerciseInput[] {
  return exercises.map((e, index) => {
    const { min, max } = e.reps
      ? parseRepRange(e.reps)
      : { min: 10, max: 10 };

    return {
      id: idFactory(),
      exerciseId: e.id,
      order: index,
      targetSets: e.sets,
      minReps: min,
      maxReps: max,
      restSeconds: null,
      supersetGroup: e.supersetGroup ?? null,
    };
  });
}

// ---------------------------
// FORMAT NAMES
// ---------------------------
export function formatRoutineExerciseNames(
  exercises: RoutineExerciseWithExercise[]
): string {
  const segments: string[] = [];
  let i = 0;

  while (i < exercises.length) {
    const ex = exercises[i];
    const exercise = ex.exercise;
    const name = exercise?.name || ex.exerciseId;
    const nameEs = exercise?.nameEs;
    const formattedName = getExerciseName({ name, nameEs });

    if (ex.supersetGroup != null) {
      const groupNames = [formattedName];
      let j = i + 1;

      while (
        j < exercises.length &&
        exercises[j].supersetGroup === ex.supersetGroup
      ) {
        const nextEx = exercises[j];
        const nextExercise = nextEx.exercise;
        const n = nextExercise?.name || nextEx.exerciseId;
        const ne = nextExercise?.nameEs;
        groupNames.push(getExerciseName({ name: n, nameEs: ne }));
        j++;
      }

      segments.push(groupNames.filter(Boolean).join(' + '));
      i = j;
    } else {
      if (formattedName) segments.push(formattedName);
      i++;
    }
  }

  return segments.join(', ');
}
