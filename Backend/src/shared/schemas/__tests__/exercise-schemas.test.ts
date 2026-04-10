import {
  CreateCustomExerciseSchema,
  LoadTypeSchema,
} from '../../schemas/exerciseSchemas';

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

  it('accepts a name of exactly 2 characters', () => {
    const result = CreateCustomExerciseSchema.safeParse({ ...validInput, name: 'AB' });
    expect(result.success).toBe(true);
  });

  it('accepts a name of exactly 60 characters', () => {
    const maxName = 'A'.repeat(60);
    const result = CreateCustomExerciseSchema.safeParse({ ...validInput, name: maxName });
    expect(result.success).toBe(true);
  });

  it('trims whitespace before validation', () => {
    const result = CreateCustomExerciseSchema.safeParse({ ...validInput, name: '  A  ' });
    // Trimmed to 1 char → fails min(2)
    expect(result.success).toBe(false);
  });

  it('rejects when primaryMuscles is empty', () => {
    const result = CreateCustomExerciseSchema.safeParse({ ...validInput, primaryMuscles: [] });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid muscle group', () => {
    const result = CreateCustomExerciseSchema.safeParse({
      ...validInput,
      primaryMuscles: ['invalid_muscle'],
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid equipment value', () => {
    const result = CreateCustomExerciseSchema.safeParse({
      ...validInput,
      equipment: 'trampoline',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid load type', () => {
    const result = CreateCustomExerciseSchema.safeParse({
      ...validInput,
      loadType: 'machine',
    });
    expect(result.success).toBe(false);
  });

  it('defaults secondaryMuscles to [] when omitted', () => {
    const { secondaryMuscles: _, ...withoutSecondary } = validInput;
    const result = CreateCustomExerciseSchema.safeParse(withoutSecondary);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.secondaryMuscles).toEqual([]);
    }
  });

  it('defaults exerciseType to isolation when omitted', () => {
    const result = CreateCustomExerciseSchema.safeParse(validInput);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.exerciseType).toBe('isolation');
    }
  });
});
