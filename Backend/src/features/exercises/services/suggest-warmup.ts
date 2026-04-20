import type { ExerciseRepository } from '../exercise.repository';
import type { SessionContext, ActivationLevel } from '../../../core/types/session-context';
import { createLogger } from '../../../core/logger/Logger';
import { SuggestWeightUseCase } from './suggest-weight';

const log = createLogger('SuggestWarmup');

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

export class SuggestWarmupUseCase {
  constructor(
    private readonly exerciseRepo: ExerciseRepository,
    private readonly suggestWeightUseCase: SuggestWeightUseCase,
  ) {}

  /**
   * Suggests warmup sets for a given exercise based on:
   * 1. The exercise's muscle activation state from the session context
   * 2. The user's preferred warmup style
   * 3. The target working weight
   *
   * After generating suggestions, it updates the session context
   * to mark muscles as activated.
   */
  async execute(
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

    // 2. Determine target weight (from param or from double progression use case)
    let workingWeight = targetWeight ?? 0;
    if (!targetWeight) {
      const suggestion = await this.suggestWeightUseCase.execute(exerciseId);
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
   */
  private generateWarmupSets(
    targetWeight: number,
    weightIncrement: number,
    style: WarmupStyle,
    activation: ActivationLevel,
  ): WarmupSet[] {
    if (targetWeight <= 0) return [];

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
          protocol = [];
          break;
      }
    }

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

  private roundToIncrement(weight: number, increment: number): number {
    if (increment <= 0) return Math.round(weight);
    return Math.round(weight / increment) * increment;
  }

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
