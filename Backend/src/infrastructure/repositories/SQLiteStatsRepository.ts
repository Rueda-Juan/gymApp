import type * as SQLite from 'expo-sqlite';
import type { ExerciseStats } from '../../domain/entities/ExerciseStats';
import type { DailyStats } from '../../domain/entities/DailyStats';
import type { PersonalRecord } from '../../domain/entities/PersonalRecord';
import type { RecordType } from '../../domain/entities/PersonalRecord';
import type { StatsRepository } from '../../domain/repositories/StatsRepository';
import { DatabaseError } from '../../shared/errors';
import { fromSQLiteDateTime, toSQLiteDateTime } from '../../shared/utils/dateUtils';

// --- Row types ---

interface ExerciseStatsRow {
  exercise_id: string;
  max_weight: number;
  max_volume: number;
  estimated_1rm: number;
  total_sets: number;
  total_reps: number;
  total_volume: number;
  last_performed: string | null;
  updated_at: string;
}

interface PersonalRecordRow {
  id: string;
  exercise_id: string;
  record_type: string;
  value: number;
  set_id: string | null;
  date: string;
}

interface DailyStatsRow {
  date: string;
  total_volume: number;
  total_sets: number;
  total_reps: number;
  workout_count: number;
  total_duration: number;
}

// --- Mappers ---

function mapStatsRow(row: ExerciseStatsRow): ExerciseStats {
  return {
    exerciseId: row.exercise_id,
    maxWeight: row.max_weight,
    maxVolume: row.max_volume,
    estimated1RM: row.estimated_1rm,
    totalSets: row.total_sets,
    totalReps: row.total_reps,
    totalVolume: row.total_volume,
    lastPerformed: row.last_performed ? fromSQLiteDateTime(row.last_performed) : null,
    updatedAt: fromSQLiteDateTime(row.updated_at),
  };
}

function mapRecordRow(row: PersonalRecordRow): PersonalRecord {
  return {
    id: row.id,
    exerciseId: row.exercise_id,
    recordType: row.record_type as RecordType,
    value: row.value,
    setId: row.set_id,
    date: fromSQLiteDateTime(row.date),
  };
}

function mapDailyStatsRow(row: DailyStatsRow): DailyStats {
  return {
    date: row.date,
    totalVolume: row.total_volume,
    totalSets: row.total_sets,
    totalReps: row.total_reps,
    workoutCount: row.workout_count,
    totalDuration: row.total_duration,
  };
}

// --- Repository ---

export class SQLiteStatsRepository implements StatsRepository {
  constructor(private readonly db: SQLite.SQLiteDatabase) {}

  // =========================================
  // Exercise Stats
  // =========================================

  async getExerciseStats(exerciseId: string): Promise<ExerciseStats | null> {
    try {
      const row = await this.db.getFirstAsync<ExerciseStatsRow>(
        'SELECT * FROM exercise_stats WHERE exercise_id = ?',
        [exerciseId],
      );
      return row ? mapStatsRow(row) : null;
    } catch (error) {
      throw new DatabaseError('Error al obtener estadísticas de ejercicio', error);
    }
  }

  async updateExerciseStats(stats: ExerciseStats): Promise<void> {
    try {
      await this.db.runAsync(
        `INSERT OR REPLACE INTO exercise_stats
         (exercise_id, max_weight, max_volume, estimated_1rm, total_sets, total_reps, total_volume, last_performed, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          stats.exerciseId,
          stats.maxWeight,
          stats.maxVolume,
          stats.estimated1RM,
          stats.totalSets,
          stats.totalReps,
          stats.totalVolume,
          stats.lastPerformed ? toSQLiteDateTime(stats.lastPerformed) : null,
          toSQLiteDateTime(stats.updatedAt),
        ],
      );
    } catch (error) {
      throw new DatabaseError('Error al actualizar estadísticas de ejercicio', error);
    }
  }

  // =========================================
  // Daily Stats
  // =========================================

  async getDailyStats(date: string): Promise<DailyStats | null> {
    try {
      const row = await this.db.getFirstAsync<DailyStatsRow>(
        'SELECT * FROM daily_stats WHERE date = ?',
        [date],
      );
      return row ? mapDailyStatsRow(row) : null;
    } catch (error) {
      throw new DatabaseError('Error al obtener estadísticas diarias', error);
    }
  }

  async getDailyStatsRange(startDate: string, endDate: string): Promise<DailyStats[]> {
    try {
      const rows = await this.db.getAllAsync<DailyStatsRow>(
        'SELECT * FROM daily_stats WHERE date BETWEEN ? AND ? ORDER BY date DESC',
        [startDate, endDate],
      );
      return rows.map(mapDailyStatsRow);
    } catch (error) {
      throw new DatabaseError('Error al obtener rango de estadísticas diarias', error);
    }
  }

  async upsertDailyStats(stats: DailyStats): Promise<void> {
    try {
      await this.db.runAsync(
        `INSERT INTO daily_stats (date, total_volume, total_sets, total_reps, workout_count, total_duration)
         VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT(date) DO UPDATE SET
           total_volume   = ?,
           total_sets     = ?,
           total_reps     = ?,
           workout_count  = ?,
           total_duration = ?`,
        [
          stats.date,
          stats.totalVolume,
          stats.totalSets,
          stats.totalReps,
          stats.workoutCount,
          stats.totalDuration,
          // ON CONFLICT values
          stats.totalVolume,
          stats.totalSets,
          stats.totalReps,
          stats.workoutCount,
          stats.totalDuration,
        ],
      );
    } catch (error) {
      throw new DatabaseError('Error al actualizar estadísticas diarias', error);
    }
  }

  // =========================================
  // Personal Records
  // =========================================

  async getPersonalRecords(exerciseId: string): Promise<PersonalRecord[]> {
    try {
      const rows = await this.db.getAllAsync<PersonalRecordRow>(
        'SELECT * FROM personal_records WHERE exercise_id = ? ORDER BY date DESC',
        [exerciseId],
      );
      return rows.map(mapRecordRow);
    } catch (error) {
      throw new DatabaseError('Error al obtener récords personales', error);
    }
  }

  async getLatestRecord(exerciseId: string, recordType: string): Promise<PersonalRecord | null> {
    try {
      const row = await this.db.getFirstAsync<PersonalRecordRow>(
        `SELECT * FROM personal_records
         WHERE exercise_id = ? AND record_type = ?
         ORDER BY value DESC LIMIT 1`,
        [exerciseId, recordType],
      );
      return row ? mapRecordRow(row) : null;
    } catch (error) {
      throw new DatabaseError('Error al obtener último récord', error);
    }
  }

  async savePersonalRecord(record: PersonalRecord): Promise<void> {
    try {
      await this.db.runAsync(
        `INSERT INTO personal_records (id, exercise_id, record_type, value, set_id, date)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          record.id,
          record.exerciseId,
          record.recordType,
          record.value,
          record.setId,
          toSQLiteDateTime(record.date),
        ],
      );
    } catch (error) {
      throw new DatabaseError('Error al guardar récord personal', error);
    }
  }
}
