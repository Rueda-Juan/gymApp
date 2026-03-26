import type * as SQLite from 'expo-sqlite';
import type { Routine, RoutineExercise } from '../../domain/entities/Routine';
import type { RoutineRepository } from '../../domain/repositories/RoutineRepository';
import { DatabaseError } from '../../shared/errors';
import { fromSQLiteDateTime, toSQLiteDateTime } from '../../shared/utils/dateUtils';
import { generateId } from '../../shared/utils/generateId';

interface RoutineRow {
  id: string;
  name: string;
  notes: string | null;
  created_at: string;
}

interface RoutineExerciseRow {
  id: string;
  routine_id: string;
  exercise_id: string;
  order_index: number;
  target_sets: number;
  target_reps: number;
  min_reps: number | null;
  max_reps: number | null;
  rest_seconds: number | null;
  superset_group: number | null;
}

function mapRowToRoutineExercise(row: RoutineExerciseRow): RoutineExercise {
  return {
    id: row.id,
    exerciseId: row.exercise_id,
    orderIndex: row.order_index,
    targetSets: row.target_sets,
    minReps: row.min_reps ?? row.target_reps,
    maxReps: row.max_reps ?? row.target_reps + 4,
    restSeconds: row.rest_seconds,
    supersetGroup: row.superset_group,
  };
}

export class SQLiteRoutineRepository implements RoutineRepository {
  constructor(private readonly db: SQLite.SQLiteDatabase) {}

  async getAll(): Promise<Routine[]> {
    try {
      const routineRows = await this.db.getAllAsync<RoutineRow>(
        'SELECT * FROM routines ORDER BY created_at DESC',
      );

      const routines: Routine[] = [];
      for (const row of routineRows) {
        const exercises = await this.getRoutineExercises(row.id);
        
        // Compute unique target muscles for the routine summary badges
        const musclesSet = new Set<string>();
        exercises.forEach((ex: any) => {
          if (ex.exercise?.primaryMuscles) {
            ex.exercise.primaryMuscles.forEach((m: string) => musclesSet.add(m));
          }
        });

        routines.push({
          id: row.id,
          name: row.name,
          notes: row.notes,
          exercises,
          muscles: Array.from(musclesSet).slice(0, 3), // Show max 3 muscles as badges
          createdAt: fromSQLiteDateTime(row.created_at),
        });
      }

      return routines;
    } catch (error) {
      throw new DatabaseError('Error al obtener rutinas', error);
    }
  }

  async getById(id: string): Promise<Routine | null> {
    try {
      const row = await this.db.getFirstAsync<RoutineRow>(
        'SELECT * FROM routines WHERE id = ?',
        [id],
      );
      if (!row) return null;

      const exercises = await this.getRoutineExercises(id);
      
      const musclesSet = new Set<string>();
      exercises.forEach((ex: any) => {
        if (ex.exercise?.primaryMuscles) {
          ex.exercise.primaryMuscles.forEach((m: string) => musclesSet.add(m));
        }
      });

      return {
        id: row.id,
        name: row.name,
        notes: row.notes,
        exercises,
        muscles: Array.from(musclesSet),
        createdAt: fromSQLiteDateTime(row.created_at),
      } as any;
    } catch (error) {
      throw new DatabaseError(`Error al obtener rutina ${id}`, error);
    }
  }

  async save(routine: Routine): Promise<void> {
    try {
      await this.db.withTransactionAsync(async () => {
        // Upsert routine
        await this.db.runAsync(
          `INSERT OR REPLACE INTO routines (id, name, notes, created_at)
           VALUES (?, ?, ?, ?)`,
          [routine.id, routine.name, routine.notes, toSQLiteDateTime(routine.createdAt)],
        );

        // Delete existing exercises for this routine (cascade-safe reinsert)
        await this.db.runAsync(
          'DELETE FROM routine_exercises WHERE routine_id = ?',
          [routine.id],
        );

        // Insert exercises
        for (const exercise of routine.exercises) {
          await this.db.runAsync(
            `INSERT INTO routine_exercises (id, routine_id, exercise_id, order_index, target_sets, target_reps, min_reps, max_reps, rest_seconds, superset_group)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              exercise.id || generateId(),
              routine.id,
              exercise.exerciseId,
              exercise.orderIndex,
              exercise.targetSets,
              exercise.maxReps, // target_reps fallback
              exercise.minReps,
              exercise.maxReps,
              exercise.restSeconds,
              exercise.supersetGroup,
            ],
          );
        }
      });
    } catch (error) {
      throw new DatabaseError('Error al guardar rutina', error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.db.runAsync('DELETE FROM routines WHERE id = ?', [id]);
    } catch (error) {
      throw new DatabaseError(`Error al eliminar rutina ${id}`, error);
    }
  }

  // --- Private helpers ---

  private async getRoutineExercises(routineId: string): Promise<any[]> {
    const rows = await this.db.getAllAsync<any>(
      `SELECT re.*, 
              e.id as ex_id, e.name as ex_name, e.name_es as ex_name_es, 
              e.primary_muscles as ex_primary_muscles, e.equipment as ex_equipment
       FROM routine_exercises re
       LEFT JOIN exercises e ON re.exercise_id = e.id
       WHERE re.routine_id = ? ORDER BY re.order_index`,
      [routineId],
    );
    return rows.map(row => {
      const re = mapRowToRoutineExercise(row);
      (re as any).exercise = {
        id: row.ex_id,
        name: row.ex_name,
        nameEs: row.ex_name_es,
        primaryMuscles: row.ex_primary_muscles ? JSON.parse(row.ex_primary_muscles) : [],
        equipment: row.ex_equipment,
      };
      return re;
    });
  }
}
