import type { ExerciseStats } from '../entities/ExerciseStats';
import type * as SQLite from 'expo-sqlite';
import type { DailyStats } from '../entities/DailyStats';
import type { PersonalRecord, RecordType } from '../entities/PersonalRecord';

/**
 * Repository interface for statistics data access.
 * Implemented by SQLiteStatsRepository in infrastructure.
 */
export interface StatsRepository {
  // Exercise stats
  getExerciseStats(exerciseId: string): Promise<ExerciseStats | null>;
  /** Deletes stats for an exercise */
  deleteExerciseStats(exerciseId: string): Promise<void>;

  /** Recalculates stats for an exercise from scratch (useful after deletions/edits) */
  recalculateExerciseStats(exerciseId: string, transactionDb?: SQLite.SQLiteDatabase): Promise<ExerciseStats | null>;
  updateExerciseStats(stats: ExerciseStats): Promise<void>;

  // Daily stats
  getDailyStats(date: string): Promise<DailyStats | null>;
  getDailyStatsRange(startDate: string, endDate: string): Promise<DailyStats[]>;
  /** Gets daily stats within a date range weekly/monthly */
  getWeeklyStats(startDate: string, endDate: string): Promise<DailyStats[]>;

  /** Deletes daily stats for a specific date */
  deleteDailyStats(date: string): Promise<void>;

  /** Recalculates daily stats from scratch */
  recalculateDailyStats(date: string, transactionDb?: SQLite.SQLiteDatabase): Promise<DailyStats | null>;
  upsertDailyStats(stats: DailyStats): Promise<void>;

  // Personal records
  getPersonalRecords(exerciseId: string): Promise<PersonalRecord[]>;
  getLatestRecord(exerciseId: string, recordType: RecordType): Promise<PersonalRecord | null>;
  /** Saves a new personal record */
  savePersonalRecord(record: PersonalRecord): Promise<void>;
  /** Counts PRs logged on or after the given ISO date string */
  countRecordsSince(since: string): Promise<number>;

  // Muscle Balance
  /** Gets volume distribution by muscle group in a date range */
  getMuscleVolumeDistribution(startDate: string, endDate: string): Promise<{ muscle: string; volume: number; sets: number }[]>;
}
