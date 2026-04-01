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
  max_reps: number;
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
    maxReps: row.max_reps ?? 0,
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
         (exercise_id, max_weight, max_volume, max_reps, estimated_1rm, total_sets, total_reps, total_volume, last_performed, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          stats.exerciseId,
          stats.maxWeight,
          stats.maxVolume,
          stats.maxReps,
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

  async deleteExerciseStats(exerciseId: string): Promise<void> {
    try {
      await this.db.runAsync('DELETE FROM exercise_stats WHERE exercise_id = ?', [exerciseId]);
    } catch (error) {
      throw new DatabaseError(`Error al eliminar stats del ejercicio ${exerciseId}`, error);
    }
  }

  async recalculateExerciseStats(exerciseId: string, transactionDb?: SQLite.SQLiteDatabase): Promise<ExerciseStats | null> {
    try {
      const execDb = transactionDb ?? this.db;
      
      const result = await execDb.getFirstAsync<{
        max_weight: number;
        max_volume: number;
        max_reps: number;
        total_sets: number;
        total_reps: number;
        total_volume: number;
        last_performed: string | null;
      }>(`
        SELECT
          MAX(weight) as max_weight,
          MAX(weight * reps) as max_volume,
          MAX(reps) as max_reps,
          COUNT(*) as total_sets,
          SUM(reps) as total_reps,
          SUM(weight * reps) as total_volume,
          MAX(created_at) as last_performed
        FROM sets
        WHERE exercise_id = ? AND completed = 1 AND skipped = 0
      `, [exerciseId]);

      if (!result || result.total_sets === 0) {
        await this.deleteExerciseStats(exerciseId);
        return null;
      }

      // Calculate estimated1RM with Epley formula directly in SQL
      const epleyRow = await execDb.getFirstAsync<{ max_1rm: number }>(
        `SELECT MAX(CASE WHEN reps = 1 THEN weight ELSE weight * (1 + CAST(reps AS REAL) / 30.0) END) AS max_1rm
         FROM sets WHERE exercise_id = ? AND completed = 1 AND skipped = 0`,
        [exerciseId],
      );
      const max1RM = epleyRow?.max_1rm ?? 0;

      const stats: ExerciseStats = {
        exerciseId,
        maxWeight: result.max_weight ?? 0,
        maxVolume: result.max_volume ?? 0,
        maxReps: result.max_reps ?? 0,
        estimated1RM: max1RM,
        totalSets: result.total_sets,
        totalReps: result.total_reps ?? 0,
        totalVolume: result.total_volume ?? 0,
        lastPerformed: result.last_performed ? fromSQLiteDateTime(result.last_performed) : null,
        updatedAt: new Date(),
      };

      await this.updateExerciseStats(stats);
      return stats;
    } catch (error) {
      throw new DatabaseError(`Error al recalcular stats del ejercicio ${exerciseId}`, error);
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

  async getWeeklyStats(startDate: string, endDate: string): Promise<DailyStats[]> {
    return this.getDailyStatsRange(startDate, endDate);
  }

  async deleteDailyStats(date: string): Promise<void> {
    try {
      await this.db.runAsync('DELETE FROM daily_stats WHERE date = ?', [date]);
    } catch (error) {
      throw new DatabaseError(`Error al eliminar estadísticas diarias de ${date}`, error);
    }
  }

  async recalculateDailyStats(date: string, transactionDb?: SQLite.SQLiteDatabase): Promise<DailyStats | null> {
    try {
      const execDb = transactionDb ?? this.db;
      
      // Calculate workout count & total duration for the day
      const workoutAggr = await execDb.getFirstAsync<{ count: number; total_duration: number }>(`
        SELECT COUNT(*) as count, SUM(duration_seconds) as total_duration
        FROM workouts
        WHERE date(date) = date(?)
      `, [date]);

      // Calculate sets, reps, volume
      const setsAggr = await execDb.getFirstAsync<{ total_sets: number; total_reps: number; total_volume: number }>(`
        SELECT
          COUNT(*) as total_sets,
          SUM(s.reps) as total_reps,
          SUM(s.weight * s.reps) as total_volume
        FROM sets s
        JOIN workouts w ON s.workout_id = w.id
        WHERE date(w.date) = date(?) AND s.completed = 1 AND s.skipped = 0
      `, [date]);

      if ((!workoutAggr || workoutAggr.count === 0) && (!setsAggr || setsAggr.total_sets === 0)) {
        await this.deleteDailyStats(date);
        return null;
      }

      const stats: DailyStats = {
        date,
        totalVolume: setsAggr?.total_volume ?? 0,
        totalSets: setsAggr?.total_sets ?? 0,
        totalReps: setsAggr?.total_reps ?? 0,
        workoutCount: workoutAggr?.count ?? 0,
        totalDuration: workoutAggr?.total_duration ?? 0,
      };

      await this.upsertDailyStats(stats);
      return stats;
    } catch (error) {
      throw new DatabaseError(`Error al recalcular estadísticas diarias de ${date}`, error);
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

  async getLatestRecord(exerciseId: string, recordType: RecordType): Promise<PersonalRecord | null> {
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

  async countRecordsSince(since: string): Promise<number> {
    try {
      const result = await this.db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM personal_records WHERE date >= ?',
        [since],
      );
      return result?.count ?? 0;
    } catch (error) {
      throw new DatabaseError('Error al contar récords personales', error);
    }
  }

  // =========================================
  // Muscle Balance
  // =========================================

  async getMuscleVolumeDistribution(startDate: string, endDate: string): Promise<{ muscle: string; volume: number; sets: number }[]> {
    try {
      const rows = await this.db.getAllAsync<{ muscle: string; volume: number; sets: number }>(`
        SELECT
          e.primary_muscle as muscle,
          SUM(s.weight * s.reps) as volume,
          COUNT(s.id) as sets
        FROM sets s
        JOIN workouts w ON s.workout_id = w.id
        JOIN exercises e ON s.exercise_id = e.id
        WHERE date(w.date) BETWEEN date(?) AND date(?)
          AND s.completed = 1 AND s.skipped = 0
        GROUP BY e.primary_muscle
        ORDER BY volume DESC
      `, [startDate, endDate]);
      
      return rows;
    } catch (error) {
      throw new DatabaseError('Error al obtener distribución de volumen muscular', error);
    }
  }
}
