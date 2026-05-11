
import { calculatePlates } from '../plateMath';

describe('calculatePlates', () => {
  const standardPlates = [25, 20, 15, 10, 5, 2.5, 1.25];

  it('calculates the correct plates for 100kg with a 20kg bar', () => {
    const result = calculatePlates(100, 20, standardPlates);
    // (100 - 20) / 2 = 40kg per side └─ 25 + 15
    expect(result.plates).toEqual([
      { weight: 25, count: 1 },
      { weight: 15, count: 1 },
    ]);
    expect(result.remainder).toBe(0);
    expect(result.actualTotalWeight).toBe(100);
  });

  it('returns empty plates for weight equal to bar weight', () => {
    const result = calculatePlates(20, 20, standardPlates);
    expect(result.plates).toEqual([]);
    expect(result.remainder).toBe(0);
    expect(result.actualTotalWeight).toBe(20);
  });

  it('calculates remainders if weight is not perfectly reachable', () => {
    const result = calculatePlates(101, 20, standardPlates);
    // (101 - 20) / 2 = 40.5kg per side └─ 25 + 15 = 40 per side, remainder 1kg total
    expect(result.remainder).toBe(1);
    expect(result.actualTotalWeight).toBe(100);
  });

  it('returns bar weight and negative remainder for negative target', () => {
    const result = calculatePlates(-10, 20, standardPlates);
    expect(result.plates).toEqual([]);
    expect(result.actualTotalWeight).toBe(20);
    expect(result.remainder).toBe(-30);
  });

  it('returns empty plates when barWeight exceeds targetWeight', () => {
    const result = calculatePlates(15, 20, standardPlates);
    expect(result.plates).toEqual([]);
    expect(result.actualTotalWeight).toBe(20);
    expect(result.remainder).toBe(0);
  });

  it('returns bar weight when targetWeight is 0', () => {
    const result = calculatePlates(0, 20, standardPlates);
    expect(result.plates).toEqual([]);
    expect(result.actualTotalWeight).toBe(20);
    expect(result.remainder).toBe(0);
  });

  it('returns empty plates with full remainder when plate list is empty', () => {
    const result = calculatePlates(100, 20, []);
    expect(result.plates).toEqual([]);
    expect(result.actualTotalWeight).toBe(20);
    expect(result.remainder).toBe(80);
  });

  it('handles unsorted plates correctly', () => {
    const unorderedPlates = [1.25, 5, 25, 10, 2.5, 15, 20];
    const result = calculatePlates(100, 20, unorderedPlates);
    expect(result.plates).toEqual([
      { weight: 25, count: 1 },
      { weight: 15, count: 1 },
    ]);
    expect(result.actualTotalWeight).toBe(100);
  });

  it('handles exact decimal target weight', () => {
    // (22.5 + 20) = 42.5 per side using [20, 2.5]
    const result = calculatePlates(20 + 22.5 * 2, 20, [20, 10, 5, 2.5, 1.25]);
    expect(result.remainder).toBe(0);
    expect(result.actualTotalWeight).toBe(65);
  });

  it('respects finite plate inventory — does not exceed available count per side', () => {
    // Only one 25kg plate available per side; need 50kg per side for 120kg total
    const limitedPlates = [25, 20, 10, 5]; // 1 of each
    const result = calculatePlates(120, 20, limitedPlates);
    // 50 per side └─ 25 + 20 + 5 = 50 … (only 1 of each, so this works)
    expect(result.plates).toEqual([
      { weight: 25, count: 1 },
      { weight: 20, count: 1 },
      { weight: 5, count: 1 },
    ]);
    expect(result.actualTotalWeight).toBe(120);
  });

  it('stops using a plate when inventory is exhausted', () => {
    // targetWeight needs 4x25 per side, but only 1x25 available
    const limitedPlates = [25, 10]; // 1 of each
    const result = calculatePlates(120, 20, limitedPlates);
    // 50 per side └─ can use 1x25, then 2x10 (but only 1x10), so 25 + 10 = 35, remainder 15*2=30
    const plateMap = Object.fromEntries(result.plates.map((p: any) => [p.weight, p.count]));
    expect(plateMap[25]).toBeLessThanOrEqual(1);
    expect(plateMap[10]).toBeLessThanOrEqual(1);
  });

  it('actualTotalWeight equals bar + 2 * loaded per side', () => {
    const result = calculatePlates(100, 20, standardPlates);
    const loadedPerSide = result.plates.reduce((sum: any, p: any) => sum + p.weight * p.count, 0);
    expect(result.actualTotalWeight).toBe(20 + loadedPerSide * 2);
  });
});


