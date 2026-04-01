import { SuggestWeightUseCase } from '../exercises/SuggestWeight';
import type { WorkoutRepository } from '../../../domain/repositories/WorkoutRepository';
import type { StatsRepository } from '../../../domain/repositories/StatsRepository';
import type { ExerciseRepository } from '../../../domain/repositories/ExerciseRepository';
import type { Workout } from '../../../domain/entities/Workout';
import type { Exercise } from '../../../domain/entities/Exercise';
import { SessionContext } from '../../../domain/valueObjects/SessionContext';

const DEFAULT_EXERCISE_ID = 'ex-1';
const DEFAULT_INCREMENT = 2.5;

const MOCK_EXERCISE = {
  id: DEFAULT_EXERCISE_ID,
  weightIncrement: DEFAULT_INCREMENT,
  primaryMuscles: ['chest'],
  secondaryMuscles: ['triceps', 'shoulders'],
  exerciseType: 'compound',
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

  beforeEach(() => {
    mockWorkoutRepo = {
      getRecent: jest.fn(),
    } as unknown as jest.Mocked<WorkoutRepository>;

    mockExerciseRepo = {
      getById: jest.fn().mockResolvedValue(MOCK_EXERCISE),
    } as unknown as jest.Mocked<ExerciseRepository>;

    mockStatsRepo = {} as unknown as jest.Mocked<StatsRepository>;

    useCase = new SuggestWeightUseCase(mockWorkoutRepo, mockStatsRepo, mockExerciseRepo);
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

  // ═══════════════════════════════════════════════════════════════
  // suggestWarmup() — Warmup Suggestion
  // ═══════════════════════════════════════════════════════════════

  describe('suggestWarmup()', () => {

    // ─── Standard Style ──────────────────────────────────────────

    describe('standard style', () => {
      it('músculo frío → 3 series (40%, 60%, 80%)', async () => {
        const ctx = new SessionContext();

        const result = await useCase.suggestWarmup(DEFAULT_EXERCISE_ID, ctx, 'standard', 100);

        expect(result.warmupSets).toHaveLength(3);
        expect(result.activationState).toBe('cold');
        expect(result.warmupStyle).toBe('standard');
        expect(result.targetWeight).toBe(100);
        expect(result.warmupSets[0]!.percentage).toBe(40);
        expect(result.warmupSets[1]!.percentage).toBe(60);
        expect(result.warmupSets[2]!.percentage).toBe(80);
        expect(result.warmupSets[0]!.weight).toBe(40);
        expect(result.warmupSets[1]!.weight).toBe(60);
        expect(result.warmupSets[2]!.weight).toBe(80);
        expect(result.recommendation).toContain('frío');
      });

      it('músculo tibio → 2 series (60%, 80%)', async () => {
        const ctx = new SessionContext();
        ctx.markAsSecondary(['chest'] as any);

        const result = await useCase.suggestWarmup(DEFAULT_EXERCISE_ID, ctx, 'standard', 100);

        expect(result.warmupSets).toHaveLength(2);
        expect(result.activationState).toBe('warm');
        expect(result.warmupSets[0]!.percentage).toBe(60);
        expect(result.warmupSets[1]!.percentage).toBe(80);
        expect(result.recommendation).toContain('tibio');
      });

      it('músculo caliente → 1 serie (70%)', async () => {
        const ctx = new SessionContext();
        ctx.markAsPrimary(['chest'] as any);

        const result = await useCase.suggestWarmup(DEFAULT_EXERCISE_ID, ctx, 'standard', 100);

        expect(result.warmupSets).toHaveLength(1);
        expect(result.activationState).toBe('hot');
        expect(result.warmupSets[0]!.percentage).toBe(70);
        expect(result.recommendation).toContain('caliente');
      });
    });

    // ─── Heavy Style ─────────────────────────────────────────────

    describe('heavy style', () => {
      it('músculo frío → 4 series (40%, 60%, 80%, 90%)', async () => {
        const ctx = new SessionContext();

        const result = await useCase.suggestWarmup(DEFAULT_EXERCISE_ID, ctx, 'heavy', 100);

        expect(result.warmupSets).toHaveLength(4);
        expect(result.warmupStyle).toBe('heavy');
        expect(result.warmupSets[0]!.percentage).toBe(40);
        expect(result.warmupSets[1]!.percentage).toBe(60);
        expect(result.warmupSets[2]!.percentage).toBe(80);
        expect(result.warmupSets[3]!.percentage).toBe(90);
      });

      it('peso >150kg → 5 series con paso extra de potenciación (95%)', async () => {
        // Previene: preparación SNC insuficiente con pesos muy pesados
        const ctx = new SessionContext();

        const result = await useCase.suggestWarmup(DEFAULT_EXERCISE_ID, ctx, 'heavy', 200);

        expect(result.warmupSets).toHaveLength(5);
        expect(result.warmupSets[4]!.percentage).toBe(95);
        expect(result.warmupSets[4]!.label).toBe('Potenciación');
        expect(result.warmupSets[4]!.weight).toBe(190);
      });

      it('peso exactamente 150kg → NO agrega paso extra', async () => {
        // Previene: off-by-one en condición >150
        const ctx = new SessionContext();

        const result = await useCase.suggestWarmup(DEFAULT_EXERCISE_ID, ctx, 'heavy', 150);

        expect(result.warmupSets).toHaveLength(4);
      });

      it('peso 151kg → SÍ agrega paso extra (boundary)', async () => {
        const ctx = new SessionContext();

        const result = await useCase.suggestWarmup(DEFAULT_EXERCISE_ID, ctx, 'heavy', 151);

        expect(result.warmupSets).toHaveLength(5);
      });
    });

    // ─── Ramp Style ──────────────────────────────────────────────

    describe('ramp style', () => {
      it('músculo caliente → 0 series (ir directo)', async () => {
        const ctx = new SessionContext();
        ctx.markAsPrimary(['chest'] as any);

        const result = await useCase.suggestWarmup(DEFAULT_EXERCISE_ID, ctx, 'ramp', 100);

        expect(result.warmupSets).toHaveLength(0);
        expect(result.recommendation).toContain('directo');
      });

      it('músculo frío → incluye movilidad dinámica como primer paso', async () => {
        const ctx = new SessionContext();

        const result = await useCase.suggestWarmup(DEFAULT_EXERCISE_ID, ctx, 'ramp', 100);

        expect(result.warmupSets.length).toBeGreaterThanOrEqual(2);
        expect(result.warmupSets[0]!.label).toContain('Movilidad');
      });
    });

    // ─── Session Context Updates ─────────────────────────────────

    describe('actualización de SessionContext', () => {
      it('marca músculos primarios como hot después del warmup', async () => {
        const ctx = new SessionContext();
        expect(ctx.getState('chest' as any)).toBe('cold');

        await useCase.suggestWarmup(DEFAULT_EXERCISE_ID, ctx, 'standard', 100);

        expect(ctx.getState('chest' as any)).toBe('hot');
      });

      it('marca músculos secundarios como warm después del warmup', async () => {
        const ctx = new SessionContext();

        await useCase.suggestWarmup(DEFAULT_EXERCISE_ID, ctx, 'standard', 100);

        expect(ctx.getState('triceps' as any)).toBe('warm');
        expect(ctx.getState('shoulders' as any)).toBe('warm');
      });
    });

    // ─── Weight Rounding ─────────────────────────────────────────

    describe('redondeo de pesos', () => {
      it('redondea al incremento del ejercicio (2.5kg)', async () => {
        const ctx = new SessionContext();

        const result = await useCase.suggestWarmup(DEFAULT_EXERCISE_ID, ctx, 'standard', 67);

        expect(result.warmupSets[0]!.weight).toBe(27.5); // 67*0.4=26.8
        expect(result.warmupSets[1]!.weight).toBe(40);   // 67*0.6=40.2
        expect(result.warmupSets[2]!.weight).toBe(52.5); // 67*0.8=53.6
      });
    });

    // ─── Edge Cases ──────────────────────────────────────────────

    describe('edge cases', () => {
      it('ejercicio no encontrado → respuesta vacía', async () => {
        mockExerciseRepo.getById.mockResolvedValue(null);
        const ctx = new SessionContext();

        const result = await useCase.suggestWarmup('nonexistent', ctx, 'standard', 100);

        expect(result.warmupSets).toHaveLength(0);
        expect(result.recommendation).toContain('no encontrado');
      });

      it('peso objetivo 0 → sin series de calentamiento', async () => {
        // Previene: warmup con 0kg genera series de peso 0 inútiles
        mockWorkoutRepo.getRecent.mockResolvedValue([]);
        const ctx = new SessionContext();

        const result = await useCase.suggestWarmup(DEFAULT_EXERCISE_ID, ctx);

        expect(result.warmupSets).toHaveLength(0);
        expect(result.targetWeight).toBe(0);
      });

      it('sin targetWeight usa execute() para inferir peso', async () => {
        // Previene: targetWeight undefined no cae en execute y retorna 0
        mockWorkoutRepo.getRecent.mockResolvedValue([
          createWorkout(new Date(), [
            { reps: 10, weight: 80, rir: 1 },
            { reps: 10, weight: 80, rir: 1 },
            { reps: 10, weight: 80, rir: 0 },
          ]),
        ]);
        const ctx = new SessionContext();

        const result = await useCase.suggestWarmup(DEFAULT_EXERCISE_ID, ctx);

        expect(result.targetWeight).toBe(80);
        expect(result.warmupSets.length).toBeGreaterThan(0);
      });
    });

    // ─── Async Failures ──────────────────────────────────────────

    describe('async failures', () => {
      it('propaga error si exerciseRepo.getById falla en warmup', async () => {
        mockExerciseRepo.getById.mockRejectedValue(new Error('Repo crash'));
        const ctx = new SessionContext();

        await expect(
          useCase.suggestWarmup(DEFAULT_EXERCISE_ID, ctx, 'standard', 100),
        ).rejects.toThrow('Repo crash');
      });
    });
  });
});

// ═══════════════════════════════════════════════════════════════
// SessionContext — Unit Tests
// ═══════════════════════════════════════════════════════════════

describe('SessionContext', () => {

  describe('estado inicial', () => {
    it('todo músculo no trackeado retorna cold', () => {
      const ctx = new SessionContext();

      expect(ctx.getState('chest' as any)).toBe('cold');
      expect(ctx.getState('back' as any)).toBe('cold');
    });
  });

  describe('markAsPrimary', () => {
    it('pone músculos en hot', () => {
      const ctx = new SessionContext();
      ctx.markAsPrimary(['chest', 'shoulders'] as any);

      expect(ctx.getState('chest' as any)).toBe('hot');
      expect(ctx.getState('shoulders' as any)).toBe('hot');
    });

    it('array vacío no lanza error', () => {
      // Previene: for..of sobre [] explota
      const ctx = new SessionContext();

      expect(() => ctx.markAsPrimary([] as any)).not.toThrow();
    });
  });

  describe('markAsSecondary', () => {
    it('pone músculos fríos en warm', () => {
      const ctx = new SessionContext();
      ctx.markAsSecondary(['triceps'] as any);

      expect(ctx.getState('triceps' as any)).toBe('warm');
    });

    it('NO degrada un músculo de hot a warm', () => {
      // Previene: perder estado de activación completa
      const ctx = new SessionContext();
      ctx.markAsPrimary(['chest'] as any);
      ctx.markAsSecondary(['chest'] as any);

      expect(ctx.getState('chest' as any)).toBe('hot');
    });

    it('múltiples llamadas warm→warm no cambian nada', () => {
      const ctx = new SessionContext();
      ctx.markAsSecondary(['triceps'] as any);
      ctx.markAsSecondary(['triceps'] as any);

      expect(ctx.getState('triceps' as any)).toBe('warm');
    });
  });

  describe('getColdestState', () => {
    it('retorna cold si hay al menos un músculo frío', () => {
      const ctx = new SessionContext();
      ctx.markAsPrimary(['chest'] as any);

      expect(ctx.getColdestState(['chest', 'triceps'] as any)).toBe('cold');
    });

    it('retorna warm si todos son warm o hot pero hay al menos uno warm', () => {
      const ctx = new SessionContext();
      ctx.markAsPrimary(['chest'] as any);
      ctx.markAsSecondary(['shoulders'] as any);

      expect(ctx.getColdestState(['chest', 'shoulders'] as any)).toBe('warm');
    });

    it('retorna hot si todos los músculos son hot', () => {
      const ctx = new SessionContext();
      ctx.markAsPrimary(['chest'] as any);

      expect(ctx.getColdestState(['chest'] as any)).toBe('hot');
    });

    it('retorna cold con lista de un solo músculo no trackeado', () => {
      const ctx = new SessionContext();

      expect(ctx.getColdestState(['glutes'] as any)).toBe('cold');
    });
  });

  describe('reset', () => {
    it('limpia todos los estados a cold', () => {
      const ctx = new SessionContext();
      ctx.markAsPrimary(['chest'] as any);
      ctx.markAsSecondary(['triceps'] as any);

      ctx.reset();

      expect(ctx.getState('chest' as any)).toBe('cold');
      expect(ctx.getState('triceps' as any)).toBe('cold');
    });

    it('getAllStates retorna vacío después de reset', () => {
      const ctx = new SessionContext();
      ctx.markAsPrimary(['chest'] as any);
      ctx.reset();

      expect(Object.keys(ctx.getAllStates())).toHaveLength(0);
    });
  });

  describe('getAllStates', () => {
    it('retorna todos los músculos trackeados con sus niveles', () => {
      const ctx = new SessionContext();
      ctx.markAsPrimary(['chest'] as any);
      ctx.markAsSecondary(['triceps'] as any);

      const states = ctx.getAllStates();

      expect(states['chest']).toBe('hot');
      expect(states['triceps']).toBe('warm');
    });

    it('retorna objeto vacío si nunca se trackeó nada', () => {
      const ctx = new SessionContext();

      expect(Object.keys(ctx.getAllStates())).toHaveLength(0);
    });
  });
});
