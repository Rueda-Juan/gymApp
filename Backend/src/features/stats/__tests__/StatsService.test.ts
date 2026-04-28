import { StatsService } from '../stats.service';
import type { StatsRepository, DailyStats } from '@entities/stats';
import type { WorkoutSet } from '@entities/workout';
import { ValidationError } from '@core/errors/errors';

describe('StatsService', () => {
  let service: StatsService;
  let mockStatsRepo: jest.Mocked<StatsRepository>;

  beforeEach(() => {
    mockStatsRepo = {
      getWeeklyStats: jest.fn(),
      getMuscleVolumeDistribution: jest.fn(),
      getPersonalRecords: jest.fn(),
      getLatestRecord: jest.fn(),
      countRecordsSince: jest.fn(),
      getExerciseStats: jest.fn(),
    } as unknown as jest.Mocked<StatsRepository>;

    service = new StatsService(mockStatsRepo);
  });

  describe('getWeeklyStats', () => {
    it('retorna las estadísticas del repositorio', async () => {
      const mockStats: DailyStats[] = [
        { date: '2026-03-24', totalVolume: 1000, totalSets: 10, totalReps: 100, workoutCount: 1, totalDuration: 3600 },
      ];
      mockStatsRepo.getWeeklyStats.mockResolvedValue(mockStats);

      const result = await service.getWeeklyStats('2026-03-01', '2026-03-07');

      expect(result).toEqual(mockStats);
      expect(mockStatsRepo.getWeeklyStats).toHaveBeenCalledWith('2026-03-01', '2026-03-07');
    });

    it('lanza ValidationError si startDate > endDate', async () => {
      await expect(service.getWeeklyStats('2026-03-07', '2026-03-01')).rejects.toThrow(ValidationError);
    });
  });

  describe('getTrainingFrequency', () => {
    it('calcula correctamente la frecuencia y el total', async () => {
      const mockStats: DailyStats[] = [
        { date: '2026-03-24', workoutCount: 1 } as unknown as DailyStats,
        { date: '2026-03-25', workoutCount: 2 } as unknown as DailyStats,
      ];
      mockStatsRepo.getWeeklyStats.mockResolvedValue(mockStats);

      const result = await service.getTrainingFrequency('2026-03-01', '2026-03-07');

      expect(result.totalWorkouts).toBe(3);
      expect(result.workoutsPerDay).toEqual({
        '2026-03-24': 1,
        '2026-03-25': 2,
      });
    });

    it('retorna total 0 y mapa vacío si no hay datos', async () => {
      mockStatsRepo.getWeeklyStats.mockResolvedValue([]);

      const result = await service.getTrainingFrequency('2026-03-01', '2026-03-07');

      expect(result.totalWorkouts).toBe(0);
      expect(result.workoutsPerDay).toEqual({});
    });
  });

  describe('Personal Records', () => {
    it('getPersonalRecords llama al repo correctamente', async () => {
      mockStatsRepo.getPersonalRecords.mockResolvedValue([]);
      await service.getPersonalRecords('ex-1');
      expect(mockStatsRepo.getPersonalRecords).toHaveBeenCalledWith('ex-1');
    });

    it('getBestPersonalRecord llama al repo correctamente', async () => {
      mockStatsRepo.getLatestRecord.mockResolvedValue(null);
      await service.getBestPersonalRecord('ex-1', 'max_weight');
      expect(mockStatsRepo.getLatestRecord).toHaveBeenCalledWith('ex-1', 'max_weight');
    });

    it('getPRCountSince llama al repo correctamente', async () => {
      mockStatsRepo.countRecordsSince.mockResolvedValue(5);
      const result = await service.getPRCountSince('2026-01-01');
      expect(result).toBe(5);
      expect(mockStatsRepo.countRecordsSince).toHaveBeenCalledWith('2026-01-01');
    });
  });

  describe('evaluateSetPR', () => {
    it('detecta récords rotos comparando con stats actuales', async () => {
      mockStatsRepo.getExerciseStats.mockResolvedValue({
        exerciseId: 'ex-1',
        maxWeight: 50,
        maxReps: 10,
        maxVolume: 500,
        estimated1RM: 66,
        totalSets: 10,
        totalReps: 100,
        totalVolume: 5000,
        lastPerformed: new Date(),
        updatedAt: new Date(),
      });

      const mockSet: WorkoutSet = {
        exerciseId: 'ex-1',
        weight: 60, // Rompe peso
        reps: 12,   // Rompe reps
        completed: true,
      } as unknown as WorkoutSet;

      const result = await service.evaluateSetPR('ex-1', mockSet);

      expect(result.some(r => r.recordType === 'max_weight')).toBe(true);
      expect(result.some(r => r.recordType === 'max_reps')).toBe(true);
    });

    it('retorna todos los récords como nuevos si no hay stats previas', async () => {
      mockStatsRepo.getExerciseStats.mockResolvedValue(null);

      const mockSet: WorkoutSet = {
        exerciseId: 'ex-1',
        weight: 10,
        reps: 10,
        completed: true,
      } as unknown as WorkoutSet;

      const result = await service.evaluateSetPR('ex-1', mockSet);

      expect(result.length).toBeGreaterThan(0);
    });
  });
});
