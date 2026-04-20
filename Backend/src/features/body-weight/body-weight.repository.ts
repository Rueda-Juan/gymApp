import type { BodyWeight } from './body-weight.entity';

export interface BodyWeightRepository {
  /** Gets the most recent body weight log */
  getLatest(): Promise<BodyWeight | null>;

  /** Gets a single entry by its ID */
  getById(id: string): Promise<BodyWeight | null>;
  
  /** Gets weight logs within a date range */
  getByDateRange(startDate: string, endDate: string): Promise<BodyWeight[]>;
  
  /** Saves a body weight entry (creates or updates) */
  save(entry: BodyWeight): Promise<void>;
  
  /** Deletes an entry by ID */
  delete(id: string): Promise<void>;
}
