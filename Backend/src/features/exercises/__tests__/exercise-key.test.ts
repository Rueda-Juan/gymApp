import { generateExerciseKey } from '../exercise.service';

describe('generateExerciseKey', () => {
  describe('standard exercises (isCustom = false)', () => {
    it('lowercases and replaces spaces with underscores', () => {
      expect(generateExerciseKey('Bench Press', false)).toBe('bench_press');
    });

    it('replaces hyphens with underscores', () => {
      expect(generateExerciseKey('Pull-Up', false)).toBe('pull_up');
    });

    it('strips apostrophes', () => {
      expect(generateExerciseKey("Farmer's Walk", false)).toBe('farmers_walk');
    });

    it('strips curly apostrophes', () => {
      expect(generateExerciseKey('Farmer\u2019s Walk', false)).toBe('farmers_walk');
    });

    it('trims leading and trailing whitespace', () => {
      expect(generateExerciseKey('  Squat  ', false)).toBe('squat');
    });

    it('handles multiple consecutive spaces', () => {
      expect(generateExerciseKey('Romanian  Deadlift', false)).toBe('romanian_deadlift');
    });

    it('handles fully lowercase input', () => {
      expect(generateExerciseKey('bicep curl', false)).toBe('bicep_curl');
    });
  });

  describe('custom exercises (isCustom = true)', () => {
    it('prepends custom_ prefix', () => {
      expect(generateExerciseKey('Bench Press', true)).toBe('custom_bench_press');
    });

    it('normalizes name before prefixing', () => {
      expect(generateExerciseKey("My Farmer's Walk", true)).toBe('custom_my_farmers_walk');
    });

    it('produces a different key than the standard version', () => {
      const standard = generateExerciseKey('Bench Press', false);
      const custom = generateExerciseKey('Bench Press', true);
      expect(standard).not.toBe(custom);
    });
  });
});
