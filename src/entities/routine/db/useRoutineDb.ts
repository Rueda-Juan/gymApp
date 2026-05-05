import { useCallback } from 'react';
import { db } from '@/db/connection';
import * as schema from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { generateId } from '@/shared/lib/clientId';
import { RoutineExercise } from '@kernel';

export function useRoutineDb() {
  const getRoutines = useCallback(async () => {
    return db.query.routines.findMany({
      with: {
        routineExercises: {
          with: {
            exercise: true,
          },
        },
      },
      orderBy: [desc(schema.routines.createdAt)],
    });
  }, []);

  const getRoutineById = useCallback(async (id: string) => {
    return db.query.routines.findFirst({
      where: eq(schema.routines.id, id),
      with: {
        routineExercises: {
          with: {
            exercise: true,
          },
        },
      },
    });
  }, []);

  const createRoutine = useCallback(async (params: { name: string; notes?: string; exercises: Partial<RoutineExercise>[] }) => {
    const routineId = generateId();

    await db.transaction(async (tx) => {
      await tx.insert(schema.routines).values({
        id: routineId,
        name: params.name,
        notes: params.notes,
      });

      if (params.exercises.length > 0) {
        await tx.insert(schema.routineExercises).values(
          params.exercises.map((ex, idx: number) => ({
            id: generateId(),
            routineId,
            exerciseId: ex.exerciseId!,
            orderIndex: idx,
            targetSets: ex.targetSets || 3,
            targetReps: ex.targetReps || 10,
            supersetGroup: ex.supersetGroup || null,
          }))
        );
      }
    });

    return routineId;
  }, []);

  const deleteRoutine = useCallback(async (id: string) => {
    await db.delete(schema.routines).where(eq(schema.routines.id, id));
  }, []);

  const updateRoutine = useCallback(async (id: string, params: { name: string; notes?: string; exercises: Partial<RoutineExercise>[] }) => {
    await db.transaction(async (tx) => {
      await tx.update(schema.routines)
        .set({ name: params.name, notes: params.notes })
        .where(eq(schema.routines.id, id));

      await tx.delete(schema.routineExercises).where(eq(schema.routineExercises.routineId, id));

      if (params.exercises.length > 0) {
        await tx.insert(schema.routineExercises).values(
          params.exercises.map((ex, idx: number) => ({
            id: generateId(),
            routineId: id,
            exerciseId: ex.exerciseId!,
            orderIndex: idx,
            targetSets: ex.targetSets || 3,
            targetReps: ex.targetReps || 10,
            supersetGroup: ex.supersetGroup || null,
          }))
        );
      }
    });
  }, []);

  return {
    getRoutines,
    getRoutineById,
    createRoutine,
    deleteRoutine,
    updateRoutine,
  };
}
