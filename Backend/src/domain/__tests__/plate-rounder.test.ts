import { PlateRounder } from '../services/PlateRounder';

const STANDARD_PLATES = [1.25, 2.5, 5, 10, 20, 25];
const BAR_WEIGHT = 20;

describe('PlateRounder', () => {
  let rounder: PlateRounder;

  beforeEach(() => {
    rounder = new PlateRounder();
  });

  it('returns exact weight when plates divide evenly', () => {
    // (100 - 20) / 2 = 40 per side → 20+20 = 40 ✓
    expect(rounder.round(100, STANDARD_PLATES, BAR_WEIGHT)).toBe(100);
  });

  it('rounds down to highest achievable weight with partial plates', () => {
    // target 63, plates [5,10] only
    // per side = (63-20)/2 = 21.5 → can do 10+10=20 per side → 20+40=60
    expect(rounder.round(63, [5, 10], BAR_WEIGHT)).toBe(60);
  });

  it('returns bar weight when no plates are available', () => {
    expect(rounder.round(100, [], BAR_WEIGHT)).toBe(BAR_WEIGHT);
  });

  it('returns bar weight when target is less than bar weight', () => {
    expect(rounder.round(10, STANDARD_PLATES, BAR_WEIGHT)).toBe(BAR_WEIGHT);
  });

  it('returns bar weight when target equals bar weight', () => {
    expect(rounder.round(20, STANDARD_PLATES, BAR_WEIGHT)).toBe(BAR_WEIGHT);
  });

  it('handles decimal plate denominations correctly', () => {
    // per side = (82.5-20)/2 = 31.25 → 20+10+1.25 = 31.25 per side → 82.5 exactly
    expect(rounder.round(82.5, STANDARD_PLATES, BAR_WEIGHT)).toBe(82.5);
  });

  it('handles multiple rounds of the same plate', () => {
    // plates = [10], target = 100, bar = 20 → per side = 40 → 4×10 = 40 per side → 100
    expect(rounder.round(100, [10], BAR_WEIGHT)).toBe(100);
  });

  it('returns 0 weight suggestion as-is when suggestedWeight=0', () => {
    // weight=0 → per side = (0-20)/2 < 0 → returns barWeight
    // This is the barWeight floor, which is the documented behavior for 0 target
    expect(rounder.round(0, STANDARD_PLATES, BAR_WEIGHT)).toBe(BAR_WEIGHT);
  });
});
