import {
  CreateCustomExerciseSchema,
  LoadTypeSchema,
} from '../utils/helpers';

describe('LoadTypeSchema', () => {
  it.each(['weighted', 'bodyweight', 'assisted', 'timed'])('accepts valid load type: %s', (type) => {
    expect(LoadTypeSchema.safeParse(type).success).toBe(true);
  });

  it('rejects unknown load type', () => {
    expect(LoadTypeSchema.safeParse('cardio').success).toBe(false);
    expect(LoadTypeSchema.safeParse('bodyweight_plus').success).toBe(false);
    expect(LoadTypeSchema.safeParse('').success).toBe(false);
  });
});

describe('CreateCustomExerciseSchema', () => {
  const validInput = {
    name: 'Curl con barra',
    primaryMuscles: ['biceps'],
    secondaryMuscles: [],
    equipment: 'barbell',
    loadType: 'weighted',
  };

  it('accepts a valid custom exercise input', () => {
    const result = CreateCustomExerciseSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it('rejects a name shorter than 2 characters', () => {
    const result = CreateCustomExerciseSchema.safeParse({ ...validInput, name: 'A' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toMatch(/2/);
  });

  it('rejects a name longer than 60 characters', () => {
    const longName = 'A'.repeat(61);
    const result = CreateCustomExerciseSchema.safeParse({ ...validInput, name: longName });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toMatch(/60/);
  });
});
