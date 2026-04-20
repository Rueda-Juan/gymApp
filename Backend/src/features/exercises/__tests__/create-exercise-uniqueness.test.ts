import { ExerciseService } from '../exercise.service';
import type { ExerciseRepository } from '../exercise.repository';
import type { Exercise } from '../exercise.entity';
import { ValidationError } from '../../../core/errors/errors';

function buildExerciseParams(overrides: Partial<Omit<Exercise, 'id'>> = {}): Omit<Exercise, 'id'> {
  return {
    name: 'Bench Press',
    nameEs: null,
    primaryMuscles: ['chest'],
    secondaryMuscles: [],
    equipment: 'barbell',
    exerciseType: 'compound',
    weightIncrement: 2.5,
    animationPath: null,
    description: null,
    anatomicalRepresentationSvg: null,
    exerciseKey: '',
    isCustom: true,
    createdBy: 'user-1',
    loadType: 'weighted',
    isArchived: false,
    ...overrides,
  };
}

describe('ExerciseService — createExercise uniqueness constraint', () => {
  let mockRepo: jest.Mocked<ExerciseRepository>;
  let service: ExerciseService;

  beforeEach(() => {
    mockRepo = {
      getByKey: jest.fn().mockResolvedValue(null),
      save: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<ExerciseRepository>;

    const mockWorkoutRepo = {} as any;

    service = new ExerciseService(mockRepo, mockWorkoutRepo);
  });

  it('creates an exercise successfully when the key is unique', async () => {
    const params = buildExerciseParams({ name: 'Bicep Curl', isCustom: true });

    const result = await service.createExercise(params);

    expect(result.exerciseKey).toBe('custom_bicep_curl');
    expect(mockRepo.save).toHaveBeenCalledTimes(1);
    expect(mockRepo.save).toHaveBeenCalledWith(expect.objectContaining({ exerciseKey: 'custom_bicep_curl' }));
  });

  it('throws ValidationError when the generated key already exists', async () => {
    const existingExercise = { id: 'existing-id' } as Exercise;
    mockRepo.getByKey.mockResolvedValue(existingExercise);

    const params = buildExerciseParams({ name: 'Bench Press', isCustom: true });

    await expect(service.createExercise(params)).rejects.toThrow(ValidationError);
    expect(mockRepo.save).not.toHaveBeenCalled();
  });

  it('checks uniqueness using the custom_ prefixed key for custom exercises', async () => {
    const params = buildExerciseParams({ name: 'My Row', isCustom: true });
    await service.createExercise(params);
    expect(mockRepo.getByKey).toHaveBeenCalledWith('custom_my_row');
  });

  it('checks uniqueness using the non-prefixed key for catalog exercises', async () => {
    const params = buildExerciseParams({ name: 'Deadlift', isCustom: false });
    await service.createExercise(params);
    expect(mockRepo.getByKey).toHaveBeenCalledWith('deadlift');
  });

  it('assigns a new unique id to the created exercise', async () => {
    const params = buildExerciseParams({ name: 'Squat', isCustom: true });
    const result = await service.createExercise(params);
    expect(result.id).toBeTruthy();
    expect(typeof result.id).toBe('string');
  });

  it('throws ValidationError for catalog exercise with empty name', async () => {
    const params = buildExerciseParams({ name: '  ', isCustom: false });
    await expect(service.createExercise(params)).rejects.toThrow(ValidationError);
  });

  it('normalizes name differences to the same key — duplicate detected', async () => {
    // "Bench  Press" (double space) normalizes to "custom_bench_press"
    mockRepo.getByKey.mockResolvedValueOnce({ id: 'existing-id' } as Exercise);
    const params = buildExerciseParams({ name: 'Bench  Press', isCustom: true });

    await expect(service.createExercise(params)).rejects.toThrow(ValidationError);
  });
});
