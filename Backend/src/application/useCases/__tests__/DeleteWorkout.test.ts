import { DeleteWorkoutUseCase } from '../workouts/DeleteWorkoutUseCase';
import type { WorkoutRepository } from '../../../domain/repositories/WorkoutRepository';
import type { StatsRepository } from '../../../domain/repositories/StatsRepository';
import type { Workout } from '../../../domain/entities/Workout';
import { NotFoundError } from '../../../shared/errors';

const mockWithTransactionAsync = jest.fn(async (cb: () => Promise<void>) => cb());

const mockDb = {
  withTransactionAsync: mockWithTransactionAsync,
} as any;

describe('DeleteWorkoutUseCase', () => {
  let useCase: DeleteWorkoutUseCase;
  let mockWorkoutRepo: jest.Mocked<WorkoutRepository>;
  let mockStatsRepo: jest.Mocked<StatsRepository>;

  beforeEach(() => {
    mockWorkoutRepo = {
      getById: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<WorkoutRepository>;

    mockStatsRepo = {
      recalculateExerciseStats: jest.fn(),
      recalculateDailyStats: jest.fn(),
    } as unknown as jest.Mocked<StatsRepository>;

    useCase = new DeleteWorkoutUseCase(mockWorkoutRepo, mockStatsRepo, mockDb);
    mockWithTransactionAsync.mockClear();
  });

  const mockWorkout: Workout = {
    id: 'w-1',
    routineId: 'r-1',
    date: new Date('2026-03-24T18:00:00Z'),
    durationSeconds: 3600,
    notes: null,
    exercises: [
      { id: 'we-1', exerciseId: 'ex-1', orderIndex: 0, skipped: false, notes: null, supersetGroup: null, sets: [] },
      { id: 'we-2', exerciseId: 'ex-2', orderIndex: 1, skipped: false, notes: null, supersetGroup: null, sets: [] },
      { id: 'we-3', exerciseId: 'ex-1', orderIndex: 2, skipped: false, notes: null, supersetGroup: null, sets: [] },
    ],
  };

  it('debería eliminar el workout y recalcular stats dentro de una transacción', async () => {
    mockWorkoutRepo.getById.mockResolvedValue(mockWorkout);

    await useCase.execute('w-1');

    expect(mockWithTransactionAsync).toHaveBeenCalledTimes(1);
    expect(mockWorkoutRepo.delete).toHaveBeenCalledWith('w-1');
  });

  it('debería recalcular stats solo para ejercicios únicos (sin duplicados)', async () => {
    mockWorkoutRepo.getById.mockResolvedValue(mockWorkout);

    await useCase.execute('w-1');

    expect(mockStatsRepo.recalculateExerciseStats).toHaveBeenCalledTimes(2);
    expect(mockStatsRepo.recalculateExerciseStats).toHaveBeenCalledWith('ex-1');
    expect(mockStatsRepo.recalculateExerciseStats).toHaveBeenCalledWith('ex-2');
  });

  it('debería recalcular daily stats para la fecha del workout', async () => {
    mockWorkoutRepo.getById.mockResolvedValue(mockWorkout);

    await useCase.execute('w-1');

    expect(mockStatsRepo.recalculateDailyStats).toHaveBeenCalledTimes(1);
  });

  it('debería lanzar NotFoundError si el workout no existe', async () => {
    mockWorkoutRepo.getById.mockResolvedValue(null);

    await expect(useCase.execute('nonexistent')).rejects.toThrow(NotFoundError);
    expect(mockWorkoutRepo.delete).not.toHaveBeenCalled();
  });

  it('debería hacer rollback si el recálculo de stats falla', async () => {
    mockWorkoutRepo.getById.mockResolvedValue(mockWorkout);
    mockStatsRepo.recalculateExerciseStats.mockRejectedValue(new Error('DB error'));
    mockWithTransactionAsync.mockImplementation(async (cb: () => Promise<void>) => {
      await cb();
    });

    await expect(useCase.execute('w-1')).rejects.toThrow('DB error');
  });
});
