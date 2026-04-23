import type * as SQLite from 'expo-sqlite';
import type { Routine, RoutineExercise } from './routine.entity';
import type { RoutineRepository } from './routine.repository';
import { DatabaseError } from '../../core/errors/errors';
import { fromSQLiteDateTime, toSQLiteDateTime } from '../../core/utils/date';
import { generateId } from '../../core/utils/generate-id';
import { safeJsonParse } from '../../core/utils/safe-json';





interface ExerciseDetails {
  id: string;
  name: string;
  nameEs: string | null;
  primaryMuscles: string[];
  equipment: string | null;
}

type RoutineExerciseWithDetails = RoutineExercise & { exercise: ExerciseDetails };

function collectMuscles(exercises: RoutineExerciseWithDetails[], maxBadges = 3): string[] {
  const musclesSet = new Set<string>();
  for (const ex of exercises) {
    for (const m of ex.exercise.primaryMuscles) {
      musclesSet.add(m);
    }
  }
  return Array.from(musclesSet).slice(0, maxBadges);
}

const ROUTINE_EXERCISES_JOIN_QUERY = `
  SELECT
    r.id       AS r_id,
    r.name     AS r_name,
    r.notes    AS r_notes,
    r.created_at AS r_created_at,
    re.id      AS re_id,
    re.routine_id,
    re.exercise_id,
    re.order_index,
    re.target_sets,
    re.target_reps,
    re.min_reps,
    re.max_reps,
    re.rest_seconds,
    re.superset_group,
    e.id       AS ex_id,
    e.name     AS ex_name,
    e.name_es  AS ex_name_es,
    e.primary_muscles AS ex_primary_muscles,
    e.equipment AS ex_equipment
  FROM routines r
  LEFT JOIN routine_exercises re ON re.routine_id = r.id
  LEFT JOIN exercises e ON e.id = re.exercise_id
`;

function mapJoinedRowToExercise(row: Record<string, unknown>): RoutineExerciseWithDetails {
  const routineExercise: RoutineExercise = {
    id: row.re_id as string,
    exerciseId: row.exercise_id as string,
    orderIndex: row.order_index as number,
    targetSets: row.target_sets as number,
    minReps: (row.min_reps as number | null) ?? (row.target_reps as number),
    maxReps: (row.max_reps as number | null) ?? (row.target_reps as number) + 4,
    restSeconds: row.rest_seconds as number | null,
    supersetGroup: row.superset_group as number | null,
  };

  const exercise: ExerciseDetails = {
    id: row.ex_id as string,
    name: row.ex_name as string,
    nameEs: row.ex_name_es as string | null,
    primaryMuscles: safeJsonParse<string[]>(row.ex_primary_muscles as string | null, []),
    equipment: row.ex_equipment as string | null,
  };

  return { ...routineExercise, exercise };
}

export class SQLiteRoutineRepository implements RoutineRepository {
  constructor(private readonly db: SQLite.SQLiteDatabase) {}

  async getAll(): Promise<Routine[]> {
    try {
      const rows = await this.db.getAllAsync<Record<string, unknown>>(
        `${ROUTINE_EXERCISES_JOIN_QUERY} ORDER BY r.created_at DESC, re.order_index`,
      );

      const routinesMap = new Map<string, { row: Record<string, unknown>; exercises: RoutineExerciseWithDetails[] }>();

      for (const row of rows) {
        const routineId = row.r_id as string;

        if (!routinesMap.has(routineId)) {
          routinesMap.set(routineId, { row, exercises: [] });
        }

        const hasExercise = row.re_id != null;
        if (hasExercise) {
          routinesMap.get(routineId)!.exercises.push(mapJoinedRowToExercise(row));
        }
      }

      return Array.from(routinesMap.values()).map(({ row, exercises }) => ({
        id: row.r_id as string,
        name: row.r_name as string,
        notes: row.r_notes as string | null,
        exercises,
        muscles: collectMuscles(exercises),
        createdAt: fromSQLiteDateTime(row.r_created_at as string),
      }));
    } catch (error) {
      throw new DatabaseError('Error al obtener rutinas', error);
    }
  }

  async getById(id: string): Promise<Routine | null> {
    try {
      const rows = await this.db.getAllAsync<Record<string, unknown>>(
        `${ROUTINE_EXERCISES_JOIN_QUERY} WHERE r.id = ? ORDER BY re.order_index`,
        [id],
      );

      if (rows.length === 0) return null;

      const firstRow = rows[0]!;
      const exercises: RoutineExerciseWithDetails[] = [];

      for (const row of rows) {
        const hasExercise = row.re_id != null;
        if (hasExercise) {
          exercises.push(mapJoinedRowToExercise(row));
        }
      }

      return {
        id: firstRow.r_id as string,
        name: firstRow.r_name as string,
        notes: firstRow.r_notes as string | null,
        exercises,
        muscles: collectMuscles(exercises),
        createdAt: fromSQLiteDateTime(firstRow.r_created_at as string),
      };
    } catch (error) {
      throw new DatabaseError(`Error al obtener rutina ${id}`, error);
    }
  }

  async save(routine: Routine): Promise<void> {
    try {
      await this.db.withTransactionAsync(async () => {
        await this.db.runAsync(
          `INSERT OR REPLACE INTO routines (id, name, notes, created_at)
           VALUES (?, ?, ?, ?)`,
          [routine.id, routine.name, routine.notes, toSQLiteDateTime(routine.createdAt)],
        );

        await this.db.runAsync(
          'DELETE FROM routine_exercises WHERE routine_id = ?',
          [routine.id],
        );

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
              exercise.maxReps,
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
}
