/**
 * BodyWeightEntry entity — a single log of the user's body weight.
 * Maps to the `body_weight_log` table in SQLite.
 */
export interface BodyWeightEntry {
  readonly id: string;
  weight: number;
  date: Date;
  notes: string | null;
  createdAt: Date;
}
