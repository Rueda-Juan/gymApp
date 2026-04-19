import { useMemo } from 'react';
import { createWeightEngine, WeightEngineType, WeightEngineResult } from '@/domain/weight/weightEngine';

interface BarbellConfig {
  type: 'barbell' | 'dumbbell';
  config: {
    barWeight: number;
    availablePlates: number[];
  };
  input: {
    targetWeight: number;
  };
}

interface CableConfig {
  type: 'cable';
  config: {
    unitWeight: number;
    maxStack: number;
  };
  input: {
    selectedBlocks: number;
  };
}

type UseWeightEngineProps = BarbellConfig | CableConfig;

export function useWeightEngine({ type, config, input }: UseWeightEngineProps) {
  // Type guards para dependencias
  let engineDeps: any[] = [type];
  if (type === 'barbell' || type === 'dumbbell') {
    engineDeps = [type, (config as BarbellConfig['config']).barWeight, ...((config as BarbellConfig['config']).availablePlates || [])];
  } else if (type === 'cable') {
    engineDeps = [type, (config as CableConfig['config']).unitWeight, (config as CableConfig['config']).maxStack];
  }
  const engine = useMemo(() => createWeightEngine(type, config), engineDeps);

  let resultDeps: any[] = [engine];
  if (type === 'barbell' || type === 'dumbbell') {
    resultDeps = [engine, (input as BarbellConfig['input']).targetWeight];
  } else if (type === 'cable') {
    resultDeps = [engine, (input as CableConfig['input']).selectedBlocks];
  }
  const result: WeightEngineResult = useMemo(() => engine.compute(input), resultDeps);
  return { result };
}
