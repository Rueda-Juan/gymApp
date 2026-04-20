import { SuggestWeightUseCase } from '../services/suggest-weight';
import { WorkoutService } from '../../workouts/workout.service';
import type { WorkoutRepository } from '../../workouts/workout.repository';
import type { StatsRepository } from '../../stats/stats.repository';
import type { ExerciseRepository } from '../exercise.repository';
import type { ExerciseLoadCacheRepository, CachedWeightSuggestion } from '../exercise-load-cache.repository';
import type { Exercise } from '../exercise.entity';
import type { Workout } from '../../workouts/workout.entity';
import { PlateRounder } from '../utils/plate-rounder';

const EXERCISE_ID = 'ex-cache-1';

const MOCK_EXERCISE: Exercise = {
  id: EXERCISE_ID,
  name: 'Bench Press',
  nameEs: 'Press de Banca',
  primaryMuscles: ['chest'],
  secondaryMuscles: ['triceps'],
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
};

function buildWorkout(weight: number, reps: number): Workout {
  const d = new Date();
  return {
    id: `w-${Math.random()}`,
    date: d,
    exercises: [
      {
        id: 'we-1',
        exerciseId: EXERCISE_ID,
        skipped: false,
        orderIndex: 0,
        notes: null,
        supersetGroup: null,
        sets: [
          {
            id: 's-1',
            weight,
            reps,
            completed: true,
            skipped: false,
            setType: 'normal',
            rir: null,
            restSeconds: null,
            durationSeconds: 0,
            createdAt: d,
          },
        ],
      },
    ],
  } as Workout;
}

describe('Cache lifecycle integration', () => {
  let cacheStore: Map<string, CachedWeightSuggestion>;

  let mockWorkoutRepo: jest.Mocked<WorkoutRepository>;
  let mockStatsRepo: jest.Mocked<StatsRepository>;
  let mockExerciseRepo: jest.Mocked<ExerciseRepository>;
  let mockLoadCacheRepo: jest.Mocked<ExerciseLoadCacheRepository>;
  let suggestUseCase: SuggestWeightUseCase;
  let workoutService: WorkoutService;

  const mockDb = {
    withTransactionAsync: jest.fn(async (cb: () => Promise<void>) => cb()),
  } as any;

  beforeEach(() => {
    cacheStore = new Map();

    mockWorkoutRepo = {
      getRecent: jest.fn().mockResolvedValue([buildWorkout(80, 12)]),
      addSet: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<WorkoutRepository>;

    mockExerciseRepo = {
      getById: jest.fn().mockResolvedValue(MOCK_EXERCISE),
    } as unknown as jest.Mocked<ExerciseRepository>;

    mockStatsRepo = {
      getExerciseStats: jest.fn().mockResolvedValue(null),
      updateExerciseStats: jest.fn().mockResolvedValue(undefined),
      savePersonalRecord: jest.fn().mockResolvedValue(undefined),
      getDailyStats: jest.fn().mockResolvedValue(null),
      upsertDailyStats: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<StatsRepository>;

    mockLoadCacheRepo = {
      get: jest.fn().mockImplementation(async (exerciseId: string) => {
        return cacheStore.get(exerciseId) ?? null;
      }),
      upsert: jest.fn().mockImplementation(async (entry: CachedWeightSuggestion) => {
        cacheStore.set(entry.exerciseId, entry);
      }),
      invalidate: jest.fn().mockImplementation(async (exerciseId: string) => {
        cacheStore.delete(exerciseId);
      }),
      invalidateAll: jest.fn().mockImplementation(async () => {
        cacheStore.clear();
      }),
    } as unknown as jest.Mocked<ExerciseLoadCacheRepository>;

    suggestUseCase = new SuggestWeightUseCase(
      mockWorkoutRepo,
      mockStatsRepo,
      mockExerciseRepo,
      mockLoadCacheRepo,
      new PlateRounder(),
    );

    const mockRoutineRepo = {} as any;

    workoutService = new WorkoutService(
      mockWorkoutRepo,
      mockStatsRepo,
      mockLoadCacheRepo,
      mockRoutineRepo,
      mockDb
    );
  });

  it('populates cache on first suggestion', async () => {
    await suggestUseCase.execute(EXERCISE_ID);
    expect(cacheStore.has(EXERCISE_ID)).toBe(true);
    expect(mockLoadCacheRepo.upsert).toHaveBeenCalledTimes(1);
  });

  it('returns cached value on second suggestion without re-querying workouts', async () => {
    // First call → populates cache
    await suggestUseCase.execute(EXERCISE_ID);
    mockWorkoutRepo.getRecent.mockClear();

    // Second call → cache hit
    const secondResult = await suggestUseCase.execute(EXERCISE_ID);
    expect(mockWorkoutRepo.getRecent).not.toHaveBeenCalled();
    expect(secondResult.suggestedWeight).toBeGreaterThanOrEqual(0);
  });

  it('invalidates cache when a new set is recorded', async () => {
    // Warm the cache
    await suggestUseCase.execute(EXERCISE_ID);
    expect(cacheStore.has(EXERCISE_ID)).toBe(true);

    // Record a set → should invalidate
    await workoutService.recordSet('w-1', {
      exerciseId: EXERCISE_ID,
      setNumber: 1,
      weight: 85,
      reps: 10,
      rir: null,
      setType: 'normal',
      durationSeconds: 0,
      completed: true,
      skipped: false,
    });

    expect(cacheStore.has(EXERCISE_ID)).toBe(false);
    expect(mockLoadCacheRepo.invalidate).toHaveBeenCalledWith(EXERCISE_ID);
  });

  it('recalculates after cache invalidation', async () => {
    // First suggest
    const first = await suggestUseCase.execute(EXERCISE_ID);
    // Invalidate
    await mockLoadCacheRepo.invalidate(EXERCISE_ID);
    // Second suggest should re-query
    mockWorkoutRepo.getRecent.mockClear();
    await suggestUseCase.execute(EXERCISE_ID);
    expect(mockWorkoutRepo.getRecent).toHaveBeenCalledTimes(1);
    expect(first.suggestedWeight).toBeGreaterThanOrEqual(0);
  });
});

