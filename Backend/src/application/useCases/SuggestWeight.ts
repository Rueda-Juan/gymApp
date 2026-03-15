import type { WorkoutRepository } from '../../domain/repositories/WorkoutRepository';
import type { StatsRepository } from '../../domain/repositories/StatsRepository';
import type { ExerciseRepository } from '../../domain/repositories/ExerciseRepository';
import { createLogger } from '../../shared/utils/Logger';

const log = createLogger('SuggestWeight');

interface WeightSuggestion {
  suggestedWeight: number;
  basis: 'progressive_overload' | 'last_set' | 'deload' | 'failure_recovery' | 'default';
  lastWeight: number | null;
  lastReps: number | null;
  message?: string;
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
  ) {}

  async execute(exerciseId: string, minReps: number, maxReps: number): Promise<WeightSuggestion> {
    const defaultSuggestion: WeightSuggestion = {
      suggestedWeight: 0,
      basis: 'default',
      lastWeight: null,
      lastReps: null,
    };

    // 1. Get exercise details to find the correct weight increment
    const exercise = await this.exerciseRepo.getById(exerciseId);
    if (!exercise) {
      log.warn('Exercise not found for weight suggestion', { exerciseId });
      return defaultSuggestion;
    }
    const weightIncrement = exercise.weightIncrement;

    // 2. Look at the last 10 workouts to find up to 3 valid recent sessions for this exercise
    const recentWorkouts = await this.workoutRepo.getRecent(10);
    const validSessions = [];

    for (const workout of recentWorkouts) {
      const we = workout.exercises.find((e) => e.exerciseId === exerciseId && !e.skipped);
      if (!we) continue;

      const completedSets = we.sets.filter((s) => s.completed && !s.skipped);
      if (completedSets.length === 0) continue;

      validSessions.push({
        workoutDate: workout.date,
        sets: completedSets,
        maxWeight: Math.max(...completedSets.map((s) => s.weight)),
        totalVolume: completedSets.reduce((sum, s) => sum + s.weight * s.reps, 0),
        allHitMax: completedSets.every((s) => s.reps >= maxReps),
        anyFailedMin: completedSets.some((s) => s.reps < minReps),
        allHighRIR: completedSets.every((s) => s.rir !== null && s.rir > 4),
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
        // Deload: reduce weight by ~15% (rounded to nearest 2.5)
        let deloadWeight = lastWeight * 0.85;
        deloadWeight = Math.round(deloadWeight / 2.5) * 2.5;

        return {
          suggestedWeight: Math.max(0, deloadWeight),
          basis: 'deload',
          lastWeight,
          lastReps,
          message: 'Estancamiento detectado. Recomendamos una descarga (deload) para recuperar.',
        };
      }
    }

    // 4. Check for Failure (Too heavy)
    if (lastSession.anyFailedMin) {
      log.info('Failed minimum reps last session. Suggesting slight reduction.', { exerciseId });
      return {
        suggestedWeight: Math.max(0, lastWeight - weightIncrement),
        basis: 'failure_recovery',
        lastWeight,
        lastReps,
        message: 'No alcanzaste el mínimo de repeticiones. Intenta bajar un poco el peso.',
      };
    }

    // 5. Progressive Overload (Increase weight)
    // If they hit max reps across ALL sets, OR if they felt it was way too easy (RIR > 4 on all sets)
    if (lastSession.allHitMax || lastSession.allHighRIR) {
      const newWeight = lastWeight + weightIncrement;
      log.info('Progressive overload earned!', { exerciseId, old: lastWeight, new: newWeight });
      return {
        suggestedWeight: newWeight,
        basis: 'progressive_overload',
        lastWeight,
        lastReps,
      };
    }

    // 6. Double Progression (Keep same weight, try to add reps)
    log.debug('Double progression: keeping same weight to build reps.', { exerciseId, lastWeight });
    return {
      suggestedWeight: lastWeight,
      basis: 'last_set',
      lastWeight,
      lastReps,
    };
  }
}
