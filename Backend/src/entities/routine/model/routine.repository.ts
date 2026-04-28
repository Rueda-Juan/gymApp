import type { Routine } from './routine.entity';

/**
 * Repository interface for Routine data access.
 * Implemented by SQLiteRoutineRepository in infrastructure.
 */
export interface RoutineRepository {
  getAll(): Promise<Routine[]>;
  getById(id: string): Promise<Routine | null>;
  save(routine: Routine): Promise<void>;
  delete(id: string): Promise<void>;
}
