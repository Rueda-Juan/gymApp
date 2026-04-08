import type * as SQLite from 'expo-sqlite';
import type { WorkoutSet } from '../../../domain/entities/WorkoutSet';
import type { WorkoutRepository } from '../../../domain/repositories/WorkoutRepository';
import type { StatsRepository } from '../../../domain/repositories/StatsRepository';
import type { ExerciseLoadCacheRepository } from '../../../domain/repositories/ExerciseLoadCacheRepository';
import { validateSetInput } from '../../../shared/schemas/workoutSchemas';
import { generateId } from '../../../shared/utils/generateId';
import { toSQLiteDate } from '../../../shared/utils/dateUtils';
import { createLogger } from '../../../shared/utils/Logger';
import {
  computeUpdatedExerciseStats,
  detectBrokenRecords,
  calculateSetVolume,
} from '../../services/StatsCalculator';

const log = createLogger('RecordSet');

/**
 * RecordSet use case — records a completed set and updates all related stats.
 * All database operations run inside a single transaction for atomicity.
 */
export class RecordSetUseCase {
  constructor(
    private readonly workoutRepo: WorkoutRepository,
    private readonly statsRepo: StatsRepository,
    private readonly db: SQLite.SQLiteDatabase,
    private readonly loadCacheRepo: ExerciseLoadCacheRepository,
  ) {}

  /**
   * Validates input, records a set, and atomically updates:
   * - sets table
   * - exercise_stats
   * - personal_records (if PR broken)
   * - daily_stats
   *
   * @param workoutId - ID of the active workout.
   * @param input - Raw set data to validate (weight, reps, etc.).
   * @returns The recorded WorkoutSet and any broken personal records.
   */
  async execute(
    workoutId: string,
    input: unknown,
  ): Promise<{ set: WorkoutSet; newRecords: Array<{ recordType: string; value: number }> }> {
    // 1. Validate with Zod (before transaction)
    const data = validateSetInput(input);

    // 2. Create set entity
    const now = new Date();
    if (!data.exerciseId) throw new Error('Exercise ID is required to record a set');
    const set: WorkoutSet = {
      id: generateId(),
      ...data,
      exerciseId: data.exerciseId,
      setNumber: data.setNumber ?? 1,
      weight: data.weight ?? 0,
      reps: data.reps ?? 0,
      setType: data.setType ?? 'normal',
      durationSeconds: data.durationSeconds ?? 0,
      completed: data.completed ?? true,
      skipped: data.skipped ?? false,
      restSeconds: data.restSeconds ?? null,
      rir: data.rir ?? null,
      createdAt: now,
    };

    let brokenRecords: Array<{ recordType: 'max_weight' | 'max_reps' | 'max_volume' | 'estimated_1rm'; value: number }> = [];

    // 3. Execute everything in a single atomic transaction
    await this.db.withTransactionAsync(async () => {
      log.info('Recording set', { workoutId, exerciseId: set.exerciseId, weight: set.weight, reps: set.reps });

      // 3a. Save set to workout
      await this.workoutRepo.addSet(workoutId, set.exerciseId, set);

      // 3b. Update exercise stats
      const currentStats = await this.statsRepo.getExerciseStats(set.exerciseId);
      const updatedStats = computeUpdatedExerciseStats(currentStats, set.exerciseId, set);
      await this.statsRepo.updateExerciseStats(updatedStats);

      // 3c. Detect and save broken personal records
      brokenRecords = detectBrokenRecords(currentStats, set);
      for (const record of brokenRecords) {
        await this.statsRepo.savePersonalRecord({
          id: generateId(),
          exerciseId: set.exerciseId,
          recordType: record.recordType,
          value: record.value,
          setId: set.id,
          date: now,
        });
        log.info('New PR!', { type: record.recordType, value: record.value });
      }

      // 3d. Update daily stats
      const dateStr = toSQLiteDate(now);
      const currentDailyStats = await this.statsRepo.getDailyStats(dateStr);
      const setVolume = calculateSetVolume(set.weight, set.reps);

      await this.statsRepo.upsertDailyStats({
        date: dateStr,
        totalVolume: (currentDailyStats?.totalVolume ?? 0) + setVolume,
        totalSets: (currentDailyStats?.totalSets ?? 0) + 1,
        totalReps: (currentDailyStats?.totalReps ?? 0) + set.reps,
        workoutCount: currentDailyStats?.workoutCount ?? 1,
        totalDuration: currentDailyStats?.totalDuration ?? 0,
      });
    });

    log.info('Set recorded successfully', { setId: set.id });
    await this.loadCacheRepo.invalidate(set.exerciseId);
    return { set, newRecords: brokenRecords };
  }
}
