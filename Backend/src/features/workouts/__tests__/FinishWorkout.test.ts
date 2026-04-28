import type * as SQLite from 'expo-sqlite';
import { WorkoutService } from '../workout.service';
import type { WorkoutRepository } from '@entities/workout';
import type { ExerciseLoadCacheRepository } from '@entities/exercise';
import type { StatsRepository } from '@entities/stats';
import type { RoutineRepository } from '@entities/routine';
import type { Workout } from '@entities/workout';
import { NotFoundError } from '@core/errors/errors';

function createWorkout(overrides: Partial<Workout> = {}): Workout {
  return {
    id: 'w-1',
    routineId: 'r-1',
    date: new Date(Date.now() - 60 * 60 * 1000), // 1 hora atrás por defecto
    durationSeconds: 0,
    notes: null,
    exercises: [],
    ...overrides,
  };
}

describe('WorkoutService - FinishWorkout', () => {
  let service: WorkoutService;
  let mockWorkoutRepo: jest.Mocked<WorkoutRepository>;
  let mockLoadCacheRepo: jest.Mocked<ExerciseLoadCacheRepository>;

  beforeEach(() => {
    mockWorkoutRepo = {
      getById: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<WorkoutRepository>;

    mockLoadCacheRepo = {
      invalidateAll: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<ExerciseLoadCacheRepository>;

    const mockStatsRepo = {} as unknown as jest.Mocked<StatsRepository>;
    const mockRoutineRepo = {} as unknown as jest.Mocked<RoutineRepository>;
    const mockDb = {} as unknown as SQLite.SQLiteDatabase;

    service = new WorkoutService(
      mockWorkoutRepo,
      mockStatsRepo,
      mockLoadCacheRepo,
      mockRoutineRepo,
      mockDb
    );
  });

  // ─── Happy Path ──────────────────────────────────────────────

  describe('happy path', () => {
    it('calcula la duración correcta para un workout de 1 hora', async () => {
      const workout = createWorkout({ date: new Date(Date.now() - 60 * 60 * 1000) });
      mockWorkoutRepo.getById.mockResolvedValue(workout);

      const result = await service.finishWorkout('w-1');

      expect(result.durationSeconds).toBeGreaterThanOrEqual(3590);
      expect(result.durationSeconds).toBeLessThanOrEqual(3610);
    });

    it('llama a save con el workout actualizado', async () => {
      mockWorkoutRepo.getById.mockResolvedValue(createWorkout());

      await service.finishWorkout('w-1');

      expect(mockWorkoutRepo.save).toHaveBeenCalledTimes(1);
      const savedWorkout = mockWorkoutRepo.save.mock.calls[0]![0] as Workout;
      expect(savedWorkout.durationSeconds).toBeGreaterThan(0);
    });

    it('preserva id, routineId, notes y exercises del workout original', async () => {
      // Previene: spread accidental sobreescribe campos
      const workout = createWorkout({
        id: 'w-99',
        routineId: 'r-5',
        notes: 'Sesión intensa',
        exercises: [
          { id: 'we-1', exerciseId: 'ex-1', orderIndex: 0, skipped: false, notes: null, supersetGroup: null, sets: [] },
        ],
      });
      mockWorkoutRepo.getById.mockResolvedValue(workout);

      const result = await service.finishWorkout('w-99');

      expect(result.id).toBe('w-99');
      expect(result.routineId).toBe('r-5');
      expect(result.notes).toBe('Sesión intensa');
      expect(result.exercises).toHaveLength(1);
    });

    it('retorna el mismo objeto Workout (no undefined)', async () => {
      // Previene: olvidar return en la implementación
      mockWorkoutRepo.getById.mockResolvedValue(createWorkout());

      const result = await service.finishWorkout('w-1');

      expect(result).toBeDefined();
      expect(result.id).toBe('w-1');
    });
  });

  // ─── Workout No Encontrado ───────────────────────────────────

  describe('workout no encontrado', () => {
    it('lanza NotFoundError si getById retorna null', async () => {
      mockWorkoutRepo.getById.mockResolvedValue(null);

      await expect(service.finishWorkout('nonexistent')).rejects.toThrow(NotFoundError);
    });

    it('no llama a save si el workout no existe', async () => {
      // Previene: save con datos vacíos corrompe la BD
      mockWorkoutRepo.getById.mockResolvedValue(null);

      await expect(service.finishWorkout('nonexistent')).rejects.toThrow();

      expect(mockWorkoutRepo.save).not.toHaveBeenCalled();
    });
  });

  // ─── Boundary Values (duración) ─────────────────────────────

  describe('boundary values de duración', () => {
    it('workout recién iniciado (0 segundos) → duración ~0', async () => {
      // Previene: Math.floor con valor negativo por clock drift
      const workout = createWorkout({ date: new Date() });
      mockWorkoutRepo.getById.mockResolvedValue(workout);

      const result = await service.finishWorkout('w-1');

      expect(result.durationSeconds).toBeGreaterThanOrEqual(0);
      expect(result.durationSeconds).toBeLessThanOrEqual(2);
    });

    it('workout de 30 minutos → duración ~1800s', async () => {
      const workout = createWorkout({ date: new Date(Date.now() - 30 * 60 * 1000) });
      mockWorkoutRepo.getById.mockResolvedValue(workout);

      const result = await service.finishWorkout('w-1');

      expect(result.durationSeconds).toBeGreaterThanOrEqual(1795);
      expect(result.durationSeconds).toBeLessThanOrEqual(1805);
    });

    it('workout de muy larga duración (5 horas) → calcula correctamente', async () => {
      // Previene: overflow numérico o truncamiento en sesiones largas
      const workout = createWorkout({ date: new Date(Date.now() - 5 * 60 * 60 * 1000) });
      mockWorkoutRepo.getById.mockResolvedValue(workout);

      const result = await service.finishWorkout('w-1');

      expect(result.durationSeconds).toBeGreaterThanOrEqual(17990);
      expect(result.durationSeconds).toBeLessThanOrEqual(18010);
    });
  });

  // ─── Idempotencia ──────────────────────────────────────────

  describe('idempotencia', () => {
    it('no actualiza la duración si el workout ya estaba finalizado', async () => {
      const finishedWorkout = createWorkout({ durationSeconds: 3600 });
      mockWorkoutRepo.getById.mockResolvedValue(finishedWorkout);

      const result = await service.finishWorkout('w-1');

      expect(result.durationSeconds).toBe(3600);
      expect(mockWorkoutRepo.save).not.toHaveBeenCalled();
    });
  });

  // ─── Async Failures ──────────────────────────────────────────

  describe('async failures', () => {
    it('propaga error si getById falla (DB caída)', async () => {
      mockWorkoutRepo.getById.mockRejectedValue(new Error('Connection lost'));

      await expect(service.finishWorkout('w-1')).rejects.toThrow('Connection lost');
    });

    it('propaga error si save falla (disco lleno, lock)', async () => {
      // Previene: error de save se pierde y el usuario cree que finalizó
      mockWorkoutRepo.getById.mockResolvedValue(createWorkout());
      mockWorkoutRepo.save.mockRejectedValue(new Error('SQLITE_FULL'));

      await expect(service.finishWorkout('w-1')).rejects.toThrow('SQLITE_FULL');
    });
  });
});
