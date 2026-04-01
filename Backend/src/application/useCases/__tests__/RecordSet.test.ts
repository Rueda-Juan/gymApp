import { RecordSetUseCase } from '../workouts/RecordSet';
import type { WorkoutRepository } from '../../../domain/repositories/WorkoutRepository';
import type { StatsRepository } from '../../../domain/repositories/StatsRepository';
import type { ExerciseStats } from '../../../domain/entities/ExerciseStats';
import { ValidationError } from '../../../shared/errors';

const mockWithTransactionAsync = jest.fn(async (cb: () => Promise<void>) => cb());

const mockDb = {
  withTransactionAsync: mockWithTransactionAsync,
} as any;

const VALID_SET_INPUT = {
  exerciseId: 'ex-1',
  setNumber: 1,
  weight: 80,
  reps: 10,
  rir: 2,
  setType: 'normal' as const,
  durationSeconds: 0,
  completed: true,
  skipped: false,
};

function createExistingStats(overrides: Partial<ExerciseStats> = {}): ExerciseStats {
  return {
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
    ...overrides,
  };
}

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

  // ─── Happy Path ──────────────────────────────────────────────

  describe('happy path', () => {
    it('valida, registra el set y retorna set + newRecords', async () => {
      mockStatsRepo.getExerciseStats.mockResolvedValue(null);
      mockStatsRepo.getDailyStats.mockResolvedValue(null);

      const result = await useCase.execute('w-1', VALID_SET_INPUT);

      expect(result.set.weight).toBe(80);
      expect(result.set.reps).toBe(10);
      expect(result.set.exerciseId).toBe('ex-1');
      expect(result.set.id).toBeDefined();
      expect(result.newRecords).toBeDefined();
      expect(Array.isArray(result.newRecords)).toBe(true);
    });

    it('ejecuta todo dentro de una única transacción', async () => {
      // Previene: atomicidad rota → set registrado pero stats desactualizadas
      mockStatsRepo.getExerciseStats.mockResolvedValue(null);
      mockStatsRepo.getDailyStats.mockResolvedValue(null);

      await useCase.execute('w-1', VALID_SET_INPUT);

      expect(mockWithTransactionAsync).toHaveBeenCalledTimes(1);
    });

    it('llama addSet, updateExerciseStats, y upsertDailyStats', async () => {
      mockStatsRepo.getExerciseStats.mockResolvedValue(null);
      mockStatsRepo.getDailyStats.mockResolvedValue(null);

      await useCase.execute('w-1', VALID_SET_INPUT);

      expect(mockWorkoutRepo.addSet).toHaveBeenCalledTimes(1);
      expect(mockStatsRepo.updateExerciseStats).toHaveBeenCalledTimes(1);
      expect(mockStatsRepo.upsertDailyStats).toHaveBeenCalledTimes(1);
    });
  });

  // ─── Personal Records ────────────────────────────────────────

  describe('detección de PRs', () => {
    it('detecta PR de peso cuando supera el max previo', async () => {
      // Previene: PRs no se registran → usuario no recibe feedback de progreso
      mockStatsRepo.getExerciseStats.mockResolvedValue(createExistingStats({ maxWeight: 70 }));
      mockStatsRepo.getDailyStats.mockResolvedValue(null);

      const result = await useCase.execute('w-1', { ...VALID_SET_INPUT, weight: 80 });

      const hasWeightPR = result.newRecords.some(r => r.recordType === 'max_weight');
      expect(hasWeightPR).toBe(true);
    });

    it('detecta PR de reps cuando supera previo maxReps', async () => {
      mockStatsRepo.getExerciseStats.mockResolvedValue(createExistingStats({ maxReps: 8 }));
      mockStatsRepo.getDailyStats.mockResolvedValue(null);

      const result = await useCase.execute('w-1', { ...VALID_SET_INPUT, reps: 10 });

      const hasRepsPR = result.newRecords.some(r => r.recordType === 'max_reps');
      expect(hasRepsPR).toBe(true);
    });

    it('detecta PR de volumen (peso × reps > previo maxVolume)', async () => {
      mockStatsRepo.getExerciseStats.mockResolvedValue(createExistingStats({ maxVolume: 700 }));
      mockStatsRepo.getDailyStats.mockResolvedValue(null);

      const result = await useCase.execute('w-1', { ...VALID_SET_INPUT, weight: 80, reps: 10 });

      const hasVolumePR = result.newRecords.some(r => r.recordType === 'max_volume');
      expect(hasVolumePR).toBe(true);
    });

    it('detecta PR de 1RM estimado', async () => {
      mockStatsRepo.getExerciseStats.mockResolvedValue(createExistingStats({ estimated1RM: 90 }));
      mockStatsRepo.getDailyStats.mockResolvedValue(null);

      const result = await useCase.execute('w-1', { ...VALID_SET_INPUT, weight: 80, reps: 10 });

      // Epley: 80 * (1 + 10/30) = 106.67 > 90
      const has1RMPR = result.newRecords.some(r => r.recordType === 'estimated_1rm');
      expect(has1RMPR).toBe(true);
    });

    it('no detecta PRs cuando el set está por debajo de todos los máximos', async () => {
      mockStatsRepo.getExerciseStats.mockResolvedValue(createExistingStats({
        maxWeight: 150,
        maxVolume: 2000,
        maxReps: 20,
        estimated1RM: 200,
      }));
      mockStatsRepo.getDailyStats.mockResolvedValue(null);

      const result = await useCase.execute('w-1', VALID_SET_INPUT);

      expect(result.newRecords).toHaveLength(0);
    });

    it('guarda cada PR en el repositorio con savePersonalRecord', async () => {
      // Previene: PRs detectados pero no persistidos
      mockStatsRepo.getExerciseStats.mockResolvedValue(null);
      mockStatsRepo.getDailyStats.mockResolvedValue(null);

      const result = await useCase.execute('w-1', VALID_SET_INPUT);

      expect(mockStatsRepo.savePersonalRecord).toHaveBeenCalledTimes(result.newRecords.length);
    });

    it('detecta 4 PRs simultáneos cuando no existen stats previas', async () => {
      // Previene: primer set del ejercicio no registra todos los PRs
      mockStatsRepo.getExerciseStats.mockResolvedValue(null);
      mockStatsRepo.getDailyStats.mockResolvedValue(null);

      const result = await useCase.execute('w-1', VALID_SET_INPUT);

      expect(result.newRecords.length).toBe(4);
    });
  });

  // ─── Daily Stats Accumulation ────────────────────────────────

  describe('acumulación de daily stats', () => {
    it('acumula volumen, sets y reps sobre stats diarios existentes', async () => {
      // Previene: upsert sobreescribe en vez de acumular → stats diarios incorrectos
      mockStatsRepo.getExerciseStats.mockResolvedValue(null);
      mockStatsRepo.getDailyStats.mockResolvedValue({
        date: '2026-03-24',
        totalVolume: 1000,
        totalSets: 5,
        totalReps: 50,
        workoutCount: 1,
        totalDuration: 3600,
      });

      await useCase.execute('w-1', VALID_SET_INPUT);

      const upsertCall = mockStatsRepo.upsertDailyStats.mock.calls[0]![0]!;
      expect(upsertCall.totalVolume).toBe(1000 + 80 * 10); // 1800
      expect(upsertCall.totalSets).toBe(6);
      expect(upsertCall.totalReps).toBe(60);
    });

    it('crea daily stats nuevos cuando no existen (primer set del día)', async () => {
      mockStatsRepo.getExerciseStats.mockResolvedValue(null);
      mockStatsRepo.getDailyStats.mockResolvedValue(null);

      await useCase.execute('w-1', VALID_SET_INPUT);

      const upsertCall = mockStatsRepo.upsertDailyStats.mock.calls[0]![0]!;
      expect(upsertCall.totalVolume).toBe(800);
      expect(upsertCall.totalSets).toBe(1);
      expect(upsertCall.totalReps).toBe(10);
      expect(upsertCall.workoutCount).toBe(1);
    });

    it('preserva workoutCount y totalDuration existentes', async () => {
      // Previene: resetear workoutCount a 1 en cada set
      mockStatsRepo.getExerciseStats.mockResolvedValue(null);
      mockStatsRepo.getDailyStats.mockResolvedValue({
        date: '2026-03-24',
        totalVolume: 500,
        totalSets: 3,
        totalReps: 30,
        workoutCount: 2,
        totalDuration: 7200,
      });

      await useCase.execute('w-1', VALID_SET_INPUT);

      const upsertCall = mockStatsRepo.upsertDailyStats.mock.calls[0]![0]!;
      expect(upsertCall.workoutCount).toBe(2);
      expect(upsertCall.totalDuration).toBe(7200);
    });
  });

  // ─── Input Validation (Zod) ──────────────────────────────────

  describe('validación de input', () => {
    it('rechaza input sin exerciseId', async () => {
      const noExerciseId = { ...VALID_SET_INPUT, exerciseId: undefined };

      await expect(useCase.execute('w-1', noExerciseId)).rejects.toThrow();
    });

    it('rechaza exerciseId vacío', async () => {
      // Previene: set con exerciseId '' pasa y corrompe las relaciones
      const emptyExerciseId = { ...VALID_SET_INPUT, exerciseId: '' };

      await expect(useCase.execute('w-1', emptyExerciseId)).rejects.toThrow();
    });

    it('rechaza peso negativo', async () => {
      const negativeWeight = { ...VALID_SET_INPUT, weight: -5 };

      await expect(useCase.execute('w-1', negativeWeight)).rejects.toThrow();
    });

    it('rechaza reps negativas', async () => {
      const negativeReps = { ...VALID_SET_INPUT, reps: -1 };

      await expect(useCase.execute('w-1', negativeReps)).rejects.toThrow();
    });

    it('rechaza setType inválido', async () => {
      const invalidSetType = { ...VALID_SET_INPUT, setType: 'superduper' };

      await expect(useCase.execute('w-1', invalidSetType)).rejects.toThrow();
    });

    it('rechaza rir fuera de rango (>10)', async () => {
      const badRir = { ...VALID_SET_INPUT, rir: 15 };

      await expect(useCase.execute('w-1', badRir)).rejects.toThrow();
    });

    it('rechaza rir negativo', async () => {
      const negRir = { ...VALID_SET_INPUT, rir: -1 };

      await expect(useCase.execute('w-1', negRir)).rejects.toThrow();
    });

    it('rechaza input null', async () => {
      await expect(useCase.execute('w-1', null)).rejects.toThrow();
    });

    it('rechaza input undefined', async () => {
      await expect(useCase.execute('w-1', undefined)).rejects.toThrow();
    });

    it('rechaza input que no es objeto (string)', async () => {
      await expect(useCase.execute('w-1', 'not an object')).rejects.toThrow();
    });

    it('rechaza input que no es objeto (number)', async () => {
      await expect(useCase.execute('w-1', 42)).rejects.toThrow();
    });
  });

  // ─── Boundary Values ────────────────────────────────────────

  describe('boundary values', () => {
    it('acepta peso 0 (ejercicios de peso corporal)', async () => {
      mockStatsRepo.getExerciseStats.mockResolvedValue(null);
      mockStatsRepo.getDailyStats.mockResolvedValue(null);

      const zeroWeight = { ...VALID_SET_INPUT, weight: 0 };
      const result = await useCase.execute('w-1', zeroWeight);

      expect(result.set.weight).toBe(0);
    });

    it('acepta 0 reps (set abortado pero válido según schema)', async () => {
      mockStatsRepo.getExerciseStats.mockResolvedValue(null);
      mockStatsRepo.getDailyStats.mockResolvedValue(null);

      const zeroReps = { ...VALID_SET_INPUT, reps: 0 };
      const result = await useCase.execute('w-1', zeroReps);

      expect(result.set.reps).toBe(0);
    });

    it('acepta rir = 0 (fallo muscular total)', async () => {
      mockStatsRepo.getExerciseStats.mockResolvedValue(null);
      mockStatsRepo.getDailyStats.mockResolvedValue(null);

      const zeroRir = { ...VALID_SET_INPUT, rir: 0 };
      const result = await useCase.execute('w-1', zeroRir);

      expect(result.set.rir).toBe(0);
    });

    it('acepta rir = 10 (muy fácil)', async () => {
      mockStatsRepo.getExerciseStats.mockResolvedValue(null);
      mockStatsRepo.getDailyStats.mockResolvedValue(null);

      const maxRir = { ...VALID_SET_INPUT, rir: 10 };
      const result = await useCase.execute('w-1', maxRir);

      expect(result.set.rir).toBe(10);
    });

    it('acepta rir null (no reportado)', async () => {
      mockStatsRepo.getExerciseStats.mockResolvedValue(null);
      mockStatsRepo.getDailyStats.mockResolvedValue(null);

      const nullRir = { ...VALID_SET_INPUT, rir: null };
      const result = await useCase.execute('w-1', nullRir);

      expect(result.set.rir).toBeNull();
    });
  });

  // ─── Async Failures ──────────────────────────────────────────

  describe('async failures', () => {
    it('propaga error si addSet falla', async () => {
      mockStatsRepo.getExerciseStats.mockResolvedValue(null);
      mockStatsRepo.getDailyStats.mockResolvedValue(null);
      mockWorkoutRepo.addSet.mockRejectedValue(new Error('FK violation'));

      await expect(useCase.execute('w-1', VALID_SET_INPUT)).rejects.toThrow('FK violation');
    });

    it('propaga error si getExerciseStats falla', async () => {
      mockStatsRepo.getExerciseStats.mockRejectedValue(new Error('Stats table locked'));
      mockStatsRepo.getDailyStats.mockResolvedValue(null);

      await expect(useCase.execute('w-1', VALID_SET_INPUT)).rejects.toThrow('Stats table locked');
    });

    it('propaga error si upsertDailyStats falla', async () => {
      mockStatsRepo.getExerciseStats.mockResolvedValue(null);
      mockStatsRepo.getDailyStats.mockResolvedValue(null);
      mockStatsRepo.upsertDailyStats.mockRejectedValue(new Error('Upsert failed'));

      await expect(useCase.execute('w-1', VALID_SET_INPUT)).rejects.toThrow('Upsert failed');
    });

    it('no llama a repos si la validación falla (antes de la transacción)', async () => {
      // Previene: transacción abierta innecesariamente con input inválido
      await expect(useCase.execute('w-1', { weight: -1 })).rejects.toThrow();

      expect(mockWithTransactionAsync).not.toHaveBeenCalled();
      expect(mockWorkoutRepo.addSet).not.toHaveBeenCalled();
    });
  });
});
