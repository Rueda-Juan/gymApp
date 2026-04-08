import type * as SQLite from 'expo-sqlite';
import type { Exercise, ExerciseType, LoadType } from '../../domain/entities/Exercise';
import type { ExerciseRepository } from '../../domain/repositories/ExerciseRepository';
import type { MuscleGroup } from '../../domain/valueObjects/MuscleGroup';
import type { Equipment } from '../../domain/valueObjects/Equipment';
import { DatabaseError } from '../../shared/errors';
import { safeJsonParse } from '../../shared/utils/safeJsonParse';

interface ExerciseRow {
  id: string;
  name: string;
  name_es: string | null;
  primary_muscle: string;
  primary_muscles: string | null;
  secondary_muscles: string | null;
  equipment: string | null;
  exercise_type: string | null;
  weight_increment: number;
  animation_path: string | null;
  description: string | null;
  anatomical_representation_svg: string | null;
  exercise_key: string | null;
  is_custom: number | null;
  created_by: string | null;
  load_type: string | null;
  is_archived: number | null;
}

/**
 * Maps a raw SQLite row to an Exercise domain entity.
 * Reads from primary_muscles (JSON array) if available, falls back to primary_muscle (singular).
 */
function mapRowToExercise(row: ExerciseRow): Exercise {
  const primaryMuscles: MuscleGroup[] = row.primary_muscles
    ? safeJsonParse<MuscleGroup[]>(row.primary_muscles, [row.primary_muscle as MuscleGroup])
    : [row.primary_muscle as MuscleGroup];

  return {
    id: row.id,
    name: row.name,
    nameEs: row.name_es,
    primaryMuscles,
    secondaryMuscles: safeJsonParse<MuscleGroup[]>(row.secondary_muscles, []),
    equipment: (row.equipment ?? 'other') as Equipment,
    exerciseType: (row.exercise_type ?? 'isolation') as ExerciseType,
    weightIncrement: row.weight_increment,
    animationPath: row.animation_path,
    description: row.description,
    anatomicalRepresentationSvg: row.anatomical_representation_svg,
    exerciseKey: row.exercise_key ?? '',
    isCustom: Boolean(row.is_custom),
    createdBy: row.created_by,
    loadType: (row.load_type ?? 'weighted') as LoadType,
    isArchived: Boolean(row.is_archived),
  };
}

export class SQLiteExerciseRepository implements ExerciseRepository {
  constructor(private readonly db: SQLite.SQLiteDatabase) {}

  async getAll(): Promise<Exercise[]> {
    try {
      const rows = await this.db.getAllAsync<ExerciseRow>(
        'SELECT * FROM exercises WHERE is_archived = 0 OR is_archived IS NULL ORDER BY name',
      );
      return rows.map(mapRowToExercise);
    } catch (error) {
      throw new DatabaseError('Error al obtener ejercicios', error);
    }
  }

  async getById(id: string): Promise<Exercise | null> {
    try {
      const row = await this.db.getFirstAsync<ExerciseRow>(
        'SELECT * FROM exercises WHERE id = ?',
        [id],
      );
      return row ? mapRowToExercise(row) : null;
    } catch (error) {
      throw new DatabaseError(`Error al obtener ejercicio ${id}`, error);
    }
  }

  async getByKey(exerciseKey: string): Promise<Exercise | null> {
    try {
      const row = await this.db.getFirstAsync<ExerciseRow>(
        'SELECT * FROM exercises WHERE exercise_key = ?',
        [exerciseKey],
      );
      return row ? mapRowToExercise(row) : null;
    } catch (error) {
      throw new DatabaseError(`Error al obtener ejercicio por key ${exerciseKey}`, error);
    }
  }

  async search(query: string): Promise<Exercise[]> {
    try {
      const rows = await this.db.getAllAsync<ExerciseRow>(
        `SELECT * FROM exercises
         WHERE (name LIKE ? OR name_es LIKE ? OR exercise_key LIKE ?)
           AND (is_archived = 0 OR is_archived IS NULL)
         ORDER BY name`,
        [`%${query}%`, `%${query}%`, `%${query}%`],
      );
      return rows.map(mapRowToExercise);
    } catch (error) {
      throw new DatabaseError('Error al buscar ejercicios', error);
    }
  }

  async getByMuscleGroup(muscle: string): Promise<Exercise[]> {
    try {
      // Search in both new JSON array column and legacy singular column
      const rows = await this.db.getAllAsync<ExerciseRow>(
        `SELECT * FROM exercises 
         WHERE primary_muscles LIKE ? OR primary_muscle = ? 
         ORDER BY name`,
        [`%"${muscle}"%`, muscle],
      );
      return rows.map(mapRowToExercise);
    } catch (error) {
      throw new DatabaseError('Error al filtrar por músculo', error);
    }
  }

  async isInUse(id: string): Promise<boolean> {
    try {
      const routineResult = await this.db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM routine_exercises WHERE exercise_id = ?',
        [id],
      );
      
      const workoutResult = await this.db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM workout_exercises WHERE exercise_id = ?',
        [id],
      );
      
      return (routineResult?.count ?? 0) > 0 || (workoutResult?.count ?? 0) > 0;
    } catch (error) {
      throw new DatabaseError(`Error al verificar uso del ejercicio ${id}`, error);
    }
  }

  async save(exercise: Exercise): Promise<void> {
    try {
      await this.db.runAsync(
        `INSERT OR REPLACE INTO exercises
         (id, name, name_es, primary_muscle, primary_muscles, secondary_muscles, equipment,
          exercise_type, weight_increment, animation_path, description, anatomical_representation_svg,
          exercise_key, is_custom, created_by, load_type, is_archived)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          exercise.id,
          exercise.name,
          exercise.nameEs,
          exercise.primaryMuscles[0] ?? 'other',
          JSON.stringify(exercise.primaryMuscles),
          JSON.stringify(exercise.secondaryMuscles),
          exercise.equipment,
          exercise.exerciseType,
          exercise.weightIncrement,
          exercise.animationPath,
          exercise.description,
          exercise.anatomicalRepresentationSvg,
          exercise.exerciseKey,
          exercise.isCustom ? 1 : 0,
          exercise.createdBy,
          exercise.loadType,
          exercise.isArchived ? 1 : 0,
        ],
      );
    } catch (error) {
      throw new DatabaseError('Error al guardar ejercicio', error);
    }
  }

  async archive(id: string): Promise<void> {
    try {
      await this.db.runAsync(
        'UPDATE exercises SET is_archived = 1 WHERE id = ?',
        [id],
      );
    } catch (error) {
      throw new DatabaseError(`Error al archivar ejercicio ${id}`, error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.db.runAsync('DELETE FROM exercises WHERE id = ?', [id]);
    } catch (error) {
      throw new DatabaseError(`Error al eliminar ejercicio ${id}`, error);
    }
  }
}
