import type * as SQLite from 'expo-sqlite';
import type { Exercise } from '../../domain/entities/Exercise';
import type { ExerciseRepository } from '../../domain/repositories/ExerciseRepository';
import type { MuscleGroup } from '../../domain/valueObjects/MuscleGroup';
import type { Equipment } from '../../domain/valueObjects/Equipment';
import { DatabaseError } from '../../shared/errors';

interface ExerciseRow {
  id: string;
  name: string;
  primary_muscle: string;
  secondary_muscles: string | null;
  equipment: string | null;
  weight_increment: number;
  animation_path: string | null;
  description: string | null;
  anatomical_representation_svg: string | null;
}

/**
 * Maps a raw SQLite row to an Exercise domain entity.
 */
function mapRowToExercise(row: ExerciseRow): Exercise {
  return {
    id: row.id,
    name: row.name,
    primaryMuscle: row.primary_muscle as MuscleGroup,
    secondaryMuscles: row.secondary_muscles
      ? (JSON.parse(row.secondary_muscles) as MuscleGroup[])
      : [],
    equipment: (row.equipment ?? 'other') as Equipment,
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
        'SELECT * FROM exercises WHERE name LIKE ? ORDER BY name',
        [`%${query}%`],
      );
      return rows.map(mapRowToExercise);
    } catch (error) {
      throw new DatabaseError('Error al buscar ejercicios', error);
    }
  }

  async getByMuscleGroup(muscle: string): Promise<Exercise[]> {
    try {
      const rows = await this.db.getAllAsync<ExerciseRow>(
        'SELECT * FROM exercises WHERE primary_muscle = ? ORDER BY name',
        [muscle],
      );
      return rows.map(mapRowToExercise);
    } catch (error) {
      throw new DatabaseError('Error al filtrar por músculo', error);
    }
  }

  async save(exercise: Exercise): Promise<void> {
    try {
      await this.db.runAsync(
        `INSERT OR REPLACE INTO exercises
         (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          exercise.id,
          exercise.name,
          exercise.primaryMuscle,
          JSON.stringify(exercise.secondaryMuscles),
          exercise.equipment,
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
