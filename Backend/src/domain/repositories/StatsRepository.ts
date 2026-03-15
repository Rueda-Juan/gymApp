import type { ExerciseStats } from '../entities/ExerciseStats';
import type { DailyStats } from '../entities/DailyStats';
import type { PersonalRecord } from '../entities/PersonalRecord';

/**
 * Repository interface for statistics data access.
 * Implemented by SQLiteStatsRepository in infrastructure.
 */
export interface StatsRepository {
  // Exercise stats
  getExerciseStats(exerciseId: string): Promise<ExerciseStats | null>;
  updateExerciseStats(stats: ExerciseStats): Promise<void>;

  // Daily stats
  getDailyStats(date: string): Promise<DailyStats | null>;
  getDailyStatsRange(startDate: string, endDate: string): Promise<DailyStats[]>;
  upsertDailyStats(stats: DailyStats): Promise<void>;

  // Personal records
  getPersonalRecords(exerciseId: string): Promise<PersonalRecord[]>;
  getLatestRecord(exerciseId: string, recordType: string): Promise<PersonalRecord | null>;
  savePersonalRecord(record: PersonalRecord): Promise<void>;
}
