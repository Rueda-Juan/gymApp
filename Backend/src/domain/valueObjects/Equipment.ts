export const EQUIPMENT = [
  'barbell',
  'dumbbell',
  'machine',
  'cable',
  'bodyweight',
  'band',
  'other',
] as const;

export type Equipment = (typeof EQUIPMENT)[number];

/**
 * Type guard to check if a string is a valid Equipment.
 */
export function isEquipment(value: string): value is Equipment {
  return EQUIPMENT.includes(value as Equipment);
}
