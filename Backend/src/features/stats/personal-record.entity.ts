/**
 * PersonalRecord entity — tracks personal bests per exercise.
 * Maps to the `personal_records` table in SQLite.
 */
export interface PersonalRecord {
  readonly id: string;
  exerciseId: string;
  recordType: RecordType;
  value: number;
  setId: string | null;
  date: Date;
}

export const RECORD_TYPES = [
  'max_weight',
  'max_reps',
  'max_volume',
  'estimated_1rm',
] as const;

export type RecordType = (typeof RECORD_TYPES)[number];
