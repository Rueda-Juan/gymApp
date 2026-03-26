export interface PlateCalculation {
  plates: { weight: number; count: number }[]; // per side
  actualTotalWeight: number;
  remainder: number;
}

/**
 * Calculates the required plates per side to reach the target weight.
 * 
 * @param targetWeight The total desired weight (including the bar).
 * @param barWeight The weight of the barbell.
 * @param availablePlates Array of available plate weights, sorted or unsorted.
 * @returns An object containing the plates required per side, the actual total achieved, and any remainder that couldn't be loaded.
 */
export function calculatePlates(
  targetWeight: number,
  barWeight: number,
  availablePlates: number[]
): PlateCalculation {
  if (targetWeight <= barWeight) {
    return { plates: [], actualTotalWeight: barWeight, remainder: 0 };
  }

  const weightToLoad = targetWeight - barWeight;
  const targetPerSide = weightToLoad / 2;
  
  let currentPerSide = 0;
  const platesPerSide: { [key: number]: number } = {};
  
  // Ensure plates are sorted descending
  const sortedPlates = [...availablePlates].sort((a, b) => b - a);

  for (const plate of sortedPlates) {
    while (currentPerSide + plate <= targetPerSide) {
      if (!platesPerSide[plate]) {
        platesPerSide[plate] = 0;
      }
      platesPerSide[plate]++;
      currentPerSide += plate;
    }
  }

  const resultPlates = Object.entries(platesPerSide)
    .map(([weightStr, count]) => ({
      weight: parseFloat(weightStr),
      count
    }))
    .sort((a, b) => b.weight - a.weight); // Sort descending

  const actualTotalWeight = barWeight + (currentPerSide * 2);

  return {
    plates: resultPlates,
    actualTotalWeight,
    remainder: targetWeight - actualTotalWeight
  };
}
