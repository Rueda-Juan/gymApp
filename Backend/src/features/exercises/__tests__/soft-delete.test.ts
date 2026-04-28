import { ExerciseService } from '../exercise.service';
import type { ExerciseRepository } from '@entities/exercise';
import type { Exercise } from '@entities/exercise';
import type { WorkoutRepository } from '@entities/workout';
import { ValidationError, NotFoundError } from '@core/errors/errors';

function buildExercise(overrides: Partial<Exercise> = {}): Exercise {
  return {
    id: 'ex-1',
    name: 'Bench Press',
    nameEs: 'Press de Banca',
    primaryMuscles: ['chest'],
    secondaryMuscles: [],
    equipment: 'barbell',
    exerciseType: 'compound',
    weightIncrement: 2.5,
    animationPath: null,
    description: null,
    anatomicalRepresentationSvg: null,
    exerciseKey: 'bench_press',
    isCustom: false,
    createdBy: null,
    loadType: 'weighted',
    isArchived: false,
    ...overrides,
  };
}

describe('ExerciseService — deleteExercise soft-delete behavior', () => {
  let mockRepo: jest.Mocked<ExerciseRepository>;
  let service: ExerciseService;

  beforeEach(() => {
    mockRepo = {
      getById: jest.fn(),
      isInUse: jest.fn(),
      archive: jest.fn().mockResolvedValue(undefined),
      delete: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<ExerciseRepository>;

    const mockWorkoutRepo = {} as unknown as jest.Mocked<WorkoutRepository>;

    service = new ExerciseService(mockRepo, mockWorkoutRepo);
  });

  it('throws NotFoundError when the exercise does not exist', async () => {
    mockRepo.getById.mockResolvedValue(null);

    await expect(service.deleteExercise('nonexistent')).rejects.toThrow(NotFoundError);
    expect(mockRepo.delete).not.toHaveBeenCalled();
    expect(mockRepo.archive).not.toHaveBeenCalled();
  });

  it('archives a custom exercise that is currently in use', async () => {
    const exercise = buildExercise({ isCustom: true });
    mockRepo.getById.mockResolvedValue(exercise);
    mockRepo.isInUse.mockResolvedValue(true);

    await service.deleteExercise(exercise.id);

    expect(mockRepo.archive).toHaveBeenCalledWith(exercise.id);
    expect(mockRepo.delete).not.toHaveBeenCalled();
  });

  it('throws ValidationError when a catalog exercise is in use', async () => {
    const exercise = buildExercise({ isCustom: false });
    mockRepo.getById.mockResolvedValue(exercise);
    mockRepo.isInUse.mockResolvedValue(true);

    await expect(service.deleteExercise(exercise.id)).rejects.toThrow(ValidationError);
    expect(mockRepo.archive).not.toHaveBeenCalled();
    expect(mockRepo.delete).not.toHaveBeenCalled();
  });

  it('hard-deletes a custom exercise that is NOT in use', async () => {
    const exercise = buildExercise({ isCustom: true });
    mockRepo.getById.mockResolvedValue(exercise);
    mockRepo.isInUse.mockResolvedValue(false);

    await service.deleteExercise(exercise.id);

    expect(mockRepo.delete).toHaveBeenCalledWith(exercise.id);
    expect(mockRepo.archive).not.toHaveBeenCalled();
  });

  it('hard-deletes a catalog exercise that is NOT in use', async () => {
    const exercise = buildExercise({ isCustom: false });
    mockRepo.getById.mockResolvedValue(exercise);
    mockRepo.isInUse.mockResolvedValue(false);

    await service.deleteExercise(exercise.id);

    expect(mockRepo.delete).toHaveBeenCalledWith(exercise.id);
    expect(mockRepo.archive).not.toHaveBeenCalled();
  });
});
