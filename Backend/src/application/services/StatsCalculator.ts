import type { WorkoutSet } from '../../domain/entities/WorkoutSet';
import type { ExerciseStats } from '../../domain/entities/ExerciseStats';

/**
 * StatsCalculator — pure functions for computing training statistics.
 * Used by use cases to update precomputed stats tables.
 */

/**
 * Estimates 1RM using the Epley formula: weight × (1 + reps / 30).
 * Returns 0 if weight or reps is 0.
 */
export function calculateEstimated1RM(weight: number, reps: number): number {
  if (weight <= 0 || reps <= 0) return 0;
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30) * 100) / 100;
}

/**
 * Calculates volume for a single set: weight × reps.
 */
export function calculateSetVolume(weight: number, reps: number): number {
  return weight * reps;
}

/**
 * Computes updated ExerciseStats after recording a new completed set.
 * Merges the new set data into the existing stats.
 */
export function computeUpdatedExerciseStats(
  current: ExerciseStats | null,
  exerciseId: string,
  set: WorkoutSet,
): ExerciseStats {
  const setVolume = calculateSetVolume(set.weight, set.reps);
  const estimated1RM = calculateEstimated1RM(set.weight, set.reps);

  if (!current) {
    return {
      exerciseId,
      maxWeight: set.weight,
      maxVolume: setVolume,
      estimated1RM,
      totalSets: 1,
      totalReps: set.reps,
      totalVolume: setVolume,
      lastPerformed: set.createdAt,
      updatedAt: new Date(),
    };
  }

  return {
    exerciseId,
    maxWeight: Math.max(current.maxWeight, set.weight),
    maxVolume: Math.max(current.maxVolume, setVolume),
    estimated1RM: Math.max(current.estimated1RM, estimated1RM),
    totalSets: current.totalSets + 1,
    totalReps: current.totalReps + set.reps,
    totalVolume: current.totalVolume + setVolume,
    lastPerformed: set.createdAt,
    updatedAt: new Date(),
  };
}

/**
 * Checks which personal record types (if any) are broken by a new set.
 * Returns an array of record types that were beaten.
 */
export function detectBrokenRecords(
  currentStats: ExerciseStats | null,
  set: WorkoutSet,
): Array<{ recordType: 'max_weight' | 'max_reps' | 'max_volume' | 'estimated_1rm'; value: number }> {
  const broken: Array<{ recordType: 'max_weight' | 'max_reps' | 'max_volume' | 'estimated_1rm'; value: number }> = [];
  const setVolume = calculateSetVolume(set.weight, set.reps);
  const estimated1RM = calculateEstimated1RM(set.weight, set.reps);

  const prevMaxWeight = currentStats?.maxWeight ?? 0;
  const prevMaxVolume = currentStats?.maxVolume ?? 0;
  const prev1RM = currentStats?.estimated1RM ?? 0;

  if (set.weight > prevMaxWeight) {
    broken.push({ recordType: 'max_weight', value: set.weight });
  }
  if (setVolume > prevMaxVolume) {
    broken.push({ recordType: 'max_volume', value: setVolume });
  }
  if (estimated1RM > prev1RM) {
    broken.push({ recordType: 'estimated_1rm', value: estimated1RM });
  }

  return broken;
}
