import { SuggestWeightUseCase } from '../services/suggest-weight';
import type { WorkoutRepository } from '../../workouts/workout.repository';
import type { StatsRepository } from '../../stats/stats.repository';
import type { ExerciseRepository } from '../exercise.repository';
import type { ExerciseLoadCacheRepository } from '../exercise-load-cache.repository';
import type { Workout } from '../../workouts/workout.entity';
import type { Exercise } from '../exercise.entity';
import { PlateRounder } from '../utils/plate-rounder';
import { SessionContext } from '../../../core/types/session-context';

const DEFAULT_EXERCISE_ID = 'ex-1';
const DEFAULT_INCREMENT = 2.5;

const MOCK_EXERCISE = {
  id: DEFAULT_EXERCISE_ID,
  weightIncrement: DEFAULT_INCREMENT,
  primaryMuscles: ['chest'],
  secondaryMuscles: ['triceps', 'shoulders'],
  exerciseType: 'compound',
  loadType: 'weighted',
} as unknown as Exercise;

function createWorkout(date: Date, sets: any[]): Workout {
  return {
    id: `w-${date.getTime()}`,
    date,
    exercises: [
      {
        id: 'we-1',
        exerciseId: DEFAULT_EXERCISE_ID,
        skipped: false,
        sets: sets.map((s, i) => ({
          ...s,
          id: `s-${i}`,
          completed: true,
          skipped: false,
          setType: 'normal',
          restSeconds: null,
          durationSeconds: 0,
          createdAt: date,
        })),
        orderIndex: 0,
        notes: null,
        supersetGroup: null,
      },
    ],
  } as Workout;
}

describe('SuggestWeightUseCase', () => {
  let useCase: SuggestWeightUseCase;
  let mockWorkoutRepo: jest.Mocked<WorkoutRepository>;
  let mockStatsRepo: jest.Mocked<StatsRepository>;
  let mockExerciseRepo: jest.Mocked<ExerciseRepository>;
  let mockLoadCacheRepo: jest.Mocked<ExerciseLoadCacheRepository>;

  beforeEach(() => {
    mockWorkoutRepo = {
      getRecent: jest.fn(),
    } as unknown as jest.Mocked<WorkoutRepository>;

    mockExerciseRepo = {
      getById: jest.fn().mockResolvedValue(MOCK_EXERCISE),
    } as unknown as jest.Mocked<ExerciseRepository>;

    mockStatsRepo = {} as unknown as jest.Mocked<StatsRepository>;

    mockLoadCacheRepo = {
      get: jest.fn().mockResolvedValue(null),
      upsert: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<ExerciseLoadCacheRepository>;

    useCase = new SuggestWeightUseCase(
      mockWorkoutRepo,
      mockStatsRepo,
      mockExerciseRepo,
      mockLoadCacheRepo,
      new PlateRounder(),
    );
  });

  // ═══════════════════════════════════════════════════════════════
  // execute() — Weight Suggestion
  // ═══════════════════════════════════════════════════════════════

  describe('execute()', () => {

    // ─── No History / Default ────────────────────────────────────

    describe('sin historial', () => {
      it('retorna weight=0 y basis=default si no hay workouts', async () => {
        mockWorkoutRepo.getRecent.mockResolvedValue([]);

        const result = await useCase.execute(DEFAULT_EXERCISE_ID, 8, 12);

        expect(result.suggestedWeight).toBe(0);
        expect(result.basis).toBe('default');
        expect(result.lastWeight).toBeNull();
        expect(result.lastReps).toBeNull();
      });

      it('retorna default si los workouts no contienen el ejercicio solicitado', async () => {
        // Previene: historial de otro ejercicio confunde la sugerencia
        const otherExerciseWorkout: Workout = {
          id: 'w-1',
          date: new Date(),
          exercises: [{
            id: 'we-1',
            exerciseId: 'ex-OTHER',
            skipped: false,
            sets: [{ id: 's-1', weight: 100, reps: 10, completed: true, skipped: false, setType: 'normal', restSeconds: null, durationSeconds: 0, createdAt: new Date() }],
            orderIndex: 0,
            notes: null,
            supersetGroup: null,
          }],
        } as Workout;
        mockWorkoutRepo.getRecent.mockResolvedValue([otherExerciseWorkout]);

        const result = await useCase.execute(DEFAULT_EXERCISE_ID, 8, 12);

        expect(result.basis).toBe('default');
      });

      it('retorna default si el ejercicio fue marcado como skipped en todos los workouts', async () => {
        // Previene: ejercicio saltado se interpreta como sesión válida
        const skippedWorkout = {
          id: 'w-1',
          routineId: null,
          date: new Date(),
          durationSeconds: 0,
          notes: null,
          exercises: [{
            id: 'we-1',
            exerciseId: DEFAULT_EXERCISE_ID,
            skipped: true,
            sets: [],
            orderIndex: 0,
            notes: null,
            supersetGroup: null,
          }],
        } as Workout;
        mockWorkoutRepo.getRecent.mockResolvedValue([skippedWorkout]);

        const result = await useCase.execute(DEFAULT_EXERCISE_ID, 8, 12);

        expect(result.basis).toBe('default');
      });

      it('retorna default si todos los sets están incompletos (completed=false)', async () => {
        // Previene: sets no completados se usan para calcular progresión
        const incompleteWorkout: Workout = {
          id: 'w-1',
          date: new Date(),
          exercises: [{
            id: 'we-1',
            exerciseId: DEFAULT_EXERCISE_ID,
            skipped: false,
            sets: [{ id: 's-1', weight: 80, reps: 10, completed: false, skipped: false, setType: 'normal', restSeconds: null, durationSeconds: 0, createdAt: new Date() }],
            orderIndex: 0,
            notes: null,
            supersetGroup: null,
          }],
        } as Workout;
        mockWorkoutRepo.getRecent.mockResolvedValue([incompleteWorkout]);

        const result = await useCase.execute(DEFAULT_EXERCISE_ID, 8, 12);

        expect(result.basis).toBe('default');
      });

      it('retorna default si el ejercicio no existe en exerciseRepo', async () => {
        mockExerciseRepo.getById.mockResolvedValue(null);

        const result = await useCase.execute('nonexistent', 8, 12);

        expect(result.basis).toBe('default');
        expect(result.suggestedWeight).toBe(0);
      });
    });

    // ─── Double Progression (last_set) ───────────────────────────

    describe('doble progresión (last_set)', () => {
      it('mantiene el peso si las reps están en rango pero no en el tope', async () => {
        mockWorkoutRepo.getRecent.mockResolvedValue([
          createWorkout(new Date(), [
            { reps: 10, weight: 60, rir: 2 },
            { reps: 10, weight: 60, rir: 1 },
            { reps: 9, weight: 60, rir: 0 },
          ]),
        ]);

        const result = await useCase.execute(DEFAULT_EXERCISE_ID, 8, 12);

        expect(result.suggestedWeight).toBe(60);
        expect(result.basis).toBe('last_set');
      });

      it('lastWeight y lastReps reflejan el último set completado', async () => {
        // Previene: retornar peso del primer set en vez del último
        mockWorkoutRepo.getRecent.mockResolvedValue([
          createWorkout(new Date(), [
            { reps: 10, weight: 60, rir: 2 },
            { reps: 9, weight: 60, rir: 1 },
            { reps: 8, weight: 55, rir: 0 },
          ]),
        ]);

        const result = await useCase.execute(DEFAULT_EXERCISE_ID, 8, 12);

        expect(result.lastWeight).toBe(55);
        expect(result.lastReps).toBe(8);
      });
    });

    // ─── Progressive Overload ────────────────────────────────────

    describe('progressive overload', () => {
      it('sube peso cuando todas las series alcanzan maxReps', async () => {
        mockWorkoutRepo.getRecent.mockResolvedValue([
          createWorkout(new Date(), [
            { reps: 12, weight: 60, rir: 2 },
            { reps: 12, weight: 60, rir: 1 },
            { reps: 12, weight: 60, rir: 0 },
          ]),
        ]);

        const result = await useCase.execute(DEFAULT_EXERCISE_ID, 8, 12);

        expect(result.suggestedWeight).toBe(62.5);
        expect(result.basis).toBe('progressive_overload');
      });

      it('sube peso cuando todas las series reportan RIR > 4 (demasiado fácil)', async () => {
        mockWorkoutRepo.getRecent.mockResolvedValue([
          createWorkout(new Date(), [
            { reps: 8, weight: 60, rir: 5 },
            { reps: 8, weight: 60, rir: 5 },
            { reps: 8, weight: 60, rir: 5 },
          ]),
        ]);

        const result = await useCase.execute(DEFAULT_EXERCISE_ID, 8, 12);

        expect(result.suggestedWeight).toBe(62.5);
        expect(result.basis).toBe('progressive_overload');
      });

      it('no sube peso si solo ALGUNAS series llegan a maxReps', async () => {
        // Previene: subir peso prematuramente con solo 2/3 series en el tope
        mockWorkoutRepo.getRecent.mockResolvedValue([
          createWorkout(new Date(), [
            { reps: 12, weight: 60, rir: 1 },
            { reps: 12, weight: 60, rir: 0 },
            { reps: 10, weight: 60, rir: 0 },
          ]),
        ]);

        const result = await useCase.execute(DEFAULT_EXERCISE_ID, 8, 12);

        expect(result.basis).not.toBe('progressive_overload');
      });

      it('no sube si RIR alto en algunas pero no todas', async () => {
        mockWorkoutRepo.getRecent.mockResolvedValue([
          createWorkout(new Date(), [
            { reps: 8, weight: 60, rir: 5 },
            { reps: 8, weight: 60, rir: 3 },
            { reps: 8, weight: 60, rir: 5 },
          ]),
        ]);

        const result = await useCase.execute(DEFAULT_EXERCISE_ID, 8, 12);

        expect(result.basis).toBe('last_set');
      });
    });

    // ─── Failure Recovery ────────────────────────────────────────

    describe('failure recovery', () => {
      it('reduce peso si algún set cae bajo minReps', async () => {
        mockWorkoutRepo.getRecent.mockResolvedValue([
          createWorkout(new Date(), [
            { reps: 8, weight: 60, rir: 0 },
            { reps: 8, weight: 60, rir: 0 },
            { reps: 6, weight: 60, rir: 0 },
          ]),
        ]);

        const result = await useCase.execute(DEFAULT_EXERCISE_ID, 8, 12);

        expect(result.suggestedWeight).toBe(57.5);
        expect(result.basis).toBe('failure_recovery');
      });

      it('no reduce a negativo (peso mínimo 0)', async () => {
        // Previene: peso sugerido negativo si lastWeight < increment
        mockWorkoutRepo.getRecent.mockResolvedValue([
          createWorkout(new Date(), [
            { reps: 5, weight: 2, rir: 0 },
          ]),
        ]);

        const result = await useCase.execute(DEFAULT_EXERCISE_ID, 8, 12);

        expect(result.suggestedWeight).toBeGreaterThanOrEqual(0);
      });

      it('incluye mensaje de feedback en failure_recovery', async () => {
        mockWorkoutRepo.getRecent.mockResolvedValue([
          createWorkout(new Date(), [
            { reps: 5, weight: 60, rir: 0 },
          ]),
        ]);

        const result = await useCase.execute(DEFAULT_EXERCISE_ID, 8, 12);

        expect(result.message).toBeDefined();
      });
    });

    // ─── Deload (Estancamiento) ──────────────────────────────────

    describe('deload por estancamiento', () => {
      it('sugiere deload -15% tras 3 sesiones estancadas (mismo peso y volumen)', async () => {
        const stuckWorkout = createWorkout(new Date(), [
          { reps: 10, weight: 60, rir: 0 },
          { reps: 10, weight: 60, rir: 0 },
          { reps: 10, weight: 60, rir: 0 },
        ]);

        mockWorkoutRepo.getRecent.mockResolvedValue([
          stuckWorkout, stuckWorkout, stuckWorkout,
        ]);

        const result = await useCase.execute(DEFAULT_EXERCISE_ID, 8, 12);

        // 60 * 0.85 = 51 → round to 2.5 → 50
        expect(result.suggestedWeight).toBe(50);
        expect(result.basis).toBe('deload');
        expect(result.message).toContain('descarga');
      });

      it('no sugiere deload si el volumen aumentó en la última sesión', async () => {
        const olderWorkout = createWorkout(new Date('2026-03-01'), [
          { reps: 10, weight: 60, rir: 0 },
          { reps: 9, weight: 60, rir: 0 },
          { reps: 8, weight: 60, rir: 0 },
        ]);

        const newerWorkout = createWorkout(new Date('2026-03-05'), [
          { reps: 10, weight: 60, rir: 0 },
          { reps: 10, weight: 60, rir: 0 },
          { reps: 9, weight: 60, rir: 0 },
        ]);

        mockWorkoutRepo.getRecent.mockResolvedValue([
          newerWorkout, olderWorkout, olderWorkout,
        ]);

        const result = await useCase.execute(DEFAULT_EXERCISE_ID, 8, 12);

        expect(result.basis).not.toBe('deload');
      });

      it('no sugiere deload con solo 2 sesiones (necesita 3)', async () => {
        // Previene: deload prematuro con datos insuficientes
        const workout = createWorkout(new Date(), [
          { reps: 10, weight: 60, rir: 0 },
          { reps: 10, weight: 60, rir: 0 },
          { reps: 10, weight: 60, rir: 0 },
        ]);

        mockWorkoutRepo.getRecent.mockResolvedValue([workout, workout]);

        const result = await useCase.execute(DEFAULT_EXERCISE_ID, 8, 12);

        expect(result.basis).not.toBe('deload');
      });

      it('deload no baja por debajo de 0', async () => {
        // Previene: peso negativo con pesos muy bajos
        const lightWorkout = createWorkout(new Date(), [
          { reps: 10, weight: 5, rir: 0 },
          { reps: 10, weight: 5, rir: 0 },
          { reps: 10, weight: 5, rir: 0 },
        ]);

        mockWorkoutRepo.getRecent.mockResolvedValue([
          lightWorkout, lightWorkout, lightWorkout,
        ]);

        const result = await useCase.execute(DEFAULT_EXERCISE_ID, 8, 12);

        expect(result.suggestedWeight).toBeGreaterThanOrEqual(0);
      });
    });

    // ─── Priority: failure_recovery > deload ─────────────────────

    describe('prioridad entre reglas', () => {
      it('deload tiene prioridad sobre failure_recovery (se evalúa antes)', async () => {
        // Previene: confundir orden de evaluación; deload (paso 3) va antes que failure (paso 4)
        const stuckWorkout = createWorkout(new Date(), [
          { reps: 10, weight: 60, rir: 0 },
          { reps: 10, weight: 60, rir: 0 },
          { reps: 10, weight: 60, rir: 0 },
        ]);
        const failedWorkout = createWorkout(new Date(), [
          { reps: 8, weight: 60, rir: 0 },
          { reps: 7, weight: 60, rir: 0 },
          { reps: 5, weight: 60, rir: 0 },
        ]);

        mockWorkoutRepo.getRecent.mockResolvedValue([
          failedWorkout, stuckWorkout, stuckWorkout,
        ]);

        const result = await useCase.execute(DEFAULT_EXERCISE_ID, 8, 12);

        expect(result.basis).toBe('deload');
      });
    });

    // ─── Async Failures ──────────────────────────────────────────

    describe('async failures', () => {
      it('propaga error si getRecent falla', async () => {
        mockWorkoutRepo.getRecent.mockRejectedValue(new Error('DB timeout'));

        await expect(useCase.execute(DEFAULT_EXERCISE_ID)).rejects.toThrow('DB timeout');
      });

      it('propaga error si exerciseRepo.getById falla', async () => {
        mockExerciseRepo.getById.mockRejectedValue(new Error('Exercise DB error'));

        await expect(useCase.execute(DEFAULT_EXERCISE_ID)).rejects.toThrow('Exercise DB error');
      });
    });
  });

});
