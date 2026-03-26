import type * as SQLite from 'expo-sqlite';
import type { Exercise } from '../../domain/entities/Exercise';
import type { ExerciseType } from '../../domain/entities/Exercise';
import type { ExerciseRepository } from '../../domain/repositories/ExerciseRepository';
import type { MuscleGroup } from '../../domain/valueObjects/MuscleGroup';
import type { Equipment } from '../../domain/valueObjects/Equipment';
import { DatabaseError } from '../../shared/errors';

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
}

/**
 * Maps a raw SQLite row to an Exercise domain entity.
 * Reads from primary_muscles (JSON array) if available, falls back to primary_muscle (singular).
 */
function mapRowToExercise(row: ExerciseRow): Exercise {
  // Parse primary muscles: prefer new JSON array column, fall back to singular
  let primaryMuscles: MuscleGroup[];
  if (row.primary_muscles) {
    primaryMuscles = JSON.parse(row.primary_muscles) as MuscleGroup[];
  } else {
    primaryMuscles = [row.primary_muscle as MuscleGroup];
  }

  return {
    id: row.id,
    name: row.name,
    nameEs: row.name_es,
    primaryMuscles,
    secondaryMuscles: row.secondary_muscles
      ? (JSON.parse(row.secondary_muscles) as MuscleGroup[])
      : [],
    equipment: (row.equipment ?? 'other') as Equipment,
    exerciseType: (row.exercise_type ?? 'isolation') as ExerciseType,
    weightIncrement: row.weight_increment,
    animationPath: row.animation_path,
    description: row.description,
    anatomicalRepresentationSvg: row.anatomical_representation_svg,
  };
}

export class SQLiteExerciseRepository implements ExerciseRepository {
  constructor(private readonly db: SQLite.SQLiteDatabase) {}

  async getAll(): Promise<Exercise[]> {
    try {
      const rows = await this.db.getAllAsync<ExerciseRow>(
        'SELECT * FROM exercises ORDER BY name',
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

  async search(query: string): Promise<Exercise[]> {
    try {
      const rows = await this.db.getAllAsync<ExerciseRow>(
        'SELECT * FROM exercises WHERE name LIKE ? OR name_es LIKE ? ORDER BY name',
        [`%${query}%`, `%${query}%`],
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
         (id, name, name_es, primary_muscle, primary_muscles, secondary_muscles, equipment, exercise_type, weight_increment, animation_path, description, anatomical_representation_svg)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          exercise.id,
          exercise.name,
          exercise.nameEs,
          exercise.primaryMuscles[0] ?? 'other', // backward compat: keep first muscle in old col
          JSON.stringify(exercise.primaryMuscles),
          JSON.stringify(exercise.secondaryMuscles),
          exercise.equipment,
          exercise.exerciseType,
          exercise.weightIncrement,
          exercise.animationPath,
          exercise.description,
          exercise.anatomicalRepresentationSvg,
        ],
      );
    } catch (error) {
      throw new DatabaseError('Error al guardar ejercicio', error);
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
