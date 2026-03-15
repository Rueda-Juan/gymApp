export const MUSCLE_GROUPS = [
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
] as const;

export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];

/**
 * Type guard to check if a string is a valid MuscleGroup.
 */
export function isMuscleGroup(value: string): value is MuscleGroup {
  return MUSCLE_GROUPS.includes(value as MuscleGroup);
}
