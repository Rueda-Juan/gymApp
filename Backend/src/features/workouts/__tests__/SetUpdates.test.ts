import type { WorkoutRepository } from '@entities/workout';
import type { StatsRepository } from '@entities/stats';
import type { ExerciseLoadCacheRepository } from '@entities/exercise';
import type { RoutineRepository } from '@entities/routine';
import type * as SQLite from 'expo-sqlite';
import { WorkoutService } from '../workout.service';
import type { WorkoutSet } from '@entities/workout';

describe('WorkoutService - Set Updates', () => {
  let service: WorkoutService;
  let mockWorkoutRepo: jest.Mocked<WorkoutRepository>;
  let mockStatsRepo: jest.Mocked<StatsRepository>;
  let mockLoadCacheRepo: jest.Mocked<ExerciseLoadCacheRepository>;

  beforeEach(() => {
    mockWorkoutRepo = {
      updateSet: jest.fn(),
      deleteSet: jest.fn(),
    } as unknown as jest.Mocked<WorkoutRepository>;

    mockStatsRepo = {
      recalculateExerciseStats: jest.fn(),
      recalculateDailyStats: jest.fn(),
    } as unknown as jest.Mocked<StatsRepository>;

    mockLoadCacheRepo = {
      invalidate: jest.fn(),
    } as unknown as jest.Mocked<ExerciseLoadCacheRepository>;

    service = new WorkoutService(
      mockWorkoutRepo,
      mockStatsRepo,
      mockLoadCacheRepo,
      {} as unknown as RoutineRepository,
      {} as unknown as SQLite.SQLiteDatabase
    );
  });

  describe('updateSet', () => {
    it('actualiza el set y dispara todas las recalculaciones', async () => {
      const mockSet: WorkoutSet = {
        id: 's-1',
        exerciseId: 'ex-1',
        weight: 100,
        reps: 10,
        completed: true,
        setNumber: 1,
        setType: 'normal',
        createdAt: new Date(),
        partialReps: null,
        rir: null,
        restSeconds: null,
        durationSeconds: 0,
        skipped: false
      };

      await service.updateSet('w-1', '2026-03-24', mockSet);

      expect(mockWorkoutRepo.updateSet).toHaveBeenCalledWith('w-1', mockSet);
      expect(mockStatsRepo.recalculateExerciseStats).toHaveBeenCalledWith('ex-1');
      expect(mockStatsRepo.recalculateDailyStats).toHaveBeenCalledWith('2026-03-24');
      expect(mockLoadCacheRepo.invalidate).toHaveBeenCalledWith('ex-1');
    });
  });

  describe('deleteSet', () => {
    it('elimina el set y dispara todas las recalculaciones', async () => {
      await service.deleteSet('w-1', 's-1', 'ex-1', '2026-03-24');

      expect(mockWorkoutRepo.deleteSet).toHaveBeenCalledWith('w-1', 's-1');
      expect(mockStatsRepo.recalculateExerciseStats).toHaveBeenCalledWith('ex-1');
      expect(mockStatsRepo.recalculateDailyStats).toHaveBeenCalledWith('2026-03-24');
      expect(mockLoadCacheRepo.invalidate).toHaveBeenCalledWith('ex-1');
    });
  });
});
