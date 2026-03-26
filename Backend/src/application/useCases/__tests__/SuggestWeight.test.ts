import { SuggestWeightUseCase } from '../exercises/SuggestWeight';
import type { WorkoutRepository } from '../../../domain/repositories/WorkoutRepository';
import type { StatsRepository } from '../../../domain/repositories/StatsRepository';
import type { ExerciseRepository } from '../../../domain/repositories/ExerciseRepository';
import type { Workout } from '../../../domain/entities/Workout';
import type { Exercise } from '../../../domain/entities/Exercise';
import { SessionContext } from '../../../domain/valueObjects/SessionContext';

describe('SuggestWeightUseCase', () => {
  let useCase: SuggestWeightUseCase;
  let mockWorkoutRepo: jest.Mocked<WorkoutRepository>;
  let mockStatsRepo: jest.Mocked<StatsRepository>;
  let mockExerciseRepo: jest.Mocked<ExerciseRepository>;

  const defaultExerciseId = 'ex-1';
  const defaultIncrement = 2.5;
  const mockExercise = {
    id: defaultExerciseId,
    weightIncrement: defaultIncrement,
    primaryMuscles: ['chest'],
    secondaryMuscles: ['triceps', 'shoulders'],
    exerciseType: 'compound',
  } as unknown as Exercise;

  beforeEach(() => {
    mockWorkoutRepo = {
      getRecent: jest.fn(),
    } as unknown as jest.Mocked<WorkoutRepository>;

    mockExerciseRepo = {
      getById: jest.fn().mockResolvedValue(mockExercise),
    } as unknown as jest.Mocked<ExerciseRepository>;

    mockStatsRepo = {} as unknown as jest.Mocked<StatsRepository>;

    useCase = new SuggestWeightUseCase(mockWorkoutRepo, mockStatsRepo, mockExerciseRepo);
  });

  const createWorkout = (date: Date, sets: any[]): Workout => ({
    id: `w-${date.getTime()}`,
    date,
    exercises: [
      {
        id: 'we-1',
        exerciseId: defaultExerciseId,
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
  } as Workout);

  // ─── Existing Weight Suggestion Tests ──────────────────────

  it('debería retornar default 0 si no hay historial', async () => {
    mockWorkoutRepo.getRecent.mockResolvedValue([]);
    const result = await useCase.execute(defaultExerciseId, 8, 12);
    expect(result.suggestedWeight).toBe(0);
    expect(result.basis).toBe('default');
  });

  it('debería mantener el peso (doble progresión) si está en rango pero no en el tope', async () => {
    // 3 series de 10 reps con 60kg (min=8, max=12)
    mockWorkoutRepo.getRecent.mockResolvedValue([
      createWorkout(new Date(), [
        { reps: 10, weight: 60, rir: 2 },
        { reps: 10, weight: 60, rir: 1 },
        { reps: 9, weight: 60, rir: 0 },
      ]),
    ]);

    const result = await useCase.execute(defaultExerciseId, 8, 12);
    expect(result.suggestedWeight).toBe(60);
    expect(result.basis).toBe('last_set');
  });

  it('debería sugerir progressive_overload si todas las series alcanzan maxReps', async () => {
    // 3 series de 12 reps (tope del rango 8-12)
    mockWorkoutRepo.getRecent.mockResolvedValue([
      createWorkout(new Date(), [
        { reps: 12, weight: 60, rir: 2 },
        { reps: 12, weight: 60, rir: 1 },
        { reps: 12, weight: 60, rir: 0 },
      ]),
    ]);

    const result = await useCase.execute(defaultExerciseId, 8, 12);
    expect(result.suggestedWeight).toBe(62.5); // 60 + 2.5
    expect(result.basis).toBe('progressive_overload');
  });

  it('debería sugerir progressive_overload si todas las series reportan RIR > 4', async () => {
    // Solo hace el mínimo (8 reps) pero avisa que le sobraban 5 reps en cada serie
    mockWorkoutRepo.getRecent.mockResolvedValue([
      createWorkout(new Date(), [
        { reps: 8, weight: 60, rir: 5 },
        { reps: 8, weight: 60, rir: 5 },
        { reps: 8, weight: 60, rir: 5 },
      ]),
    ]);

    const result = await useCase.execute(defaultExerciseId, 8, 12);
    expect(result.suggestedWeight).toBe(62.5); // 60 + 2.5
    expect(result.basis).toBe('progressive_overload');
  });

  it('debería sugerir una reducción (failure_recovery) si no llega a minReps', async () => {
    // 3 series con 60kg, pero la última hace 6 reps (por debajo del min=8)
    mockWorkoutRepo.getRecent.mockResolvedValue([
      createWorkout(new Date(), [
        { reps: 8, weight: 60, rir: 0 },
        { reps: 8, weight: 60, rir: 0 },
        { reps: 6, weight: 60, rir: 0 },
      ]),
    ]);

    const result = await useCase.execute(defaultExerciseId, 8, 12);
    expect(result.suggestedWeight).toBe(57.5); // 60 - 2.5
    expect(result.basis).toBe('failure_recovery');
  });

  it('debería detectar estancamiento y sugerir deload (-15%) tras 3 sesiones estancado', async () => {
    // 3 sesiones exactamente iguales: 60kg x 3 series de 10 reps (mismo maxWeight, mismo volume)
    const stuckWorkout = createWorkout(new Date(), [
      { reps: 10, weight: 60, rir: 0 },
      { reps: 10, weight: 60, rir: 0 },
      { reps: 10, weight: 60, rir: 0 },
    ]);

    mockWorkoutRepo.getRecent.mockResolvedValue([
      stuckWorkout, stuckWorkout, stuckWorkout
    ]);

    const result = await useCase.execute(defaultExerciseId, 8, 12);
    // 60 * 0.85 = 51 -> redondeado al 2.5 más cercano -> 50
    expect(result.suggestedWeight).toBe(50);
    expect(result.basis).toBe('deload');
    expect(result.message).toContain('descarga');
  });

  it('no debería sugerir deload si el volumen aumentó en la última sesión', async () => {
    const olderWorkout = createWorkout(new Date('2026-03-01'), [
      { reps: 10, weight: 60, rir: 0 },
      { reps: 9, weight: 60, rir: 0 }, // 10+9+8 = 27 reps totales
      { reps: 8, weight: 60, rir: 0 },
    ]);

    const newerWorkout = createWorkout(new Date('2026-03-05'), [
      { reps: 10, weight: 60, rir: 0 },
      { reps: 10, weight: 60, rir: 0 }, // 10+10+9 = 29 reps totales (volumen subió)
      { reps: 9, weight: 60, rir: 0 },
    ]);

    mockWorkoutRepo.getRecent.mockResolvedValue([
      newerWorkout, olderWorkout, olderWorkout
    ]);

    const result = await useCase.execute(defaultExerciseId, 8, 12);
    // Hubo progreso en volumen, no requiere deload
    expect(result.suggestedWeight).toBe(60);
    expect(result.basis).toBe('last_set');
  });

  // ─── Warmup Suggestion Tests ──────────────────────────────

  describe('suggestWarmup', () => {
    it('músculo frío + estilo standard → 3 series de calentamiento completo', async () => {
      const ctx = new SessionContext();
      const result = await useCase.suggestWarmup(defaultExerciseId, ctx, 'standard', 100);

      expect(result.warmupSets).toHaveLength(3);
      expect(result.activationState).toBe('cold');
      expect(result.warmupStyle).toBe('standard');
      expect(result.targetWeight).toBe(100);

      // Verify percentages: 40%, 60%, 80%
      expect(result.warmupSets[0]!.percentage).toBe(40);
      expect(result.warmupSets[1]!.percentage).toBe(60);
      expect(result.warmupSets[2]!.percentage).toBe(80);

      // Verify weights are rounded to increment (2.5)
      expect(result.warmupSets[0]!.weight).toBe(40);   // 100*0.4 = 40
      expect(result.warmupSets[1]!.weight).toBe(60);   // 100*0.6 = 60
      expect(result.warmupSets[2]!.weight).toBe(80);   // 100*0.8 = 80

      // Verify recommendation message
      expect(result.recommendation).toContain('frío');
    });

    it('músculo tibio + estilo standard → 2 series abreviadas', async () => {
      const ctx = new SessionContext();
      // Simular que chest fue trabajado como secundario anteriormente
      ctx.markAsSecondary(['chest'] as any);

      const result = await useCase.suggestWarmup(defaultExerciseId, ctx, 'standard', 100);

      expect(result.warmupSets).toHaveLength(2);
      expect(result.activationState).toBe('warm');

      // Verify percentages: 60%, 80%
      expect(result.warmupSets[0]!.percentage).toBe(60);
      expect(result.warmupSets[1]!.percentage).toBe(80);

      expect(result.recommendation).toContain('tibio');
    });

    it('músculo caliente + estilo standard → 1 serie de toma de contacto', async () => {
      const ctx = new SessionContext();
      // Simular que chest fue trabajado como primario antes
      ctx.markAsPrimary(['chest'] as any);

      const result = await useCase.suggestWarmup(defaultExerciseId, ctx, 'standard', 100);

      expect(result.warmupSets).toHaveLength(1);
      expect(result.activationState).toBe('hot');
      expect(result.warmupSets[0]!.percentage).toBe(70);

      expect(result.recommendation).toContain('caliente');
    });

    it('estilo heavy + músculo frío →  4 series (preparación SNC)', async () => {
      const ctx = new SessionContext();
      const result = await useCase.suggestWarmup(defaultExerciseId, ctx, 'heavy', 100);

      expect(result.warmupSets).toHaveLength(4);
      expect(result.warmupStyle).toBe('heavy');

      // Verify percentages: 40%, 60%, 80%, 90%
      expect(result.warmupSets[0]!.percentage).toBe(40);
      expect(result.warmupSets[1]!.percentage).toBe(60);
      expect(result.warmupSets[2]!.percentage).toBe(80);
      expect(result.warmupSets[3]!.percentage).toBe(90);
    });

    it('estilo heavy + peso >150kg → 5 series con paso extra de potenciación', async () => {
      const ctx = new SessionContext();
      const result = await useCase.suggestWarmup(defaultExerciseId, ctx, 'heavy', 200);

      expect(result.warmupSets).toHaveLength(5);

      // Último paso es 95%
      expect(result.warmupSets[4]!.percentage).toBe(95);
      expect(result.warmupSets[4]!.label).toBe('Potenciación');
      expect(result.warmupSets[4]!.weight).toBe(190); // 200*0.95 = 190
    });

    it('estilo ramp + músculo caliente → 0 series (ya activado)', async () => {
      const ctx = new SessionContext();
      ctx.markAsPrimary(['chest'] as any);

      const result = await useCase.suggestWarmup(defaultExerciseId, ctx, 'ramp', 100);

      expect(result.warmupSets).toHaveLength(0);
      expect(result.recommendation).toContain('directo');
    });

    it('debería actualizar SessionContext después de sugerir warmup', async () => {
      const ctx = new SessionContext();
      // Initially chest is cold
      expect(ctx.getState('chest' as any)).toBe('cold');

      await useCase.suggestWarmup(defaultExerciseId, ctx, 'standard', 100);

      // After warmup: primary muscles become hot, secondary become warm
      expect(ctx.getState('chest' as any)).toBe('hot');
      expect(ctx.getState('triceps' as any)).toBe('warm');
      expect(ctx.getState('shoulders' as any)).toBe('warm');
    });

    it('debería redondear pesos al incremento del ejercicio', async () => {
      const ctx = new SessionContext();
      // With target 67kg and increment 2.5:
      // 40% of 67 = 26.8 → rounded to 27.5
      // 60% of 67 = 40.2 → rounded to 40
      // 80% of 67 = 53.6 → rounded to 52.5 (nearest 2.5)
      const result = await useCase.suggestWarmup(defaultExerciseId, ctx, 'standard', 67);

      expect(result.warmupSets[0]!.weight).toBe(27.5);
      expect(result.warmupSets[1]!.weight).toBe(40);
      expect(result.warmupSets[2]!.weight).toBe(52.5);
    });

    it('ejercicio no encontrado → respuesta vacía con mensaje de error', async () => {
      mockExerciseRepo.getById.mockResolvedValue(null);
      const ctx = new SessionContext();

      const result = await useCase.suggestWarmup('nonexistent', ctx, 'standard', 100);

      expect(result.warmupSets).toHaveLength(0);
      expect(result.recommendation).toContain('no encontrado');
    });

    it('peso objetivo 0 → sin series de calentamiento', async () => {
      mockWorkoutRepo.getRecent.mockResolvedValue([]);
      const ctx = new SessionContext();

      // No target weight provided, and no history → execute returns 0
      const result = await useCase.suggestWarmup(defaultExerciseId, ctx);

      expect(result.warmupSets).toHaveLength(0);
      expect(result.targetWeight).toBe(0);
    });
  });
});

// ─── SessionContext Unit Tests ──────────────────────────────

describe('SessionContext', () => {
  it('debería inicializar todos los músculos como cold', () => {
    const ctx = new SessionContext();
    expect(ctx.getState('chest' as any)).toBe('cold');
    expect(ctx.getState('back' as any)).toBe('cold');
  });

  it('markAsPrimary debe poner músculos en hot', () => {
    const ctx = new SessionContext();
    ctx.markAsPrimary(['chest', 'shoulders'] as any);
    expect(ctx.getState('chest' as any)).toBe('hot');
    expect(ctx.getState('shoulders' as any)).toBe('hot');
  });

  it('markAsSecondary debe poner músculos fríos en warm', () => {
    const ctx = new SessionContext();
    ctx.markAsSecondary(['triceps'] as any);
    expect(ctx.getState('triceps' as any)).toBe('warm');
  });

  it('markAsSecondary NO debe bajar un músculo de hot a warm', () => {
    const ctx = new SessionContext();
    ctx.markAsPrimary(['chest'] as any);
    ctx.markAsSecondary(['chest'] as any); // Should NOT downgrade
    expect(ctx.getState('chest' as any)).toBe('hot');
  });

  it('getColdestState debería retornar el estado más frío entre varios músculos', () => {
    const ctx = new SessionContext();
    ctx.markAsPrimary(['chest'] as any);     // hot
    ctx.markAsSecondary(['shoulders'] as any); // warm

    // chest=hot, shoulders=warm, triceps=cold(default)
    expect(ctx.getColdestState(['chest', 'shoulders'] as any)).toBe('warm');
    expect(ctx.getColdestState(['chest', 'triceps'] as any)).toBe('cold');
    expect(ctx.getColdestState(['chest'] as any)).toBe('hot');
  });

  it('reset debería limpiar todos los estados', () => {
    const ctx = new SessionContext();
    ctx.markAsPrimary(['chest'] as any);
    ctx.reset();
    expect(ctx.getState('chest' as any)).toBe('cold');
  });
});

