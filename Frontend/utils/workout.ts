// Migrated to features/workout/utils/workout.ts. This file is now empty.
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
