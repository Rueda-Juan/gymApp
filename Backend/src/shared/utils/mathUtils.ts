/**
 * Utilities for mathematical and statistical array operations.
 */

export function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]!
    : (sorted[mid - 1]! + sorted[mid]!) / 2;
}

export function calculateStdDev(values: number[], median: number): number {
  if (values.length < 2) return 0;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - median, 2), 0) / values.length;
  return Math.sqrt(variance);
}

/**
 * Discards values deviating more than 3σ from the median.
 * Useful for filtering out wildly anomalous weights.
 */
export function filterOutliers<T extends { weight: number }>(sets: T[]): T[] {
  if (sets.length < 3) return sets;

  const weights = sets.map((s) => s.weight);
  const median = calculateMedian(weights);
  const stdDev = calculateStdDev(weights, median);

  if (stdDev === 0) return sets;

  return sets.filter((s) => Math.abs(s.weight - median) <= 3 * stdDev);
}
