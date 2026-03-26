import { calculatePlates } from '../plateMath';

describe('calculatePlates', () => {
  const availablePlates = [25, 20, 15, 10, 5, 2.5, 1.25];

  it('calculates the correct plates for 100kg with a 20kg bar', () => {
    const result = calculatePlates(100, 20, availablePlates);
    // (100 - 20) / 2 = 40kg per side
    // 40 = 25 + 15
    expect(result.plates).toEqual([
      { weight: 25, count: 1 },
      { weight: 15, count: 1 }
    ]);
    expect(result.remainder).toBe(0);
  });

  it('returns empty plates for weight equal to bar weight', () => {
    const result = calculatePlates(20, 20, availablePlates);
    expect(result.plates).toEqual([]);
    expect(result.remainder).toBe(0);
  });

  it('calculates remainders if weight is not perfectly reachable', () => {
    const result = calculatePlates(101, 20, availablePlates);
    // (101 - 20) / 2 = 40.5kg per side
    // 40 = 25 + 15 (remainder 0.5 per side) => total remainder 1kg
    expect(result.remainder).toBe(1);
  });
});
