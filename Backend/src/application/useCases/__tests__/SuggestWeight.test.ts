import { SuggestWeightUseCase } from '../SuggestWeight';
import type { WorkoutRepository } from '../../../domain/repositories/WorkoutRepository';
import type { StatsRepository } from '../../../domain/repositories/StatsRepository';
import type { ExerciseRepository } from '../../../domain/repositories/ExerciseRepository';
import type { Workout } from '../../../domain/entities/Workout';
import type { Exercise } from '../../../domain/entities/Exercise';

describe('SuggestWeightUseCase', () => {
  let useCase: SuggestWeightUseCase;
  let mockWorkoutRepo: jest.Mocked<WorkoutRepository>;
  let mockStatsRepo: jest.Mocked<StatsRepository>;
  let mockExerciseRepo: jest.Mocked<ExerciseRepository>;

  const defaultExerciseId = 'ex-1';
  const defaultIncrement = 2.5;
  const mockExercise = { id: defaultExerciseId, weightIncrement: defaultIncrement } as Exercise;

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
        })),
        orderIndex: 0,
      },
    ],
  } as Workout);

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
});
