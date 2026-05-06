import { useCallback } from 'react';
import { db } from '@/db/connection';
import * as schema from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { generateId } from '@/shared/lib/clientId';
import type { WorkoutExerciseState } from '@kernel';

export function useStatsProcessor() {
  const processWorkoutStats = useCallback(async (workoutId: string, exercises: WorkoutExerciseState[], durationSeconds: number) => {
    await db.transaction(async (tx) => {
      let sessionTotalVolume = 0;
      let sessionTotalReps = 0;
      let sessionTotalSets = 0;

      for (const ex of exercises) {
        const completedSets = ex.sets.filter(s => s.isCompleted);
        if (completedSets.length === 0) continue;

        let exVolume = 0;
        let exReps = 0;
        let maxWeight = 0;
        let max1RM = 0;
        let maxVolumeSet = 0;

        for (const set of completedSets) {
          const w = set.weight || 0;
          const r = set.reps || 0;
          const vol = w * r;
          
          // Fórmula de Epley: 1RM = Weight * (1 + Reps/30)
          const e1rm = r > 0 ? w * (1 + r / 30) : w;
          
          exVolume += vol;
          exReps += r;
          if (w > maxWeight) maxWeight = w;
          if (e1rm > max1RM) max1RM = e1rm;
          if (vol > maxVolumeSet) maxVolumeSet = vol;
        }

        sessionTotalVolume += exVolume;
        sessionTotalReps += exReps;
        sessionTotalSets += completedSets.length;

        const currentStats = await tx.query.exerciseStats.findFirst({
          where: eq(schema.exerciseStats.exerciseId, ex.exerciseId)
        });

        // 1. Guardar Récords Personales (si superan los max históricos del ejercicio)
        if (!currentStats || maxWeight > (currentStats.maxWeight || 0)) {
           await tx.insert(schema.personalRecords).values({
             id: generateId(),
             exerciseId: ex.exerciseId,
             recordType: 'max_weight',
             value: maxWeight,
             date: new Date().toISOString(),
           });
        }
        if (!currentStats || max1RM > (currentStats.estimated1rm || 0)) {
           await tx.insert(schema.personalRecords).values({
             id: generateId(),
             exerciseId: ex.exerciseId,
             recordType: 'estimated_1rm',
             value: max1RM,
             date: new Date().toISOString(),
           });
        }
        if (!currentStats || maxVolumeSet > (currentStats.maxVolume || 0)) {
           await tx.insert(schema.personalRecords).values({
             id: generateId(),
             exerciseId: ex.exerciseId,
             recordType: 'max_volume',
             value: maxVolumeSet,
             date: new Date().toISOString(),
           });
        }

        // 2. Actualizar las estadísticas acumuladas del ejercicio
        if (currentStats) {
          await tx.update(schema.exerciseStats).set({
            maxWeight: Math.max(currentStats.maxWeight || 0, maxWeight),
            estimated1rm: Math.max(currentStats.estimated1rm || 0, max1RM),
            maxVolume: Math.max(currentStats.maxVolume || 0, maxVolumeSet),
            totalSets: (currentStats.totalSets || 0) + completedSets.length,
            totalReps: (currentStats.totalReps || 0) + exReps,
            totalVolume: (currentStats.totalVolume || 0) + exVolume,
            lastPerformed: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }).where(eq(schema.exerciseStats.exerciseId, ex.exerciseId));
        } else {
          await tx.insert(schema.exerciseStats).values({
            exerciseId: ex.exerciseId,
            maxWeight,
            estimated1rm: max1RM,
            maxVolume: maxVolumeSet,
            totalSets: completedSets.length,
            totalReps: exReps,
            totalVolume: exVolume,
            lastPerformed: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }

        // 3. Actualizar la caché de cargas para sugerencias futuras
        const nextRecommendedWeight = maxWeight > 0 ? maxWeight + 2.5 : 0;
        
        await tx.insert(schema.exerciseLoadCache).values({
          exerciseId: ex.exerciseId,
          recommendedWeight: nextRecommendedWeight,
          basis: 'last_set',
          lastWeight: maxWeight,
          lastReps: exReps,
          sessionsAnalyzed: 1,
          updatedAt: new Date().toISOString(),
        }).onConflictDoUpdate({
          target: schema.exerciseLoadCache.exerciseId,
          set: {
            recommendedWeight: nextRecommendedWeight,
            lastWeight: maxWeight,
            lastReps: exReps,
            sessionsAnalyzed: sql`${schema.exerciseLoadCache.sessionsAnalyzed} + 1`,
            updatedAt: new Date().toISOString(),
          }
        });
      }

      // 4. Actualizar Estadísticas Diarias
      if (sessionTotalSets > 0) {
        const todayDate = new Date().toISOString().split('T')[0];
        const currentDaily = await tx.query.dailyStats.findFirst({
           where: eq(schema.dailyStats.date, todayDate)
        });

        if (currentDaily) {
          await tx.update(schema.dailyStats).set({
            totalVolume: (currentDaily.totalVolume || 0) + sessionTotalVolume,
            totalSets: (currentDaily.totalSets || 0) + sessionTotalSets,
            totalReps: (currentDaily.totalReps || 0) + sessionTotalReps,
            workoutCount: (currentDaily.workoutCount || 0) + 1,
            totalDuration: (currentDaily.totalDuration || 0) + durationSeconds,
          }).where(eq(schema.dailyStats.date, todayDate));
        } else {
          await tx.insert(schema.dailyStats).values({
             date: todayDate,
             totalVolume: sessionTotalVolume,
             totalSets: sessionTotalSets,
             totalReps: sessionTotalReps,
             workoutCount: 1,
             totalDuration: durationSeconds,
          });
        }
      }
    });
  }, []);

  return { processWorkoutStats };
}
