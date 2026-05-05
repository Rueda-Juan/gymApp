import { useCallback } from 'react';
import { db } from '@/db/connection';
import * as schema from '@/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import { generateId } from '@/shared/lib/clientId';

import type { WorkoutSet, WorkoutExerciseState, WorkoutSetState, WorkoutWithExercises } from '@kernel';

export function useWorkoutDb() {
  const getWorkouts = useCallback(async () => {
    return db.query.workouts.findMany({
      orderBy: [desc(schema.workouts.date)],
    });
  }, []);

  const getWorkoutById = useCallback(async (id: string) => {
    return db.query.workouts.findFirst({
      where: eq(schema.workouts.id, id),
      with: {
        workoutExercises: {
          with: {
            exercise: true,
          },
        },
        sets: true,
      },
    });
  }, []);

  const startWorkout = useCallback(async (routineId?: string) => {
    const id = generateId();
    await db.insert(schema.workouts).values({
      id,
      routineId: routineId || null,
      date: new Date().toISOString(),
    });
    return { id };
  }, []);

  const finishWorkout = useCallback(async (id: string, notes?: string) => {
    await db.update(schema.workouts)
      .set({ notes })
      .where(eq(schema.workouts.id, id));
  }, []);

  const deleteWorkout = useCallback(async (id: string) => {
    await db.delete(schema.workouts).where(eq(schema.workouts.id, id));
  }, []);

  const recordSet = useCallback(async (workoutId: string, exerciseId: string, setData: Partial<WorkoutSet>) => {
    const id = generateId();
    await db.insert(schema.sets).values({
      id,
      workoutId,
      exerciseId,
      setNumber: setData.setNumber ?? 0,
      weight: setData.weight ?? 0,
      reps: setData.reps ?? 0,
      setType: setData.setType ?? 'normal',
      completed: setData.completed ?? false,
      ...setData,
    });
    return id;
  }, []);

  const recordAllSets = useCallback(async (workoutId: string, exercises: WorkoutExerciseState[]) => {
    await db.transaction(async (tx) => {
      for (const ex of exercises) {
        await tx.insert(schema.workoutExercises).values({
          id: generateId(),
          workoutId,
          exerciseId: ex.exerciseId,
          notes: '',
        });

        if (ex.sets && ex.sets.length > 0) {
          const setsToInsert = ex.sets
            .filter((s: WorkoutSetState) => s.isCompleted)
            .map((s: WorkoutSetState, idx: number) => ({
              id: s.id || generateId(),
              workoutId,
              exerciseId: ex.exerciseId,
              setNumber: idx + 1,
              reps: s.reps,
              weight: s.weight,
              rir: s.rir,
              setType: s.type || 'normal',
              completed: true,
            }));

          if (setsToInsert.length > 0) {
            await tx.insert(schema.sets).values(setsToInsert);
          }
        }
      }
    });
  }, []);

  const updateSet = useCallback(async (setId: string, setData: Partial<WorkoutSet>) => {
    await db.update(schema.sets)
      .set(setData)
      .where(eq(schema.sets.id, setId));
  }, []);

  const deleteSet = useCallback(async (setId: string) => {
    await db.delete(schema.sets).where(eq(schema.sets.id, setId));
  }, []);

  const getPreviousSets = useCallback(async (exerciseId: string) => {
    const lastWorkoutWithExercise = await db.query.workoutExercises.findFirst({
      where: eq(schema.workoutExercises.exerciseId, exerciseId),
      orderBy: [desc(schema.workoutExercises.id)],
    });

    if (!lastWorkoutWithExercise) return [];

    return db.query.sets.findMany({
      where: and(
        eq(schema.sets.exerciseId, exerciseId),
        eq(schema.sets.workoutId, lastWorkoutWithExercise.workoutId)
      ),
      orderBy: [schema.sets.setNumber],
    });
  }, []);

  const getHistory = useCallback(async (days: number = 30) => {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);

    const results = await db.query.workouts.findMany({
      where: sql`${schema.workouts.date} >= ${dateLimit.toISOString()}`,
      orderBy: [desc(schema.workouts.date)],
      with: {
        workoutExercises: {
          with: {
            exercise: true,
          },
        },
        sets: true,
      },
    });

    return results.map((w) => ({
      ...w,
      workoutExercises: w.workoutExercises.map((we) => ({
        ...we,
        sets: w.sets.filter((s) => s.exerciseId === we.exerciseId),
      })),
    })) as WorkoutWithExercises[];
  }, []);

  const suggestWeight = useCallback(async (exerciseId: string) => {
    const lastSet = await db.query.sets.findFirst({
      where: eq(schema.sets.exerciseId, exerciseId),
      orderBy: [desc(schema.sets.createdAt)],
    });

    if (!lastSet) return null;
    return {
      weight: lastSet.weight || 0,
      reps: lastSet.reps || 0,
      reason: 'Basado en tu última sesión',
    };
  }, []);

  const wipeDatabase = useCallback(async () => {
    const tables = [
      'body_weight_log',
      'daily_stats',
      'exercise_load_cache',
      'exercise_stats',
      'personal_records',
      'sets',
      'workout_exercises',
      'workouts',
      'routine_exercises',
      'routines',
      'user_preferences',
    ];

    for (const table of tables) {
      await db.run(sql.raw(`DELETE FROM ${table};`));
    }
  }, []);

  return {
    getWorkouts,
    getWorkoutById,
    startWorkout,
    finishWorkout,
    deleteWorkout,
    recordSet,
    recordAllSets,
    updateSet,
    deleteSet,
    getPreviousSets,
    getHistory,
    suggestWeight,
    wipeDatabase,
  };
}
