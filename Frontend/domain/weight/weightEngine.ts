// Pure weight calculation engine abstraction
import { calculatePlates } from '@/utils/plateMath';

export type WeightEngineType = 'barbell' | 'dumbbell' | 'cable';

export interface WeightEngineInput {
  targetWeight?: number;
  selectedBlocks?: number;
}


export type WeightEngineResult =
  | {
      type: 'barbell' | 'dumbbell';
      total: number;
      plates: { weight: number; count: number }[];
      remainder: number;
      barWeight: number;
    }
  | {
      type: 'cable';
      total: number;
      blocks: number;
      unitWeight: number;
    };

export interface WeightEngine {
  type: WeightEngineType;
  compute: (input: WeightEngineInput) => WeightEngineResult;
}

interface PlateEngineConfig {
  barWeight: number;
  availablePlates: number[];
}

interface CableEngineConfig {
  unitWeight: number;
  maxStack: number;
}

export function createWeightEngine(
  type: WeightEngineType,
  config: PlateEngineConfig | CableEngineConfig
): WeightEngine {
  if (type === 'barbell' || type === 'dumbbell') {
    const { barWeight, availablePlates } = config as PlateEngineConfig;
    return {
      type,
      compute: ({ targetWeight }) => {
        const safeTarget = Math.max(0, targetWeight ?? 0);
        const calc = calculatePlates(safeTarget, barWeight, availablePlates);
        return {
          type,
          total: calc.actualTotalWeight,
          plates: calc.plates,
          remainder: calc.remainder,
          barWeight,
        };
      },
    };
  }
  if (type === 'cable') {
    const { unitWeight, maxStack } = config as CableEngineConfig;
    return {
      type,
      compute: ({ selectedBlocks }) => {
        const blocks = Math.max(0, Math.min(selectedBlocks ?? 0, maxStack));
        return {
          type: 'cable',
          total: blocks * unitWeight,
          blocks,
          unitWeight,
        };
      },
    };
  }
  throw new Error('Unknown engine type');
}
