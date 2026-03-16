import type { BodyWeightEntry } from '../entities/BodyWeightEntry';

export interface BodyWeightRepository {
  /** Gets the most recent body weight log */
  getLatest(): Promise<BodyWeightEntry | null>;
  
  /** Gets weight logs within a date range */
  getByDateRange(startDate: Date, endDate: Date): Promise<BodyWeightEntry[]>;
  
  /** Saves a body weight entry (creates or updates) */
  save(entry: BodyWeightEntry): Promise<void>;
  
  /** Deletes an entry by ID */
  delete(id: string): Promise<void>;
}
