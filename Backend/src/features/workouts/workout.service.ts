import type { WorkoutRepository } from './workout.repository';
import type { RoutineRepository } from '../routines/routine.repository';
import type { StatsRepository } from '../stats/stats.repository';
import type { ExerciseLoadCacheRepository } from '../exercises/exercise-load-cache.repository';
import type * as SQLite from 'expo-sqlite';
import type { Workout } from './workout.entity';
import type { WorkoutExercise } from './workout-exercise.entity';
import type { WorkoutSet } from './workout-set.entity';
import type { ExerciseStats } from '../stats/exercise-stats.entity';
import type { RecordType } from '../stats/personal-record.entity';
import { NotFoundError } from '../../core/errors/errors';
import { generateId } from '../../core/utils/generate-id';
import { toSQLiteDate } from '../../core/utils/date';
import { validateSetInput } from './workout.schemas';
import { createLogger } from '../../core/logger/Logger';
import {
  computeUpdatedExerciseStats,
  detectBrokenRecords,
  calculateSetVolume,
} from '../stats/utils/stats-calculator';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface NewPersonalRecord {
  exerciseId: string;
  recordType: RecordType;
  value: number;
}

export interface RecordAllSetsResult {
  newRecords: NewPersonalRecord[];
}

export interface UpdateWorkoutExerciseInput {
  workoutId: string;
  workoutExerciseId: string;
  notes?: string;
}

interface ExerciseProcessResult {
  volume: number;
  reps: number;
  setsCount: number;
  newRecords: NewPersonalRecord[];
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

const log = createLogger('WorkoutService');

export class WorkoutService {
  constructor(
    private readonly workoutRepo: WorkoutRepository,
    private readonly statsRepo: StatsRepository,
    private readonly loadCacheRepo: ExerciseLoadCacheRepository,
    private readonly routineRepo: RoutineRepository,
    private readonly db: SQLite.SQLiteDatabase,
  ) {}

  // ── Create ────────────────────────────────────────────────────────────────

  /**
   * Creates a new workout from an existing routine or empty.
   * @param routineId - ID of the routine to base the workout on, or null for empty.
   * @returns The newly created Workout.
   */
  async startWorkout(routineId: string | null): Promise<Workout> {
    let exercises: WorkoutExercise[] = [];

    if (routineId) {
      const routine = await this.routineRepo.getById(routineId);
      if (!routine) {
        throw new NotFoundError(`Routine ${routineId} no encontrada`);
      }
      exercises = routine.exercises.map((re) => ({
        id: generateId(),
        exerciseId: re.exerciseId,
        orderIndex: re.orderIndex,
        skipped: false,
        notes: null,
        supersetGroup: re.supersetGroup ?? null,
        sets: [],
      }));
    }

    const workout: Workout = {
      id: generateId(),
      routineId,
      date: new Date(),
      durationSeconds: 0,
      notes: null,
      exercises,
    };

    await this.workoutRepo.save(workout);
    return workout;
  }

  // ── Read ──────────────────────────────────────────────────────────────────

  async getWorkoutById(id: string): Promise<Workout | null> {
    return this.workoutRepo.getById(id);
  }

  async getWorkoutHistory(limit: number = 10): Promise<Workout[]> {
    return this.workoutRepo.getRecent(limit);
  }

  // ── Update ────────────────────────────────────────────────────────────────

  /**
   * Finishes an active workout by computing the elapsed duration.
   * @param workoutId - ID of the workout to finish.
   * @returns The finished Workout with computed durationSeconds.
   */
  async finishWorkout(workoutId: string): Promise<Workout> {
    const workout = await this.workoutRepo.getById(workoutId);
    if (!workout) {
      throw new NotFoundError(`Workout ${workoutId} no encontrado`);
    }

    const durationSeconds = Math.floor(
      (Date.now() - workout.date.getTime()) / 1000,
    );

    const finishedWorkout: Workout = {
      ...workout,
      durationSeconds,
    };

    await this.workoutRepo.save(finishedWorkout);
    await this.loadCacheRepo.invalidateAll();
    return finishedWorkout;
  }

  async addExerciseToWorkout(workoutId: string, exerciseId: string): Promise<void> {
    const workout = await this.workoutRepo.getById(workoutId);
    if (!workout) {
      throw new NotFoundError(`Workout con ID ${workoutId} no encontrado`);
    }

    const newOrderIndex =
      workout.exercises.length > 0
        ? Math.max(...workout.exercises.map((e) => e.orderIndex)) + 1
        : 0;

    await this.workoutRepo.addExercise(workoutId, {
      id: generateId(),
      exerciseId,
      orderIndex: newOrderIndex,
      skipped: false,
      notes: null,
      supersetGroup: null,
      sets: [],
    });
  }

  async reorderWorkoutExercises(workoutId: string, exerciseIds: string[]): Promise<void> {
    const workout = await this.workoutRepo.getById(workoutId);
    if (!workout) {
      throw new NotFoundError(`Workout con ID ${workoutId} no encontrado`);
    }

    await this.workoutRepo.reorderExercises(workoutId, exerciseIds);
  }

  async skipExercise(workoutId: string, exerciseId: string): Promise<void> {
    await this.workoutRepo.markExerciseSkipped(workoutId, exerciseId, true);
  }

  async updateWorkoutExercise(params: UpdateWorkoutExerciseInput): Promise<void> {
    const workout = await this.workoutRepo.getById(params.workoutId);
    if (!workout) {
      throw new NotFoundError(`Workout con ID ${params.workoutId} no encontrado`);
    }

    const workoutExercise = workout.exercises.find((ex) => ex.id === params.workoutExerciseId);
    if (!workoutExercise) {
      throw new NotFoundError(
        `Exercise con ID ${params.workoutExerciseId} no encontrado en workout ${params.workoutId}`,
      );
    }

    if (params.notes !== undefined) {
      await this.workoutRepo.updateExerciseNotes(
        params.workoutId,
        params.workoutExerciseId,
        params.notes,
      );
    }
  }

  // ── Sets ──────────────────────────────────────────────────────────────────

  /**
   * Validates input, records a set, and atomically updates:
   * - sets table
   * - exercise_stats
   * - personal_records (if PR broken)
   * - daily_stats
   */
  async recordSet(
    workoutId: string,
    input: unknown,
  ): Promise<{ set: WorkoutSet; newRecords: Array<{ recordType: string; value: number }> }> {
    const data = validateSetInput(input);

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
      partialReps: data.partialReps ?? null,
      createdAt: now,
    };

    let brokenRecords: Array<{
      recordType: 'max_weight' | 'max_reps' | 'max_volume' | 'estimated_1rm';
      value: number;
    }> = [];

    await this.db.withTransactionAsync(async () => {
      log.info('Recording set', {
        workoutId,
        exerciseId: set.exerciseId,
        weight: set.weight,
        reps: set.reps,
      });

      await this.workoutRepo.addSet(workoutId, set.exerciseId, set);

      const currentStats = await this.statsRepo.getExerciseStats(set.exerciseId);
      const updatedStats = computeUpdatedExerciseStats(currentStats, set.exerciseId, set);
      await this.statsRepo.updateExerciseStats(updatedStats);

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

  async updateSet(workoutId: string, dateStr: string, set: WorkoutSet): Promise<void> {
    await this.workoutRepo.updateSet(workoutId, set);
    await this.statsRepo.recalculateExerciseStats(set.exerciseId);
    await this.statsRepo.recalculateDailyStats(dateStr);
    await this.loadCacheRepo.invalidate(set.exerciseId);
  }

  async deleteSet(
    workoutId: string,
    setId: string,
    exerciseId: string,
    dateStr: string,
  ): Promise<void> {
    await this.workoutRepo.deleteSet(workoutId, setId);
    await this.statsRepo.recalculateExerciseStats(exerciseId);
    await this.statsRepo.recalculateDailyStats(dateStr);
    await this.loadCacheRepo.invalidate(exerciseId);
  }

  /**
   * Batch-persists all completed sets at workout finish.
   * All writes run inside a single atomic SQLite transaction.
   */
  async recordAllSets(
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
        const result = await this._processExerciseSets(workoutId, exercise, now);

        sessionTotalVolume += result.volume;
        sessionTotalReps += result.reps;
        sessionTotalSets += result.setsCount;
        allNewRecords.push(...result.newRecords);
      }

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

  // ── Delete ────────────────────────────────────────────────────────────────

  async deleteWorkoutExercise(workoutId: string, workoutExerciseId: string): Promise<void> {
    const workout = await this.workoutRepo.getById(workoutId);
    if (!workout) {
      throw new NotFoundError(`Workout con ID ${workoutId} no encontrado`);
    }

    const workoutExercise = workout.exercises.find((ex) => ex.id === workoutExerciseId);
    if (!workoutExercise) {
      throw new NotFoundError(
        `Exercise con ID ${workoutExerciseId} no encontrado en workout ${workoutId}`,
      );
    }

    const exerciseId = workoutExercise.exerciseId;
    const dateStr = workout.date.toISOString().split('T')[0] ?? '';

    await this.workoutRepo.deleteExercise(workoutId, workoutExerciseId);
    await this.statsRepo.recalculateExerciseStats(exerciseId);
    await this.statsRepo.recalculateDailyStats(dateStr);
  }

  async deleteWorkout(id: string): Promise<void> {
    const workout = await this.workoutRepo.getById(id);
    if (!workout) {
      throw new NotFoundError(`Workout con ID ${id} no encontrado`);
    }

    await this.db.withTransactionAsync(async () => {
      await this.workoutRepo.delete(id);

      const uniqueExerciseIds = new Set(workout.exercises.map((e) => e.exerciseId));
      for (const exerciseId of uniqueExerciseIds) {
        await this.statsRepo.recalculateExerciseStats(exerciseId);
      }

      const dateStr = toSQLiteDate(workout.date);
      await this.statsRepo.recalculateDailyStats(dateStr);
    });
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private async _processExerciseSets(
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

      rollingStats = computeUpdatedExerciseStats(rollingStats, exercise.exerciseId, setWithId);
      result.volume += calculateSetVolume(setWithId.weight, setWithId.reps);
      result.reps += setWithId.reps;
      result.setsCount += 1;
    }

    await this.statsRepo.updateExerciseStats(rollingStats!);
    return result;
  }
}
