import { useCallback } from 'react';
import { db } from '@/db/connection';
import * as schema from '@/db/schema';
import { eq, and, desc, sql, gte, between } from 'drizzle-orm';
import { RecordType } from '@kernel';
import { generateId } from '@/shared/lib/clientId';

export function useStatsDb() {
  const getExerciseStats = useCallback(async (exerciseId: string) => {
    return db.query.exerciseStats.findFirst({
      where: eq(schema.exerciseStats.exerciseId, exerciseId),
    });
  }, []);

  const getPersonalRecords = useCallback(async (exerciseId: string) => {
    return db.query.personalRecords.findMany({
      where: eq(schema.personalRecords.exerciseId, exerciseId),
      orderBy: [desc(schema.personalRecords.date)],
    });
  }, []);

  const getBestPersonalRecord = useCallback(async (exerciseId: string, recordType: RecordType) => {
    return db.query.personalRecords.findFirst({
      where: and(
        eq(schema.personalRecords.exerciseId, exerciseId),
        eq(schema.personalRecords.recordType, recordType)
      ),
      orderBy: [desc(schema.personalRecords.value)],
    });
  }, []);

  const getPRCountSince = useCallback(async (since: string) => {
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(schema.personalRecords)
      .where(gte(schema.personalRecords.date, since));
    return result[0]?.count ?? 0;
  }, []);

  const getDailyStats = useCallback(async (limit: number = 30) => {
    return db.query.dailyStats.findMany({
      limit,
      orderBy: [desc(schema.dailyStats.date)],
    });
  }, []);

  const logBodyWeight = useCallback(async (weight: number, notes?: string) => {
    const id = generateId();
    await db.insert(schema.bodyWeightLog).values({
      id,
      weight,
      notes,
      date: new Date().toISOString(),
    });
    return id;
  }, []);

  const getBodyWeightHistory = useCallback(async (startDate: string, endDate: string) => {
    return db.query.bodyWeightLog.findMany({
      where: between(schema.bodyWeightLog.date, startDate, endDate),
      orderBy: [desc(schema.bodyWeightLog.date)],
    });
  }, []);

  const updateBodyWeight = useCallback(async (id: string, weight: number, notes?: string) => {
    await db.update(schema.bodyWeightLog)
      .set({ weight, notes })
      .where(eq(schema.bodyWeightLog.id, id));
  }, []);

  const deleteBodyWeight = useCallback(async (id: string) => {
    await db.delete(schema.bodyWeightLog)
      .where(eq(schema.bodyWeightLog.id, id));
  }, []);

  const getWeeklyStats = useCallback(async (startDate: string, endDate: string) => {
    return db.query.dailyStats.findMany({
      where: between(schema.dailyStats.date, startDate, endDate),
      orderBy: [schema.dailyStats.date],
    });
  }, []);

  const getTrainingFrequency = useCallback(async (startDate: string, endDate: string) => {
    const stats = await db.query.dailyStats.findMany({
      where: between(schema.dailyStats.date, startDate, endDate),
    });
    return {
      daysTrained: stats.filter(s => s.workoutCount && s.workoutCount > 0).length,
      totalWorkouts: stats.reduce((acc, s) => acc + (s.workoutCount || 0), 0),
    };
  }, []);

  return {
    getExerciseStats,
    getPersonalRecords,
    getBestPersonalRecord,
    getPRCountSince,
    getDailyStats,
    logBodyWeight,
    getBodyWeightHistory,
    updateBodyWeight,
    deleteBodyWeight,
    getWeeklyStats,
    getTrainingFrequency,
  };
}
