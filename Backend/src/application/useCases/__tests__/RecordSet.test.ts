import { RecordSetUseCase } from '../workouts/RecordSet';
import type { WorkoutRepository } from '../../../domain/repositories/WorkoutRepository';
import type { StatsRepository } from '../../../domain/repositories/StatsRepository';
import type { ExerciseStats } from '../../../domain/entities/ExerciseStats';

const mockWithTransactionAsync = jest.fn(async (cb: () => Promise<void>) => cb());

const mockDb = {
  withTransactionAsync: mockWithTransactionAsync,
} as any;

describe('RecordSetUseCase', () => {
  let useCase: RecordSetUseCase;
  let mockWorkoutRepo: jest.Mocked<WorkoutRepository>;
  let mockStatsRepo: jest.Mocked<StatsRepository>;

  beforeEach(() => {
    mockWorkoutRepo = {
      addSet: jest.fn(),
    } as unknown as jest.Mocked<WorkoutRepository>;

    mockStatsRepo = {
      getExerciseStats: jest.fn(),
      updateExerciseStats: jest.fn(),
      savePersonalRecord: jest.fn(),
      getDailyStats: jest.fn(),
      upsertDailyStats: jest.fn(),
    } as unknown as jest.Mocked<StatsRepository>;

    useCase = new RecordSetUseCase(mockWorkoutRepo, mockStatsRepo, mockDb);
    mockWithTransactionAsync.mockClear();
  });

  const validSetInput = {
    exerciseId: 'ex-1',
    setNumber: 1,
    weight: 80,
    reps: 10,
    rir: 2,
    setType: 'normal',
    durationSeconds: 0,
    completed: true,
    skipped: false,
  };

  it('debería validar y registrar un set correctamente', async () => {
    mockStatsRepo.getExerciseStats.mockResolvedValue(null);
    mockStatsRepo.getDailyStats.mockResolvedValue(null);

    const result = await useCase.execute('w-1', validSetInput);

    expect(result.set.weight).toBe(80);
    expect(result.set.reps).toBe(10);
    expect(result.set.exerciseId).toBe('ex-1');
    expect(mockWorkoutRepo.addSet).toHaveBeenCalledTimes(1);
    expect(mockStatsRepo.updateExerciseStats).toHaveBeenCalledTimes(1);
    expect(mockStatsRepo.upsertDailyStats).toHaveBeenCalledTimes(1);
  });

  it('debería ejecutar todo dentro de una transacción', async () => {
    mockStatsRepo.getExerciseStats.mockResolvedValue(null);
    mockStatsRepo.getDailyStats.mockResolvedValue(null);

    await useCase.execute('w-1', validSetInput);

    expect(mockWithTransactionAsync).toHaveBeenCalledTimes(1);
  });

  it('debería rechazar input sin exerciseId', async () => {
    const invalidInput = { ...validSetInput, exerciseId: undefined };

    await expect(useCase.execute('w-1', invalidInput)).rejects.toThrow();
  });

  it('debería acumular daily stats existentes', async () => {
    mockStatsRepo.getExerciseStats.mockResolvedValue(null);
    mockStatsRepo.getDailyStats.mockResolvedValue({
      date: '2026-03-24',
      totalVolume: 1000,
      totalSets: 5,
      totalReps: 50,
      workoutCount: 1,
      totalDuration: 3600,
    });

    const result = await useCase.execute('w-1', validSetInput);

    const upsertCall = mockStatsRepo.upsertDailyStats.mock.calls[0]![0]!;
    expect(upsertCall.totalVolume).toBe(1000 + 80 * 10);
    expect(upsertCall.totalSets).toBe(6);
    expect(upsertCall.totalReps).toBe(60);
  });

  it('debería detectar PRs nuevos cuando stats previas existen', async () => {
    const existingStats: ExerciseStats = {
      exerciseId: 'ex-1',
      maxWeight: 70,
      maxVolume: 700,
      maxReps: 8,
      estimated1RM: 90,
      totalSets: 10,
      totalReps: 80,
      totalVolume: 5000,
      lastPerformed: new Date('2026-03-20'),
      updatedAt: new Date('2026-03-20'),
    };
    mockStatsRepo.getExerciseStats.mockResolvedValue(existingStats);
    mockStatsRepo.getDailyStats.mockResolvedValue(null);

    const result = await useCase.execute('w-1', validSetInput);

    const hasWeightPR = result.newRecords.some(r => r.recordType === 'max_weight');
    expect(hasWeightPR).toBe(true);
  });
});
