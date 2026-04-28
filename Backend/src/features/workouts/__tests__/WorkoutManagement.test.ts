import type * as SQLite from 'expo-sqlite';
import { WorkoutService } from '../workout.service';
import type { WorkoutRepository } from '@entities/workout';
import type { StatsRepository } from '@entities/stats';
import type { RoutineRepository } from '@entities/routine';
import type { ExerciseLoadCacheRepository } from '@entities/exercise';
import type { Workout } from '@entities/workout';
import type { Routine } from '@entities/routine';
import { NotFoundError, ValidationError } from '@core/errors/errors';

const mockDb = {
  withTransactionAsync: jest.fn(async (cb: () => Promise<void>) => cb()),
} as unknown as SQLite.SQLiteDatabase;

describe('WorkoutService - Management', () => {
  let service: WorkoutService;
  let mockWorkoutRepo: jest.Mocked<WorkoutRepository>;
  let mockStatsRepo: jest.Mocked<StatsRepository>;
  let mockRoutineRepo: jest.Mocked<RoutineRepository>;
  let mockLoadCacheRepo: jest.Mocked<ExerciseLoadCacheRepository>;

  beforeEach(() => {
    mockWorkoutRepo = {
      getById: jest.fn(),
      save: jest.fn(),
      addExercise: jest.fn(),
      reorderExercises: jest.fn(),
      markExerciseSkipped: jest.fn(),
      deleteExercise: jest.fn(),
    } as unknown as jest.Mocked<WorkoutRepository>;

    mockStatsRepo = {
      recalculateExerciseStats: jest.fn(),
      recalculateDailyStats: jest.fn(),
    } as unknown as jest.Mocked<StatsRepository>;

    mockRoutineRepo = {
      getById: jest.fn(),
    } as unknown as jest.Mocked<RoutineRepository>;

    mockLoadCacheRepo = {
      invalidateAll: jest.fn(),
      invalidate: jest.fn(),
    } as unknown as jest.Mocked<ExerciseLoadCacheRepository>;

    service = new WorkoutService(
      mockWorkoutRepo,
      mockStatsRepo,
      mockLoadCacheRepo,
      mockRoutineRepo,
      mockDb
    );
  });

  describe('startWorkout', () => {
    it('crea un workout vacío cuando routineId es null', async () => {
      const result = await service.startWorkout(null);
      expect(result.routineId).toBeNull();
      expect(result.exercises).toHaveLength(0);
      expect(mockWorkoutRepo.save).toHaveBeenCalled();
    });

    it('crea un workout basado en una rutina válida', async () => {
      const mockRoutine: Routine = {
        id: 'r-1',
        name: 'Full Body',
        notes: null,
        createdAt: new Date(),
        exercises: [
          { id: 're-1', exerciseId: 'ex-1', orderIndex: 0, targetSets: 3, minReps: 8, maxReps: 12, restSeconds: 60, supersetGroup: null },
        ],
      };
      mockRoutineRepo.getById.mockResolvedValue(mockRoutine);

      const result = await service.startWorkout('r-1');

      expect(result.routineId).toBe('r-1');
      expect(result.exercises).toHaveLength(1);
      expect(result.exercises[0]?.exerciseId).toBe('ex-1');
      expect(mockWorkoutRepo.save).toHaveBeenCalled();
    });

    it('lanza NotFoundError si la rutina no existe', async () => {
      mockRoutineRepo.getById.mockResolvedValue(null);
      await expect(service.startWorkout('invalid')).rejects.toThrow(NotFoundError);
    });
  });

  describe('addExerciseToWorkout', () => {
    it('añade un ejercicio con el orderIndex correcto (max + 1)', async () => {
      const mockWorkout: Workout = {
        id: 'w-1',
        routineId: null,
        date: new Date(),
        durationSeconds: 0,
        notes: null,
        exercises: [
          { id: 'we-1', exerciseId: 'ex-1', orderIndex: 5, skipped: false, notes: null, supersetGroup: null, sets: [] },
        ],
      };
      mockWorkoutRepo.getById.mockResolvedValue(mockWorkout);

      await service.addExerciseToWorkout('w-1', 'ex-2');

      expect(mockWorkoutRepo.addExercise).toHaveBeenCalledWith('w-1', expect.objectContaining({
        exerciseId: 'ex-2',
        orderIndex: 6,
      }));
    });

    it('lanza NotFoundError si el workout no existe', async () => {
      mockWorkoutRepo.getById.mockResolvedValue(null);
      await expect(service.addExerciseToWorkout('w-1', 'ex-1')).rejects.toThrow(NotFoundError);
    });
  });

  describe('reorderWorkoutExercises', () => {
    it('llama al repositorio para reordenar', async () => {
      mockWorkoutRepo.getById.mockResolvedValue({ id: 'w-1', exercises: [{ id: 'we-1' }, { id: 'we-2' }] } as unknown as Workout);
      const newOrder = ['we-2', 'we-1'];
      await service.reorderWorkoutExercises('w-1', newOrder);
      expect(mockWorkoutRepo.reorderExercises).toHaveBeenCalledWith('w-1', newOrder);
    });

    it('lanza ValidationError si la lista de IDs no coincide con los ejercicios actuales', async () => {
      mockWorkoutRepo.getById.mockResolvedValue({ id: 'w-1', exercises: [{ id: 'we-1' }] } as unknown as Workout);
      const invalidOrder = ['we-99'];
      await expect(service.reorderWorkoutExercises('w-1', invalidOrder)).rejects.toThrow(ValidationError);
    });
  });

  describe('deleteWorkoutExercise', () => {
    it('elimina el ejercicio y recalcula stats', async () => {
      const mockWorkout: Workout = {
        id: 'w-1',
        date: new Date('2026-03-24'),
        exercises: [
          { id: 'we-1', exerciseId: 'ex-1', orderIndex: 0, skipped: false, notes: null, supersetGroup: null, sets: [] },
        ],
      } as unknown as Workout;
      mockWorkoutRepo.getById.mockResolvedValue(mockWorkout);

      await service.deleteWorkoutExercise('w-1', 'we-1');

      expect(mockWorkoutRepo.deleteExercise).toHaveBeenCalledWith('w-1', 'we-1');
      expect(mockStatsRepo.recalculateExerciseStats).toHaveBeenCalledWith('ex-1');
      expect(mockStatsRepo.recalculateDailyStats).toHaveBeenCalledWith('2026-03-24');
    });

    it('lanza NotFoundError si el ejercicio no está en el workout', async () => {
      mockWorkoutRepo.getById.mockResolvedValue({ id: 'w-1', exercises: [] } as unknown as Workout);
      await expect(service.deleteWorkoutExercise('w-1', 'we-99')).rejects.toThrow(NotFoundError);
    });
  });
});
