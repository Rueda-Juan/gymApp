import type { WorkoutRepository } from '@entities/workout';
import type { StatsRepository } from '@entities/stats';
import type { ExerciseRepository } from '@entities/exercise';
import type { ExerciseLoadCacheRepository } from '@entities/exercise';
import type { PlateRounder } from '../utils/plate-rounder';
import { createLogger } from '@core/logger/Logger';
import { filterOutliers } from '@core/utils/math';

const log = createLogger('SuggestWeight');

export interface WeightSuggestion {
  suggestedWeight: number;
  basis: 'progressive_overload' | 'last_set' | 'deload' | 'failure_recovery' | 'default';
  lastWeight: number | null;
  lastReps: number | null;
  message?: string;
}

export interface PlateConfig {
  availablePlates: number[];
  barWeight: number;
}

/**
 * SuggestWeight use case — recommends weight for the next set.
 *
 * Algorithm based on Double Progression:
 * 1. Find recent history for this exercise.
 * 2. If no history -> return default (weight=0).
 * 3. Evaluate stagnation -> If last 3 sessions had no improvement, suggest Deload.
 * 4. Evaluate failure -> If last session missed minimum reps, suggest slightly lower weight.
 * 5. Progressive Overload -> If last session hit max reps on all sets (or RIR > 4), suggest weight increment.
 * 6. Otherwise -> Keep same weight, try to hit more reps (Double Progression).
 */
export class SuggestWeightUseCase {
  constructor(
    private readonly workoutRepo: WorkoutRepository,
    private readonly statsRepo: StatsRepository,
    private readonly exerciseRepo: ExerciseRepository,
    private readonly loadCacheRepo: ExerciseLoadCacheRepository,
    private readonly plateRounder: PlateRounder,
  ) {}

  async execute(
    exerciseId: string,
    minReps: number = 8,
    maxReps: number = 12,
    plateConfig?: PlateConfig,
  ): Promise<WeightSuggestion> {
    const defaultSuggestion: WeightSuggestion = {
      suggestedWeight: 0,
      basis: 'default',
      lastWeight: null,
      lastReps: null,
    };

    // 1. Get exercise details
    const exercise = await this.exerciseRepo.getById(exerciseId);
    if (!exercise) {
      log.warn('Exercise not found for weight suggestion', { exerciseId });
      return defaultSuggestion;
    }

    // 2. Bodyweight/timed bypass — no weight to suggest
    const isBodweightType = exercise.loadType === 'bodyweight' || exercise.loadType === 'timed';
    if (isBodweightType) {
      return { suggestedWeight: 0, basis: 'default', lastWeight: null, lastReps: null };
    }

    // 3. Cache hit — return immediately if fresh
    const cached = await this.loadCacheRepo.get(exerciseId);
    if (cached) {
      log.debug('Cache hit for weight suggestion', { exerciseId });
      const weight = plateConfig
        ? this.plateRounder.round(cached.recommendedWeight, plateConfig.availablePlates, plateConfig.barWeight)
        : cached.recommendedWeight;
      return {
        suggestedWeight: weight,
        basis: cached.basis,
        lastWeight: cached.lastWeight,
        lastReps: cached.lastReps,
      };
    }

    const weightIncrement = exercise.weightIncrement;

    // 4. Look at the last 10 workouts to find up to 3 valid recent sessions for this exercise
    const recentWorkouts = await this.workoutRepo.getRecent(10);
    const validSessions = [];

    for (const workout of recentWorkouts) {
      const we = workout.exercises.find((e) => e.exerciseId === exerciseId && !e.skipped);
      if (!we) continue;

      const completedSets = we.sets.filter((s) => s.completed && !s.skipped && s.weight > 0 && s.reps > 0);
      if (completedSets.length === 0) continue;

      // 5. Outlier filter — discard sets deviating more than 3σ from the median weight
      const filteredSets = filterOutliers(completedSets);
      if (filteredSets.length === 0) continue;

      validSessions.push({
        workoutDate: workout.date,
        sets: filteredSets,
        maxWeight: Math.max(...filteredSets.map((s) => s.weight)),
        totalVolume: filteredSets.reduce((sum, s) => sum + s.weight * s.reps, 0),
        allHitMax: filteredSets.every((s) => s.reps >= maxReps),
        anyFailedMin: filteredSets.some((s) => s.reps < minReps),
        allHighRIR: filteredSets.every((s) => s.rir !== null && s.rir > 4),
      });

      if (validSessions.length === 3) break; // We only need up to 3 sessions for stagnation detection
    }

    // No history -> default
    if (validSessions.length === 0) {
      log.debug('No valid history found', { exerciseId });
      return defaultSuggestion;
    }

    const lastSession = validSessions[0]!;
    const lastSets = lastSession.sets;
    const lastSet = lastSets[lastSets.length - 1]!; // The very last set completed
    const lastWeight = lastSet.weight;
    const lastReps = lastSet.reps;

    // 3. Check for Stagnation (Deload)
    // If we have 3 sessions, and weight hasn't gone up AND volume hasn't gone up over those 3 sessions.
    if (validSessions.length === 3) {
      const [s1, s2, s3] = validSessions as [typeof lastSession, typeof lastSession, typeof lastSession];
      
      // Are we stuck on the exact same max weight for 3 sessions?
      const stuckWeight = s1.maxWeight === s2.maxWeight && s2.maxWeight === s3.maxWeight;
      
      // Is our volume flat or decreasing? (no extra reps added)
      const noVolumeProgress = s1.totalVolume <= s2.totalVolume && s2.totalVolume <= s3.totalVolume;

      if (stuckWeight && noVolumeProgress) {
        log.info('Stagnation detected (3 sessions). Suggesting deload.', { exerciseId });
        let deloadWeight = lastWeight * 0.85;
        deloadWeight = Math.round(deloadWeight / 2.5) * 2.5;

        const deloadResult: WeightSuggestion = {
          suggestedWeight: Math.max(0, deloadWeight),
          basis: 'deload',
          lastWeight,
          lastReps,
          message: 'Estancamiento detectado. Recomendamos una descarga (deload) para recuperar.',
        };
        await this.saveToCache(exerciseId, deloadResult, validSessions.length);
        return this.applyPlateRoundingIfNeeded(deloadResult, plateConfig);
      }
    }

    // 4. Check for Failure (Too heavy)
    if (lastSession.anyFailedMin) {
      log.info('Failed minimum reps last session. Suggesting slight reduction.', { exerciseId });
      const failureResult: WeightSuggestion = {
        suggestedWeight: Math.max(0, lastWeight - weightIncrement),
        basis: 'failure_recovery',
        lastWeight,
        lastReps,
        message: 'No alcanzaste el mínimo de repeticiones. Intenta bajar un poco el peso.',
      };
      await this.saveToCache(exerciseId, failureResult, validSessions.length);
      return this.applyPlateRoundingIfNeeded(failureResult, plateConfig);
    }

    // 5. Progressive Overload (Increase weight)
    // If they hit max reps across ALL sets, OR if they felt it was way too easy (RIR > 4 on all sets)
    if (lastSession.allHitMax || lastSession.allHighRIR) {
      const newWeight = lastWeight + weightIncrement;
      log.info('Progressive overload earned!', { exerciseId, old: lastWeight, new: newWeight });
      const overloadResult: WeightSuggestion = {
        suggestedWeight: newWeight,
        basis: 'progressive_overload',
        lastWeight,
        lastReps,
      };
      await this.saveToCache(exerciseId, overloadResult, validSessions.length);
      return this.applyPlateRoundingIfNeeded(overloadResult, plateConfig);
    }

    // 6. Double Progression (Keep same weight, try to add reps)
    log.debug('Double progression: keeping same weight to build reps.', { exerciseId, lastWeight });
    const doubleProgressionResult: WeightSuggestion = {
      suggestedWeight: lastWeight,
      basis: 'last_set',
      lastWeight,
      lastReps,
    };

    await this.saveToCache(exerciseId, doubleProgressionResult, validSessions.length);
    return this.applyPlateRoundingIfNeeded(doubleProgressionResult, plateConfig);
  }

  private async saveToCache(
    exerciseId: string,
    result: WeightSuggestion,
    sessionsAnalyzed: number,
  ): Promise<void> {
    try {
      await this.loadCacheRepo.upsert({
        exerciseId,
        recommendedWeight: result.suggestedWeight,
        basis: result.basis,
        lastWeight: result.lastWeight,
        lastReps: result.lastReps,
        sessionsAnalyzed,
        updatedAt: new Date(),
      });
    } catch {
      // Non-critical — cache write failure should not break the use case
      log.warn('Failed to write weight suggestion to cache', { exerciseId });
    }
  }

  private applyPlateRoundingIfNeeded(
    suggestion: WeightSuggestion,
    plateConfig?: PlateConfig,
  ): WeightSuggestion {
    if (!plateConfig || suggestion.suggestedWeight === 0) return suggestion;
    const rounded = this.plateRounder.round(
      suggestion.suggestedWeight,
      plateConfig.availablePlates,
      plateConfig.barWeight,
    );
    return { ...suggestion, suggestedWeight: rounded };
  }
}
