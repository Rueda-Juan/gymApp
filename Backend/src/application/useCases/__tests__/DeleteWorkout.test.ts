import { DeleteWorkoutUseCase } from '../workouts/DeleteWorkoutUseCase';
import type { WorkoutRepository } from '../../../domain/repositories/WorkoutRepository';
import type { StatsRepository } from '../../../domain/repositories/StatsRepository';
import type { Workout } from '../../../domain/entities/Workout';
import { NotFoundError } from '../../../shared/errors';

const mockWithTransactionAsync = jest.fn(async (cb: () => Promise<void>) => cb());

const mockDb = {
  withTransactionAsync: mockWithTransactionAsync,
} as any;

function createWorkout(overrides: Partial<Workout> = {}): Workout {
  return {
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
    ...overrides,
  };
}

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

  // ─── Happy Path ──────────────────────────────────────────────

  describe('happy path', () => {
    it('elimina el workout y recalcula stats dentro de una transacción', async () => {
      mockWorkoutRepo.getById.mockResolvedValue(createWorkout());

      await useCase.execute('w-1');

      expect(mockWithTransactionAsync).toHaveBeenCalledTimes(1);
      expect(mockWorkoutRepo.delete).toHaveBeenCalledWith('w-1');
    });

    it('deduplica exerciseIds al recalcular stats (ex-1 aparece 2 veces)', async () => {
      // Previene: recalcular stats N veces para el mismo ejercicio = desperdicio de I/O
      mockWorkoutRepo.getById.mockResolvedValue(createWorkout());

      await useCase.execute('w-1');

      expect(mockStatsRepo.recalculateExerciseStats).toHaveBeenCalledTimes(2);
      expect(mockStatsRepo.recalculateExerciseStats).toHaveBeenCalledWith('ex-1');
      expect(mockStatsRepo.recalculateExerciseStats).toHaveBeenCalledWith('ex-2');
    });

    it('recalcula daily stats exactamente una vez para la fecha del workout', async () => {
      mockWorkoutRepo.getById.mockResolvedValue(createWorkout());

      await useCase.execute('w-1');

      expect(mockStatsRepo.recalculateDailyStats).toHaveBeenCalledTimes(1);
    });

    it('ejecuta delete ANTES de recalcular stats', async () => {
      // Previene: recalcular stats con el workout aún presente = totales inflados
      const callOrder: string[] = [];
      mockWorkoutRepo.getById.mockResolvedValue(createWorkout());
      mockWorkoutRepo.delete.mockImplementation(async () => { callOrder.push('delete'); });
      mockStatsRepo.recalculateExerciseStats.mockImplementation(async () => { callOrder.push('recalcStats'); return null; });
      mockStatsRepo.recalculateDailyStats.mockImplementation(async () => { callOrder.push('dailyStats'); return null; });

      await useCase.execute('w-1');

      expect(callOrder[0]).toBe('delete');
    });
  });

  // ─── Entity Not Found ────────────────────────────────────────

  describe('workout no encontrado', () => {
    it('lanza NotFoundError si el workout no existe', async () => {
      mockWorkoutRepo.getById.mockResolvedValue(null);

      await expect(useCase.execute('nonexistent')).rejects.toThrow(NotFoundError);
    });

    it('no ejecuta delete ni recalcula stats si no existe', async () => {
      // Previene: borrar por ID ciego sin verificar existencia
      mockWorkoutRepo.getById.mockResolvedValue(null);

      await expect(useCase.execute('nonexistent')).rejects.toThrow();

      expect(mockWorkoutRepo.delete).not.toHaveBeenCalled();
      expect(mockStatsRepo.recalculateExerciseStats).not.toHaveBeenCalled();
      expect(mockStatsRepo.recalculateDailyStats).not.toHaveBeenCalled();
    });
  });

  // ─── Edge Cases ──────────────────────────────────────────────

  describe('edge cases', () => {
    it('workout sin ejercicios no llama a recalculateExerciseStats', async () => {
      // Previene: iterar Set vacío = posible error silencioso
      mockWorkoutRepo.getById.mockResolvedValue(createWorkout({ exercises: [] }));

      await useCase.execute('w-1');

      expect(mockWorkoutRepo.delete).toHaveBeenCalledWith('w-1');
      expect(mockStatsRepo.recalculateExerciseStats).not.toHaveBeenCalled();
      expect(mockStatsRepo.recalculateDailyStats).toHaveBeenCalledTimes(1);
    });

    it('workout con un solo ejercicio recalcula stats exactamente una vez', async () => {
      const singleExWorkout = createWorkout({
        exercises: [
          { id: 'we-1', exerciseId: 'ex-1', orderIndex: 0, skipped: false, notes: null, supersetGroup: null, sets: [] },
        ],
      });
      mockWorkoutRepo.getById.mockResolvedValue(singleExWorkout);

      await useCase.execute('w-1');

      expect(mockStatsRepo.recalculateExerciseStats).toHaveBeenCalledTimes(1);
      expect(mockStatsRepo.recalculateExerciseStats).toHaveBeenCalledWith('ex-1');
    });

    it('todos los ejercicios tienen el mismo exerciseId → recalcula solo una vez', async () => {
      // Previene: Set no deduplica correctamente cuando TODOS son iguales
      const sameExWorkout = createWorkout({
        exercises: [
          { id: 'we-1', exerciseId: 'ex-1', orderIndex: 0, skipped: false, notes: null, supersetGroup: null, sets: [] },
          { id: 'we-2', exerciseId: 'ex-1', orderIndex: 1, skipped: false, notes: null, supersetGroup: null, sets: [] },
          { id: 'we-3', exerciseId: 'ex-1', orderIndex: 2, skipped: false, notes: null, supersetGroup: null, sets: [] },
        ],
      });
      mockWorkoutRepo.getById.mockResolvedValue(sameExWorkout);

      await useCase.execute('w-1');

      expect(mockStatsRepo.recalculateExerciseStats).toHaveBeenCalledTimes(1);
    });
  });

  // ─── Transaction & Error Handling ────────────────────────────

  describe('transacción y manejo de errores', () => {
    it('propaga el error si recalculateExerciseStats falla (rollback implícito)', async () => {
      // Previene: error silenciado deja stats inconsistentes post-delete
      mockWorkoutRepo.getById.mockResolvedValue(createWorkout());
      mockStatsRepo.recalculateExerciseStats.mockRejectedValue(new Error('DB error'));

      await expect(useCase.execute('w-1')).rejects.toThrow('DB error');
    });

    it('propaga el error si recalculateDailyStats falla', async () => {
      mockWorkoutRepo.getById.mockResolvedValue(createWorkout());
      mockStatsRepo.recalculateDailyStats.mockRejectedValue(new Error('Daily stats error'));

      await expect(useCase.execute('w-1')).rejects.toThrow('Daily stats error');
    });

    it('propaga el error si workoutRepo.delete falla', async () => {
      mockWorkoutRepo.getById.mockResolvedValue(createWorkout());
      mockWorkoutRepo.delete.mockRejectedValue(new Error('Delete failed'));

      await expect(useCase.execute('w-1')).rejects.toThrow('Delete failed');
    });

    it('propaga el error si getById falla (DB caída)', async () => {
      // Previene: no capturar errores de lectura antes de la transacción
      mockWorkoutRepo.getById.mockRejectedValue(new Error('Connection lost'));

      await expect(useCase.execute('w-1')).rejects.toThrow('Connection lost');
    });
  });
});
