import { filterOutliers } from '../../../shared/utils/mathUtils';

type MockSet = { id: string; weight: number; reps: number };

function makeSets(weights: number[]): MockSet[] {
  return weights.map((w, i) => ({ id: `s-${i}`, weight: w, reps: 10 }));
}

describe('filterOutliers', () => {
  it('returns all sets unchanged when fewer than 3 sets', () => {
    const sets = makeSets([100, 110]);
    expect(filterOutliers(sets)).toHaveLength(2);
    expect(filterOutliers(sets)).toStrictEqual(sets);
  });

  it('returns all sets when input has exactly 0 sets', () => {
    expect(filterOutliers([])).toHaveLength(0);
  });

  it('returns all sets when all weights are identical (stdDev = 0)', () => {
    const sets = makeSets([100, 100, 100, 100]);
    expect(filterOutliers(sets)).toHaveLength(4);
  });

  it('returns all sets when distribution is normal with no outliers', () => {
    const sets = makeSets([90, 92.5, 95, 95, 97.5]);
    expect(filterOutliers(sets)).toHaveLength(5);
  });

  it('removes an extreme outlier in a large set of consistent data', () => {
    // 9 identical values of 100 + 1 extreme outlier (5000)
    // median = 100, stdDev ≈ 1549, 3σ ≈ 4648 → |5000-100|=4900 > 4648 → filtered
    const normalWeights = Array(9).fill(100) as number[];
    const sets = makeSets([...normalWeights, 5000]);
    const result = filterOutliers(sets);
    expect(result).toHaveLength(9);
    expect(result.every(s => s.weight === 100)).toBe(true);
  });

  it('does not filter a moderate outlier in a small set (3 items)', () => {
    // With only 3 sets, the outlier inflates stdDev enough that threshold > deviation
    const sets = makeSets([20, 100, 100]);
    const result = filterOutliers(sets);
    expect(result).toHaveLength(3);
  });

  it('preserves all set properties on returned items', () => {
    const sets = makeSets([100, 100, 100]);
    const result = filterOutliers(sets);
    expect(result[0]).toHaveProperty('id');
    expect(result[0]).toHaveProperty('reps');
    expect(result[0]).toHaveProperty('weight');
  });
});
