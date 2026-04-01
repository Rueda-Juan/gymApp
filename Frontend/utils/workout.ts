interface MinimalSet {
  weight: number | string;
  reps: number | string;
  isCompleted?: boolean;
}

interface MinimalExercise {
  sets: MinimalSet[];
}

interface VolumeOptions {
  /** When true, only counts sets that pass the completion check. Default: false */
  completedOnly?: boolean;
  /**
   * Fallback value when `isCompleted` is undefined.
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
      const isIncluded = !completedOnly || (set.isCompleted ?? defaultCompleted);
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
