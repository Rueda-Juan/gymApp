import type { WorkoutRepository } from '../../../domain/repositories/WorkoutRepository';
import type { StatsRepository } from '../../../domain/repositories/StatsRepository';
import type { ExerciseRepository } from '../../../domain/repositories/ExerciseRepository';
import type { SessionContext, ActivationLevel } from '../../../domain/valueObjects/SessionContext';
import { createLogger } from '../../../shared/utils/Logger';

const log = createLogger('SuggestWeight');

export interface WeightSuggestion {
  suggestedWeight: number;
  basis: 'progressive_overload' | 'last_set' | 'deload' | 'failure_recovery' | 'default';
  lastWeight: number | null;
  lastReps: number | null;
  message?: string;
}

// ─── Warmup Types ──────────────────────────────────────────────

/**
 * Warmup styles:
 * - standard:  Hypertrophy focus — lubricación articular, 8-12 reps
 * - heavy:     Strength/Powerlifting — singles, CNS preparation
 * - ramp:      Dynamic activation — includes mobility drills
 */
export type WarmupStyle = 'standard' | 'heavy' | 'ramp';

export interface WarmupSet {
  setNumber: number;
  weight: number;
  reps: number;
  percentage: number;
  label: string;
  restSeconds: number;
}

export interface WarmupSuggestion {
  warmupSets: WarmupSet[];
  warmupStyle: WarmupStyle;
  targetWeight: number;
  activationState: ActivationLevel;
  recommendation: string;
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

  async execute(exerciseId: string, minReps: number = 8, maxReps: number = 12): Promise<WeightSuggestion> {
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

  // ─── Warmup Suggestion ──────────────────────────────────────

  /**
   * Suggests warmup sets for a given exercise based on:
   * 1. The exercise's muscle activation state from the session context
   * 2. The user's preferred warmup style
   * 3. The target working weight
   *
   * After generating suggestions, it updates the session context
   * to mark muscles as activated.
   */
  async suggestWarmup(
    exerciseId: string,
    sessionContext: SessionContext,
    warmupStyle: WarmupStyle = 'standard',
    targetWeight?: number,
  ): Promise<WarmupSuggestion> {
    // 1. Get exercise details
    const exercise = await this.exerciseRepo.getById(exerciseId);
    if (!exercise) {
      log.warn('Exercise not found for warmup suggestion', { exerciseId });
      return {
        warmupSets: [],
        warmupStyle,
        targetWeight: 0,
        activationState: 'cold',
        recommendation: 'Ejercicio no encontrado.',
      };
    }

    // 2. Determine target weight (from param or from execute)
    let workingWeight = targetWeight ?? 0;
    if (!targetWeight) {
      const suggestion = await this.execute(exerciseId);
      workingWeight = suggestion.suggestedWeight;
    }

    // 3. Check muscle activation state
    const activationState = sessionContext.getColdestState(exercise.primaryMuscles);
    log.debug('Warmup evaluation', {
      exerciseId,
      muscles: exercise.primaryMuscles,
      activationState,
      warmupStyle,
      workingWeight,
    });

    // 4. Generate warmup sets based on style × activation state
    const warmupSets = this.generateWarmupSets(
      workingWeight,
      exercise.weightIncrement,
      warmupStyle,
      activationState,
    );

    // 5. Update session context with worked muscles
    sessionContext.markAsPrimary(exercise.primaryMuscles);
    sessionContext.markAsSecondary(exercise.secondaryMuscles);

    // 6. Build recommendation message
    const recommendation = this.buildRecommendation(
      exercise.name,
      exercise.primaryMuscles,
      activationState,
      warmupSets.length,
    );

    return {
      warmupSets,
      warmupStyle,
      targetWeight: workingWeight,
      activationState,
      recommendation,
    };
  }

  /**
   * Generates warmup sets based on style × activation level.
   *
   * Protocols per combination:
   *
   * | Style     | Cold (Full)              | Warm (Abbreviated)   | Hot (Contact)  |
   * |-----------|--------------------------|----------------------|----------------|
   * | standard  | 40%×12, 60%×8, 80%×3     | 60%×8, 80%×3         | 70%×5          |
   * | heavy     | 40%×8, 60%×4, 80%×2, 90%×1 | 70%×3, 85%×1       | 80%×1          |
   * | ramp      | Movilidad + 50%×10, 70%×5  | 60%×6              | (skip)         |
   *
   * For weights >150kg with 'heavy' style, an extra 95%×1 step is added.
   */
  private generateWarmupSets(
    targetWeight: number,
    weightIncrement: number,
    style: WarmupStyle,
    activation: ActivationLevel,
  ): WarmupSet[] {
    if (targetWeight <= 0) return [];

    // Define protocols: [percentage, reps, label, restSeconds]
    type SetDef = [number, number, string, number];
    let protocol: SetDef[] = [];

    if (style === 'standard') {
      switch (activation) {
        case 'cold':
          protocol = [
            [0.40, 12, 'Movilidad', 45],
            [0.60, 8, 'Activación', 60],
            [0.80, 3, 'Aclimatación', 60],
          ];
          break;
        case 'warm':
          protocol = [
            [0.60, 8, 'Activación', 45],
            [0.80, 3, 'Aclimatación', 60],
          ];
          break;
        case 'hot':
          protocol = [
            [0.70, 5, 'Toma de contacto', 45],
          ];
          break;
      }
    } else if (style === 'heavy') {
      switch (activation) {
        case 'cold':
          protocol = [
            [0.40, 8, 'Movilidad', 45],
            [0.60, 4, 'Activación', 60],
            [0.80, 2, 'Aclimatación', 90],
            [0.90, 1, 'Feeler', 90],
          ];
          // Extra step for very heavy weights (>150kg)
          if (targetWeight > 150) {
            protocol.push([0.95, 1, 'Potenciación', 120]);
          }
          break;
        case 'warm':
          protocol = [
            [0.70, 3, 'Activación', 60],
            [0.85, 1, 'Feeler', 90],
          ];
          break;
        case 'hot':
          protocol = [
            [0.80, 1, 'Toma de contacto', 60],
          ];
          break;
      }
    } else if (style === 'ramp') {
      switch (activation) {
        case 'cold':
          protocol = [
            [0.00, 0, 'Movilidad dinámica', 30],
            [0.50, 10, 'Rampa inicial', 45],
            [0.70, 5, 'Activación', 60],
          ];
          break;
        case 'warm':
          protocol = [
            [0.60, 6, 'Ajuste', 45],
          ];
          break;
        case 'hot':
          // RAMP style: hot muscles only need mobility, no weight warmup
          protocol = [];
          break;
      }
    }

    // Convert protocol to WarmupSet objects with rounded weights
    return protocol.map((def, index) => {
      const [pct, reps, label, rest] = def;
      const rawWeight = targetWeight * pct;
      const roundedWeight = this.roundToIncrement(rawWeight, weightIncrement);

      return {
        setNumber: index + 1,
        weight: roundedWeight,
        reps,
        percentage: Math.round(pct * 100),
        label,
        restSeconds: rest,
      };
    });
  }

  /** Rounds a weight to the nearest valid increment. */
  private roundToIncrement(weight: number, increment: number): number {
    if (increment <= 0) return Math.round(weight);
    return Math.round(weight / increment) * increment;
  }

  /** Builds a human-readable recommendation message in Spanish. */
  private buildRecommendation(
    exerciseName: string,
    primaryMuscles: string[],
    activation: ActivationLevel,
    numSets: number,
  ): string {
    const muscleList = primaryMuscles.join(', ');

    switch (activation) {
      case 'cold':
        return `Tu ${muscleList} está frío. Realiza ${numSets} series de calentamiento antes de ${exerciseName}.`;
      case 'warm':
        return `Tu ${muscleList} está tibio (trabajado como secundario). Realiza ${numSets} series rápidas de aproximación.`;
      case 'hot':
        return numSets > 0
          ? `Tu ${muscleList} ya está caliente. Solo ${numSets} serie de toma de contacto para ajustar la técnica.`
          : `Tu ${muscleList} ya está caliente. Puedes ir directo a tus series efectivas.`;
    }
  }
}
