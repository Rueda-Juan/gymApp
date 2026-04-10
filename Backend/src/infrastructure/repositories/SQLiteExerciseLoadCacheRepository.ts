import type * as SQLite from 'expo-sqlite';
import type {
  CachedWeightSuggestion,
  ExerciseLoadCacheRepository,
} from '../../domain/repositories/ExerciseLoadCacheRepository';
import { DatabaseError } from '../../shared/errors';

const CACHE_TTL_HOURS = 24;

interface CacheRow {
  exercise_id: string;
  recommended_weight: number;
  basis: string;
  last_weight: number | null;
  last_reps: number | null;
  sessions_analyzed: number;
  updated_at: string;
}

function isCacheExpired(updatedAt: string): boolean {
  const ageMs = Date.now() - new Date(updatedAt).getTime();
  const ageHours = ageMs / (1000 * 60 * 60);
  return ageHours > CACHE_TTL_HOURS;
}

function mapRowToSuggestion(row: CacheRow): CachedWeightSuggestion {
  return {
    exerciseId: row.exercise_id,
    recommendedWeight: row.recommended_weight,
    basis: row.basis as CachedWeightSuggestion['basis'],
    lastWeight: row.last_weight,
    lastReps: row.last_reps,
    sessionsAnalyzed: row.sessions_analyzed,
    updatedAt: new Date(row.updated_at),
  };
}

export class SQLiteExerciseLoadCacheRepository implements ExerciseLoadCacheRepository {
  constructor(private readonly db: SQLite.SQLiteDatabase) {}

  async get(exerciseId: string): Promise<CachedWeightSuggestion | null> {
    try {
      const row = await this.db.getFirstAsync<CacheRow>(
        'SELECT * FROM exercise_load_cache WHERE exercise_id = ?',
        [exerciseId],
      );

      if (!row) return null;
      if (isCacheExpired(row.updated_at)) {
        await this.invalidate(exerciseId);
        return null;
      }

      return mapRowToSuggestion(row);
    } catch (error) {
      throw new DatabaseError(`Error al leer cache de ejercicio ${exerciseId}`, error);
    }
  }

  async upsert(suggestion: CachedWeightSuggestion): Promise<void> {
    try {
      await this.db.runAsync(
        `INSERT OR REPLACE INTO exercise_load_cache
         (exercise_id, recommended_weight, basis, last_weight, last_reps, sessions_analyzed, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
        [
          suggestion.exerciseId,
          suggestion.recommendedWeight,
          suggestion.basis,
          suggestion.lastWeight,
          suggestion.lastReps,
          suggestion.sessionsAnalyzed,
        ],
      );
    } catch (error) {
      throw new DatabaseError(`Error al guardar cache de ejercicio ${suggestion.exerciseId}`, error);
    }
  }

  async invalidate(exerciseId: string): Promise<void> {
    try {
      await this.db.runAsync(
        'DELETE FROM exercise_load_cache WHERE exercise_id = ?',
        [exerciseId],
      );
    } catch (error) {
      throw new DatabaseError(`Error al invalidar cache de ejercicio ${exerciseId}`, error);
    }
  }

  async invalidateAll(): Promise<void> {
    try {
      await this.db.runAsync('DELETE FROM exercise_load_cache');
    } catch (error) {
      throw new DatabaseError('Error al limpiar cache de ejercicios', error);
    }
  }
}
