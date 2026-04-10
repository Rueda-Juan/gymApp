import type * as SQLite from 'expo-sqlite';
import type { WorkoutExercise } from '../../../domain/entities/Workout';
import type { WorkoutSet } from '../../../domain/entities/WorkoutSet';
import type { ExerciseStats } from '../../../domain/entities/ExerciseStats';
import type { WorkoutRepository } from '../../../domain/repositories/WorkoutRepository';
import type { StatsRepository } from '../../../domain/repositories/StatsRepository';
import type { RecordType } from '../../../domain/entities/PersonalRecord';
import { NotFoundError } from '../../../shared/errors';
import { generateId } from '../../../shared/utils/generateId';
import { toSQLiteDate } from '../../../shared/utils/dateUtils';
import { createLogger } from '../../../shared/utils/Logger';
import {
  computeUpdatedExerciseStats,
  detectBrokenRecords,
  calculateSetVolume,
} from '../../services/StatsCalculator';

const log = createLogger('RecordAllSets');

export interface NewPersonalRecord {
  exerciseId: string;
  recordType: RecordType;
  value: number;
}

export interface RecordAllSetsResult {
  newRecords: NewPersonalRecord[];
}

interface ExerciseProcessResult {
  volume: number;
  reps: number;
  setsCount: number;
  newRecords: NewPersonalRecord[];
}

/**
 * RecordAllSetsUseCase — batch-persists all completed sets at workout finish.
 *
 * All writes (sets + exercise_stats + personal_records + daily_stats) run
 * inside a single atomic SQLite transaction to prevent partial state.
 */
export class RecordAllSetsUseCase {
  constructor(
    private readonly workoutRepo: WorkoutRepository,
    private readonly statsRepo: StatsRepository,
    private readonly db: SQLite.SQLiteDatabase,
  ) {}

  async execute(
    workoutId: string,
    exercises: WorkoutExercise[],
  ): Promise<RecordAllSetsResult> {
    const workout = await this.workoutRepo.getById(workoutId);
    if (!workout) {
      throw new NotFoundError(`Workout ${workoutId} no encontrado`);
    }

    const totalCompletedSets = exercises.reduce(
      (acc, ex) => acc + ex.sets.filter((s) => s.completed && s.reps > 0).length,
      0,
    );

    if (totalCompletedSets === 0) {
      return { newRecords: [] };
    }

    const allNewRecords: NewPersonalRecord[] = [];
    const now = new Date();
    const dateStr = toSQLiteDate(now);

    await this.db.withTransactionAsync(async () => {
      let sessionTotalVolume = 0;
      let sessionTotalReps = 0;
      let sessionTotalSets = 0;

      for (const exercise of exercises) {
        const result = await this.processExerciseSets(workoutId, exercise, now);
        
        sessionTotalVolume += result.volume;
        sessionTotalReps += result.reps;
        sessionTotalSets += result.setsCount;
        allNewRecords.push(...result.newRecords);
      }

      // Update Daily Stats Daily Accumulator
      const currentDailyStats = await this.statsRepo.getDailyStats(dateStr);
      await this.statsRepo.upsertDailyStats({
        date: dateStr,
        totalVolume: (currentDailyStats?.totalVolume ?? 0) + sessionTotalVolume,
        totalSets: (currentDailyStats?.totalSets ?? 0) + sessionTotalSets,
        totalReps: (currentDailyStats?.totalReps ?? 0) + sessionTotalReps,
        workoutCount: (currentDailyStats?.workoutCount ?? 0) + 1,
        totalDuration: currentDailyStats?.totalDuration ?? 0,
      });
    });

    log.info('RecordAllSets completed', {
      workoutId,
      exerciseCount: exercises.length,
      totalSets: totalCompletedSets,
      newRecords: allNewRecords.length,
    });

    return { newRecords: allNewRecords };
  }

  private async processExerciseSets(
    workoutId: string,
    exercise: WorkoutExercise,
    now: Date,
  ): Promise<ExerciseProcessResult> {
    const exerciseCompletedSets = exercise.sets.filter(
      (s) => s.completed && s.reps > 0,
    );

    const result: ExerciseProcessResult = {
      volume: 0,
      reps: 0,
      setsCount: 0,
      newRecords: [],
    };

    if (exerciseCompletedSets.length === 0) return result;

    const existingStats = await this.statsRepo.getExerciseStats(exercise.exerciseId);
    let rollingStats: ExerciseStats | null = existingStats;

    for (const set of exerciseCompletedSets) {
      const setWithId: WorkoutSet = {
        ...set,
        id: set.id || generateId(),
        createdAt: set.createdAt ?? now,
      };

      await this.workoutRepo.addSet(workoutId, exercise.exerciseId, setWithId);

      // Evaluate PRs
      const brokenRecords = detectBrokenRecords(rollingStats, setWithId);
      for (const record of brokenRecords) {
        await this.statsRepo.savePersonalRecord({
          id: generateId(),
          exerciseId: exercise.exerciseId,
          recordType: record.recordType,
          value: record.value,
          setId: setWithId.id,
          date: now,
        });
        result.newRecords.push({
          exerciseId: exercise.exerciseId,
          recordType: record.recordType,
          value: record.value,
        });
      }

      // Roll up stats
      rollingStats = computeUpdatedExerciseStats(rollingStats, exercise.exerciseId, setWithId);
      result.volume += calculateSetVolume(setWithId.weight, setWithId.reps);
      result.reps += setWithId.reps;
      result.setsCount += 1;
    }

    await this.statsRepo.updateExerciseStats(rollingStats!);
    return result;
  }
}
