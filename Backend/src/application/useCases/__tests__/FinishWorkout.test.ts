import { FinishWorkoutUseCase } from '../workouts/FinishWorkout';
import type { WorkoutRepository } from '../../../domain/repositories/WorkoutRepository';
import type { Workout } from '../../../domain/entities/Workout';
import { NotFoundError } from '../../../shared/errors';

describe('FinishWorkoutUseCase', () => {
  let useCase: FinishWorkoutUseCase;
  let mockWorkoutRepo: jest.Mocked<WorkoutRepository>;

  beforeEach(() => {
    mockWorkoutRepo = {
      getById: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<WorkoutRepository>;

    useCase = new FinishWorkoutUseCase(mockWorkoutRepo);
  });

  const createMockWorkout = (startedMinutesAgo: number): Workout => ({
    id: 'w-1',
    routineId: 'r-1',
    date: new Date(Date.now() - startedMinutesAgo * 60 * 1000),
    durationSeconds: 0,
    notes: null,
    exercises: [],
  });

  it('debería finalizar un workout y calcular la duración', async () => {
    const workout = createMockWorkout(60);
    mockWorkoutRepo.getById.mockResolvedValue(workout);

    const result = await useCase.execute('w-1');

    expect(result.durationSeconds).toBeGreaterThanOrEqual(3590);
    expect(result.durationSeconds).toBeLessThanOrEqual(3610);
    expect(mockWorkoutRepo.save).toHaveBeenCalledTimes(1);
  });

  it('debería lanzar NotFoundError si el workout no existe', async () => {
    mockWorkoutRepo.getById.mockResolvedValue(null);

    await expect(useCase.execute('nonexistent')).rejects.toThrow(NotFoundError);
  });

  it('debería preservar los datos originales del workout', async () => {
    const workout = createMockWorkout(30);
    mockWorkoutRepo.getById.mockResolvedValue(workout);

    const result = await useCase.execute('w-1');

    expect(result.id).toBe('w-1');
    expect(result.routineId).toBe('r-1');
    expect(result.notes).toBeNull();
  });

  it('debería manejar un workout recién iniciado (duración ~0)', async () => {
    const workout = createMockWorkout(0);
    mockWorkoutRepo.getById.mockResolvedValue(workout);

    const result = await useCase.execute('w-1');

    expect(result.durationSeconds).toBeGreaterThanOrEqual(0);
    expect(result.durationSeconds).toBeLessThanOrEqual(2);
  });
});
