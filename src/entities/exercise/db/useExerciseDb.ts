import { useCallback } from 'react';
import { db } from '@/db/connection';
import * as schema from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { generateId } from '@/shared/lib/clientId';
import { Exercise } from '@kernel';

export function generateExerciseKey(name: string, isCustom: boolean): string {
  const normalizedName = name
    .toLowerCase()
    .trim()
    .replace(/['\\u2019]/g, '')
    .replace(/[\\s-]+/g, '_');

  return isCustom ? `custom_${normalizedName}` : normalizedName;
}

export function useExerciseDb() {
  const getExercises = useCallback(async () => {
    return db.query.exercises.findMany({
      where: eq(schema.exercises.isArchived, false),
    });
  }, []);

  const getExerciseById = useCallback(async (id: string) => {
    return db.query.exercises.findFirst({
      where: eq(schema.exercises.id, id),
    });
  }, []);

  const createExercise = useCallback(async (params: Partial<Exercise>) => {
    const id = generateId();
    const exerciseKey = generateExerciseKey(params.name!, params.isCustom ?? true);

    await db.insert(schema.exercises).values({
      id,
      name: params.name ?? '',
      primaryMuscle: params.primaryMuscle ?? '',
      exerciseKey,
      ...params,
    });

    return id;
  }, []);

  const updateExercise = useCallback(async (id: string, params: Partial<Exercise>) => {
    const values: Partial<Exercise> = { ...params };
    if (params.name) {
      const existing = await db.query.exercises.findFirst({
        where: eq(schema.exercises.id, id),
      });
      if (existing) {
        values.exerciseKey = generateExerciseKey(params.name, existing.isCustom);
      }
    }

    await db.update(schema.exercises)
      .set(values)
      .where(eq(schema.exercises.id, id));
  }, []);

  const archiveExercise = useCallback(async (id: string) => {
    await db.update(schema.exercises)
      .set({ isArchived: true })
      .where(eq(schema.exercises.id, id));
  }, []);

  const getExerciseHistory = useCallback(async (exerciseId: string, limit: number = 50) => {
    return db.query.sets.findMany({
      where: eq(schema.sets.exerciseId, exerciseId),
      limit,
      orderBy: [desc(schema.sets.createdAt)],
      with: {
        workout: true,
      },
    });
  }, []);

  return {
    getExercises,
    getExerciseById,
    createExercise,
    updateExercise,
    archiveExercise,
    getExerciseHistory,
  };
}
