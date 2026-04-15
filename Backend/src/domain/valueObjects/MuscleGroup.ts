export const MUSCLE_GROUPS = [
  // General Categories (Backward Compatibility)
  'chest',
  'back',
  'shoulders',
  'biceps',
  'triceps',
  'forearms',
  'quadriceps',
  'hamstrings',
  'glutes',
  'calves',
  'abs',
  'traps',
  'adductors',

  // Granular Sub-divisions
  'upper-chest',
  'mid-chest',
  'lower-chest',
  'lats',
  'upper-back',
  'mid-back',
  'lower-back',
  'front-delts',
  'side-delts',
  'rear-delts',
  'upper-abs',
  'lower-abs',
  'obliques',
] as const;

export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];

/**
 * Type guard to check if a string is a valid MuscleGroup.
 */
export function isMuscleGroup(value: string): value is MuscleGroup {
  return MUSCLE_GROUPS.includes(value as MuscleGroup);
}
