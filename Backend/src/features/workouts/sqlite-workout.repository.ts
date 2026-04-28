import type * as SQLite from 'expo-sqlite';
import type { Workout } from '@entities/workout';
import type { WorkoutExercise } from '@entities/workout';
import type { WorkoutSet } from '@entities/workout';
import type { SetType } from '@shared';
import type { WorkoutRepository } from '@entities/workout';
import { DatabaseError } from '@core/errors/errors';
import { fromSQLiteDateTime, toSQLiteDateTime } from '@core/utils/date';
import { generateId } from '@core/utils/generate-id';
import { safeJsonParse } from '@core/utils/safe-json';
import { createLogger } from '@core/logger/Logger';

const log = createLogger('WorkoutRepo');

interface WorkoutRow {
  id: string;
  routine_id: string | null;
  date: string;
  duration_seconds: number;
  notes: string | null;
}



interface SetRow {
  id: string;
  workout_id: string;
  exercise_id: string;
  set_number: number;
  weight: number;
  reps: number;
  partial_reps: number | null;
  rir: number | null;
  set_type: string;
  rest_seconds: number | null;
  duration_seconds: number;
  completed: number;
  skipped: number;
  created_at: string;
}

/**
 * Combined row from LEFT JOIN of workout_exercises + sets.
 * Used to eliminate N+1 queries in buildWorkout().
 */
interface JoinedExerciseSetRow {
  // workout_exercises columns
  we_id: string;
  we_exercise_id: string;
  we_order_index: number;
  we_skipped: number;
  we_notes: string | null;
  we_superset_group: number | null;
  // exercises columns
  ex_name: string;
  ex_name_es: string | null;
  ex_primary_muscles: string | null;
  ex_secondary_muscles: string | null;
  // sets columns (nullable due to LEFT JOIN)
  s_id: string | null;
  s_exercise_id: string | null;
  s_set_number: number | null;
  s_weight: number | null;
  s_reps: number | null;
  s_partial_reps: number | null;
  s_rir: number | null;
  s_set_type: string | null;
  s_rest_seconds: number | null;
  s_duration_seconds: number | null;
  s_completed: number | null;
  s_skipped: number | null;
  s_created_at: string | null;
}

function mapSetRow(row: SetRow): WorkoutSet {
  return {
    id: row.id,
    exerciseId: row.exercise_id,
    workoutId: row.workout_id,
    setNumber: row.set_number,
    weight: row.weight,
    reps: row.reps,
    partialReps: row.partial_reps,
    rir: row.rir ?? null,
    setType: row.set_type as SetType,
    restSeconds: row.rest_seconds,
    durationSeconds: row.duration_seconds,
    completed: Boolean(row.completed),
    skipped: Boolean(row.skipped),
    createdAt: fromSQLiteDateTime(row.created_at),
  };
}

export class SQLiteWorkoutRepository implements WorkoutRepository {
  constructor(private readonly db: SQLite.SQLiteDatabase) {}

  async getById(id: string): Promise<Workout | null> {
    try {
      const row = await this.db.getFirstAsync<WorkoutRow>(
        'SELECT * FROM workouts WHERE id = ?',
        [id],
      );
      if (!row) return null;
      return this.buildWorkout(row);
    } catch (error) {
      throw new DatabaseError(`Error al obtener workout ${id}`, error);
    }
  }

  async getByDateRange(start: Date, end: Date): Promise<Workout[]> {
    try {
      const rows = await this.db.getAllAsync<WorkoutRow>(
        'SELECT * FROM workouts WHERE date BETWEEN ? AND ? ORDER BY date DESC',
        [toSQLiteDateTime(start), toSQLiteDateTime(end)],
      );
      const workouts: Workout[] = [];
      for (const r of rows) {
        workouts.push(await this.buildWorkout(r));
      }
      return workouts;
    } catch (error) {
      throw new DatabaseError('Error al obtener workouts por rango', error);
    }
  }

  async getRecent(limit: number): Promise<Workout[]> {
    try {
      const rows = await this.db.getAllAsync<WorkoutRow>(
        'SELECT * FROM workouts ORDER BY date DESC LIMIT ?',
        [limit],
      );
      const workouts: Workout[] = [];
      for (const row of rows) {
        workouts.push(await this.buildWorkout(row));
      }
      return workouts;
    } catch (error) {
      throw new DatabaseError('Error al obtener workouts recientes', error);
    }
  }

  async save(workout: Workout): Promise<void> {
    try {
      await this.db.withTransactionAsync(async () => {
        await this.db.runAsync(
          `INSERT OR REPLACE INTO workouts (id, routine_id, date, duration_seconds, notes)
           VALUES (?, ?, ?, ?, ?)`,
          [
            workout.id,
            workout.routineId,
            toSQLiteDateTime(workout.date),
            workout.durationSeconds,
            workout.notes,
          ],
        );

        await this.db.runAsync(
          'DELETE FROM workout_exercises WHERE workout_id = ?',
          [workout.id],
        );

        for (const exercise of workout.exercises) {
          await this.db.runAsync(
            `INSERT INTO workout_exercises (id, workout_id, exercise_id, order_index, skipped, notes, superset_group)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              exercise.id || generateId(),
              workout.id,
              exercise.exerciseId,
              exercise.orderIndex,
              exercise.skipped ? 1 : 0,
              exercise.notes,
              exercise.supersetGroup,
            ],
          );

          for (const set of exercise.sets) {
            await this.db.runAsync(
              `INSERT OR REPLACE INTO sets
               (id, workout_id, exercise_id, set_number, weight, reps, partial_reps, rir, set_type, rest_seconds, duration_seconds, completed, skipped, created_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                set.id,
                workout.id,
                set.exerciseId,
                set.setNumber,
                set.weight,
                set.reps,
                set.partialReps ?? 0,
                set.rir,
                set.setType,
                set.restSeconds,
                set.durationSeconds,
                set.completed ? 1 : 0,
                set.skipped ? 1 : 0,
                toSQLiteDateTime(set.createdAt),
              ],
            );
          }
        }
      });
      log.info('Workout saved', { id: workout.id });
    } catch (error) {
      throw new DatabaseError('Error al guardar workout', error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.db.runAsync('DELETE FROM workouts WHERE id = ?', [id]);
      log.info('Workout deleted', { id });
    } catch (error) {
      throw new DatabaseError(`Error al eliminar workout ${id}`, error);
    }
  }

  async addSet(workoutId: string, exerciseId: string, set: WorkoutSet): Promise<void> {
    try {
      await this.db.runAsync(
        `INSERT INTO sets
         (id, workout_id, exercise_id, set_number, weight, reps, partial_reps, rir, set_type, rest_seconds, duration_seconds, completed, skipped, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          set.id,
          workoutId,
          exerciseId,
          set.setNumber,
          set.weight,
          set.reps,
          set.partialReps ?? 0,
          set.rir,
          set.setType,
          set.restSeconds,
          set.durationSeconds,
          set.completed ? 1 : 0,
          set.skipped ? 1 : 0,
          toSQLiteDateTime(set.createdAt),
        ],
      );
    } catch (error) {
      throw new DatabaseError('Error al agregar set', error);
    }
  }

  async updateSet(workoutId: string, set: WorkoutSet): Promise<void> {
    try {
      await this.db.runAsync(
        `UPDATE sets
         SET weight = ?, reps = ?, partial_reps = ?, rir = ?, set_type = ?, rest_seconds = ?, duration_seconds = ?, completed = ?, skipped = ?
         WHERE id = ? AND workout_id = ?`,
        [
          set.weight,
          set.reps,
          set.partialReps ?? 0,
          set.rir,
          set.setType,
          set.restSeconds,
          set.durationSeconds,
          set.completed ? 1 : 0,
          set.skipped ? 1 : 0,
          set.id,
          workoutId,
        ],
      );
    } catch (error) {
      throw new DatabaseError(`Error al actualizar set ${set.id}`, error);
    }
  }

  async deleteSet(workoutId: string, setId: string): Promise<void> {
    try {
      await this.db.runAsync(
        'DELETE FROM sets WHERE id = ? AND workout_id = ?',
        [setId, workoutId],
      );
    } catch (error) {
      throw new DatabaseError(`Error al eliminar set ${setId}`, error);
    }
  }

  async addExercise(workoutId: string, exercise: WorkoutExercise): Promise<void> {
    try {
      await this.db.runAsync(
        `INSERT INTO workout_exercises (id, workout_id, exercise_id, order_index, skipped, notes, superset_group)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          exercise.id,
          workoutId,
          exercise.exerciseId,
          exercise.orderIndex,
          exercise.skipped ? 1 : 0,
          exercise.notes,
          exercise.supersetGroup,
        ],
      );
    } catch (error) {
      throw new DatabaseError('Error al agregar ejercicio al workout', error);
    }
  }

  async reorderExercises(workoutId: string, exerciseIds: string[]): Promise<void> {
    try {
      await this.db.withTransactionAsync(async () => {
        for (let i = 0; i < exerciseIds.length; i++) {
          await this.db.runAsync(
            'UPDATE workout_exercises SET order_index = ? WHERE id = ? AND workout_id = ?',
            [i, exerciseIds[i]!, workoutId],
          );
        }
      });
    } catch (error) {
      throw new DatabaseError('Error al reordenar ejercicios', error);
    }
  }

  async deleteExercise(workoutId: string, workoutExerciseId: string): Promise<void> {
    try {
      await this.db.withTransactionAsync(async () => {
        // First, get the exercise_id before deleting
        const exerciseRow = await this.db.getFirstAsync<{ exercise_id: string }>(
          'SELECT exercise_id FROM workout_exercises WHERE id = ? AND workout_id = ?',
          [workoutExerciseId, workoutId],
        );

        // Delete the exercise
        await this.db.runAsync(
          'DELETE FROM workout_exercises WHERE id = ? AND workout_id = ?',
          [workoutExerciseId, workoutId],
        );

        // Also delete all sets associated with this exercise in the workout
        if (exerciseRow) {
          await this.db.runAsync(
            'DELETE FROM sets WHERE workout_id = ? AND exercise_id = ?',
            [workoutId, exerciseRow.exercise_id],
          );
        }
      });
    } catch (error) {
      throw new DatabaseError('Error al eliminar ejercicio del workout', error);
    }
  }

  async updateExerciseNotes(
    workoutId: string,
    workoutExerciseId: string,
    notes: string | null,
  ): Promise<void> {
    try {
      await this.db.runAsync(
        'UPDATE workout_exercises SET notes = ? WHERE id = ? AND workout_id = ?',
        [notes, workoutExerciseId, workoutId],
      );
    } catch (error) {
      throw new DatabaseError('Error al actualizar notas del ejercicio', error);
    }
  }

  async getExerciseHistory(exerciseId: string, limit: number = 20): Promise<WorkoutSet[]> {
    try {
      const rows = await this.db.getAllAsync<SetRow>(
        'SELECT * FROM sets WHERE exercise_id = ? ORDER BY created_at DESC LIMIT ?',
        [exerciseId, limit],
      );
      return rows.map(mapSetRow);
    } catch (error) {
      throw new DatabaseError('Error al obtener historial de sets', error);
    }
  }

  async getPreviousSets(exerciseId: string): Promise<WorkoutSet[]> {
    try {
      const rows = await this.db.getAllAsync<SetRow>(
        `SELECT s.*
         FROM sets s
         INNER JOIN (
           SELECT workout_id
           FROM sets
           WHERE exercise_id = ?
           ORDER BY created_at DESC
           LIMIT 1
         ) latest ON s.workout_id = latest.workout_id
         WHERE s.exercise_id = ?
         ORDER BY s.set_number ASC`,
        [exerciseId, exerciseId],
      );
      return rows.map(mapSetRow);
    } catch (error) {
      throw new DatabaseError('Error al obtener sets previos del ejercicio', error);
    }
  }

  async markExerciseSkipped(workoutId: string, exerciseId: string, skipped: boolean): Promise<void> {
    try {
      await this.db.runAsync(
        `UPDATE workout_exercises SET skipped = ?
         WHERE workout_id = ? AND exercise_id = ?`,
        [skipped ? 1 : 0, workoutId, exerciseId],
      );
    } catch (error) {
      throw new DatabaseError('Error al marcar ejercicio como saltado', error);
    }
  }

  // --- Private helpers ---

  /**
   * Builds a full Workout entity from a WorkoutRow using a single
   * LEFT JOIN query instead of N+1 separate queries.
   */
  private async buildWorkout(row: WorkoutRow): Promise<Workout> {
    const joinedRows = await this.db.getAllAsync<JoinedExerciseSetRow>(
      `SELECT
         we.id          AS we_id,
         we.exercise_id AS we_exercise_id,
         we.order_index AS we_order_index,
         we.skipped     AS we_skipped,
         we.notes       AS we_notes,
         we.superset_group AS we_superset_group,
         ex.name        AS ex_name,
         ex.name_es     AS ex_name_es,
         ex.primary_muscles AS ex_primary_muscles,
         ex.secondary_muscles AS ex_secondary_muscles,
         s.id               AS s_id,
         s.exercise_id      AS s_exercise_id,
         s.set_number       AS s_set_number,
         s.weight           AS s_weight,
         s.reps             AS s_reps,
         s.partial_reps     AS s_partial_reps,
         s.rir              AS s_rir,
         s.set_type         AS s_set_type,
         s.rest_seconds     AS s_rest_seconds,
         s.duration_seconds AS s_duration_seconds,
         s.completed        AS s_completed,
         s.skipped          AS s_skipped,
         s.created_at       AS s_created_at
       FROM workout_exercises we
       INNER JOIN exercises ex ON ex.id = we.exercise_id
       LEFT JOIN sets s
         ON s.workout_id = we.workout_id AND s.exercise_id = we.exercise_id
       WHERE we.workout_id = ?
       ORDER BY we.order_index, s.set_number`,
      [row.id],
    );

    // Group rows by exercise
    const exerciseMap = new Map<string, WorkoutExercise>();

    for (const jr of joinedRows) {
      let exercise = exerciseMap.get(jr.we_id);
      if (!exercise) {
        exercise = {
          id: jr.we_id,
          exerciseId: jr.we_exercise_id,
          name: jr.ex_name,
          nameEs: jr.ex_name_es,
          orderIndex: jr.we_order_index,
          skipped: Boolean(jr.we_skipped),
          notes: jr.we_notes,
          supersetGroup: jr.we_superset_group,
          primaryMuscles: safeJsonParse(jr.ex_primary_muscles, []),
          secondaryMuscles: safeJsonParse(jr.ex_secondary_muscles, []),
          sets: [],
        };
        exerciseMap.set(jr.we_id, exercise);
      }

      // Add set if it exists (LEFT JOIN may produce null set columns)
      if (jr.s_id !== null) {
        exercise.sets.push({
          id: jr.s_id,
          exerciseId: jr.s_exercise_id!,
          setNumber: jr.s_set_number!,
          weight: jr.s_weight!,
          reps: jr.s_reps!,
          partialReps: jr.s_partial_reps,
          rir: jr.s_rir ?? null,
          setType: jr.s_set_type as SetType,
          restSeconds: jr.s_rest_seconds,
          durationSeconds: jr.s_duration_seconds!,
          completed: Boolean(jr.s_completed),
          skipped: Boolean(jr.s_skipped),
          createdAt: fromSQLiteDateTime(jr.s_created_at!),
        });
      }
    }

    return {
      id: row.id,
      routineId: row.routine_id,
      date: fromSQLiteDateTime(row.date),
      durationSeconds: row.duration_seconds,
      notes: row.notes,
      exercises: Array.from(exerciseMap.values()),
    };
  }
}
