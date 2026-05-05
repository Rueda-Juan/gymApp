export interface PlateCalculation {
  plates: { weight: number; count: number }[]; // per side
  actualTotalWeight: number;
  remainder: number;
}

/**
 * Calculates the required plates per side to reach the target weight.
 */
export function calculatePlates(
  targetWeight: number,
  barWeight: number,
  availablePlates: number[]
): PlateCalculation {
  if (targetWeight < 0) {
    return { plates: [], actualTotalWeight: barWeight, remainder: targetWeight - barWeight };
  }

  if (targetWeight <= barWeight) {
    return { plates: [], actualTotalWeight: barWeight, remainder: 0 };
  }

  const weightToLoad = targetWeight - barWeight;
  const targetPerSide = weightToLoad / 2;

  let currentPerSide = 0;
  const platesPerSide: { [key: number]: number } = {};

  const plateInventory = availablePlates.reduce<Record<number, number>>((inventory, plate) => {
    inventory[plate] = (inventory[plate] ?? 0) + 1;
    return inventory;
  }, {});

  const sortedPlateWeights = Object.keys(plateInventory)
    .map(Number)
    .sort((a, b) => b - a);

  for (const plateWeight of sortedPlateWeights) {
    const maxCountPerSide = plateInventory[plateWeight];
    let usedCount = 0;
    while (currentPerSide + plateWeight <= targetPerSide && usedCount < maxCountPerSide) {
      platesPerSide[plateWeight] = (platesPerSide[plateWeight] ?? 0) + 1;
      currentPerSide += plateWeight;
      usedCount++;
    }
  }

  const resultPlates = Object.entries(platesPerSide)
    .map(([weightStr, count]) => ({
      weight: parseFloat(weightStr),
      count
    }))
    .sort((a, b) => b.weight - a.weight);

  const actualTotalWeight = barWeight + (currentPerSide * 2);

  return {
    plates: resultPlates,
    actualTotalWeight,
    remainder: targetWeight - actualTotalWeight
  };
}

export type WeightResult = 
  | (PlateCalculation & { type: 'barbell' | 'dumbbell' })
  | { type: 'cable'; actualTotalWeight: number; blocks: number };

/**
 * Unified Weight Engine for different loading types (Barbell, Cable, etc.)
 */
export interface WeightEngine {
  compute: (params: { targetWeight?: number; selectedBlocks?: number }) => WeightResult;
}

class BarbellWeightEngine implements WeightEngine {
  constructor(private type: 'barbell' | 'dumbbell', private config: { barWeight: number; availablePlates: number[] }) {}
  compute({ targetWeight }: { targetWeight?: number }): WeightResult {
    const calc = calculatePlates(targetWeight ?? 0, this.config.barWeight, this.config.availablePlates);
    return { ...calc, type: this.type };
  }
}

class CableWeightEngine implements WeightEngine {
  constructor(private config: { unitWeight: number; maxStack: number }) {}
  compute({ selectedBlocks }: { selectedBlocks?: number }): WeightResult {
    return {
      type: 'cable',
      actualTotalWeight: (selectedBlocks ?? 0) * this.config.unitWeight,
      blocks: selectedBlocks ?? 0,
    };
  }
}

export function createWeightEngine(
  type: 'barbell' | 'dumbbell' | 'cable', 
  config: { barWeight?: number; availablePlates?: number[]; unitWeight?: number; maxStack?: number }
): WeightEngine {
  if (type === 'barbell' || type === 'dumbbell') {
    return new BarbellWeightEngine(type, {
      barWeight: config.barWeight ?? 20,
      availablePlates: config.availablePlates ?? []
    });
  }
  return new CableWeightEngine({
    unitWeight: config.unitWeight ?? 5,
    maxStack: config.maxStack ?? 100
  });
}

