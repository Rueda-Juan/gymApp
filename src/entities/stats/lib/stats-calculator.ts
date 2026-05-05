import type { ExerciseStats, DailyStats } from '@/shared/types/kernel';

/**
 * Estimates 1RM using the Epley formula: weight × (1 + reps / 30).
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
 * Maps to the actual DB schema (snake_case, nullable columns).
 */
export function computeUpdatedExerciseStats(
  current: ExerciseStats | null,
  exerciseId: string,
  set: { weight: number; reps: number; createdAt: Date | string }
): ExerciseStats {
  const weight = set.weight || 0;
  const reps = set.reps || 0;
  const setVolume = calculateSetVolume(weight, reps);
  const estimated1rm = calculateEstimated1RM(weight, reps);
  const createdAt = typeof set.createdAt === 'string'
    ? set.createdAt
    : set.createdAt.toISOString();

  if (!current) {
    return {
      exerciseId,
      maxWeight: weight,
      maxVolume: setVolume,
      estimated1rm,
      totalSets: 1,
      totalReps: reps,
      totalVolume: setVolume,
      lastPerformed: createdAt,
      updatedAt: new Date().toISOString(),
    };
  }

  return {
    exerciseId,
    maxWeight: Math.max(current.maxWeight ?? 0, weight),
    maxVolume: Math.max(current.maxVolume ?? 0, setVolume),
    estimated1rm: Math.max(current.estimated1rm ?? 0, estimated1rm),
    totalSets: (current.totalSets ?? 0) + 1,
    totalReps: (current.totalReps ?? 0) + reps,
    totalVolume: (current.totalVolume ?? 0) + setVolume,
    lastPerformed: createdAt,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Checks which personal record types are broken by a new set.
 */
export function detectBrokenRecords(
  currentStats: ExerciseStats | null,
  set: { weight: number; reps: number }
): Array<{ recordType: 'max_weight' | 'max_reps' | 'max_volume' | 'estimated_1rm'; value: number }> {
  const broken: Array<{ recordType: 'max_weight' | 'max_reps' | 'max_volume' | 'estimated_1rm'; value: number }> = [];
  const weight = set.weight || 0;
  const reps = set.reps || 0;
  const setVolume = calculateSetVolume(weight, reps);
  const estimated1rm = calculateEstimated1RM(weight, reps);

  const prevMaxWeight = currentStats?.maxWeight ?? 0;
  const prevMaxVolume = currentStats?.maxVolume ?? 0;
  const prev1RM = currentStats?.estimated1rm ?? 0;

  if (weight > prevMaxWeight) {
    broken.push({ recordType: 'max_weight', value: weight });
  }
  if (setVolume > prevMaxVolume) {
    broken.push({ recordType: 'max_volume', value: setVolume });
  }
  if (estimated1rm > prev1RM) {
    broken.push({ recordType: 'estimated_1rm', value: estimated1rm });
  }

  return broken;
}

/**
 * Computes updated DailyStats after recording a new completed set.
 */
export function computeUpdatedDailyStats(
  current: DailyStats | null,
  date: string,
  set: { weight: number; reps: number }
): DailyStats {
  const setVolume = calculateSetVolume(set.weight || 0, set.reps || 0);

  if (!current) {
    return {
      date,
      totalVolume: setVolume,
      totalSets: 1,
      totalReps: set.reps || 0,
      workoutCount: 1,
      totalDuration: 0,
    };
  }

  return {
    ...current,
    totalVolume: (current.totalVolume ?? 0) + setVolume,
    totalSets: (current.totalSets ?? 0) + 1,
    totalReps: (current.totalReps ?? 0) + (set.reps || 0),
  };
}
