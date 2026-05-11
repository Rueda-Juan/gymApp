interface MinimalSet {
  weight: number | string | null;
  reps: number | string | null;
  isCompleted?: boolean | null;
  completed?: boolean | null;
}

interface MinimalExercise {
  sets: MinimalSet[];
}

interface VolumeOptions {
  /** When true, only counts sets that pass the completion check. Default: false */
  completedOnly?: boolean;
  /**
   * Fallback value when completion fields are undefined.
   * - true  → treat unknown-completion sets as done (e.g. finished workouts in summary)
   * - false → treat unknown-completion sets as skipped (e.g. aggregate stats)
   * Default: true
   */
  defaultCompleted?: boolean;
}

/**
 * Sums weight × reps across all exercises.
 * Use `completedOnly` to restrict to completed sets only.
 */
export function calculateExercisesVolume(
  exercises: MinimalExercise[],
  { completedOnly = false, defaultCompleted = true }: VolumeOptions = {},
): number {
  return exercises.reduce((total, exercise) => {
    const exerciseVolume = exercise.sets.reduce((setTotal, set) => {
      const isIncluded = !completedOnly || (set.isCompleted ?? set.completed ?? defaultCompleted);
      if (!isIncluded) return setTotal;
      return setTotal + (Number(set.weight) || 0) * (Number(set.reps) || 0);
    }, 0);
    return total + exerciseVolume;
  }, 0);
}

/** Returns total training duration in seconds across an array of workouts. */
export function sumWorkoutDurationSeconds(workouts: { durationSeconds?: number }[]): number {
  return workouts.reduce((total, w) => total + (w.durationSeconds ?? 0), 0);
}

const EPLEY_DIVISOR = 30;

/**
 * Estimates 1-rep max using the Epley formula: weight × (1 + reps / 30).
 * Returns 0 when inputs are non-positive.
 */
export function calculateEpley1RM(weight: number, reps: number): number {
  if (reps <= 0 || weight <= 0) return 0;
  return Number((weight * (1 + reps / EPLEY_DIVISOR)).toFixed(1));
}

/**
 * Finds the exercise with the highest total volume across its sets.
 */
export function findMaxVolumeExercise<T extends MinimalExercise>(
  exercises: T[]
): { exercise: T; volume: number } | null {
  if (!exercises?.length) return null;
  return exercises.reduce<{ exercise: T; volume: number }>(
    (max, ex) => {
      const vol = ex.sets?.reduce((acc, set) => acc + (Number(set.weight) || 0) * (Number(set.reps) || 0), 0) ?? 0;
      return vol > max.volume ? { exercise: ex, volume: vol } : max;
    },
    { exercise: exercises[0], volume: 0 },
  );
}

