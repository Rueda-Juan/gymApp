import { useMemo } from 'react';
import { createWeightEngine, WeightResult } from './plateMath';

export interface WeightEngineConfig {
  barWeight?: number;
  availablePlates?: number[];
  unitWeight?: number;
  maxStack?: number;
}

export function useWeightEngine({
  type,
  config,
  input
}: {
  type: 'barbell' | 'dumbbell' | 'cable';
  config: WeightEngineConfig;
  input: { targetWeight?: number; selectedBlocks?: number };
}) {
  const engine = useMemo(() => createWeightEngine(type, config), [type, config]);
  
  const result = useMemo((): WeightResult => {
    return engine.compute(input);
  }, [engine, input]);

  return { result };
}

