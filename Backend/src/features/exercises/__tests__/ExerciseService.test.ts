import { ExerciseService } from '../exercise.service';
import type { ExerciseRepository } from '../exercise.repository';
import type { WorkoutRepository } from '../../workouts/workout.repository';
import type { Exercise } from '../exercise.entity';
import { ValidationError, NotFoundError } from '../../../core/errors/errors';

describe('ExerciseService', () => {
  let service: ExerciseService;
  let mockExerciseRepo: jest.Mocked<ExerciseRepository>;
  let mockWorkoutRepo: jest.Mocked<WorkoutRepository>;

  beforeEach(() => {
    mockExerciseRepo = {
      save: jest.fn(),
      getAll: jest.fn(),
      getById: jest.fn(),
      getByKey: jest.fn(),
      delete: jest.fn(),
      archive: jest.fn(),
      isInUse: jest.fn(),
    } as unknown as jest.Mocked<ExerciseRepository>;

    mockWorkoutRepo = {
      getExerciseHistory: jest.fn(),
      getPreviousSets: jest.fn(),
    } as unknown as jest.Mocked<WorkoutRepository>;

    service = new ExerciseService(mockExerciseRepo, mockWorkoutRepo);
  });

  describe('updateExercise', () => {
    const existing: Exercise = {
      id: 'ex-1',
      name: 'Old Name',
      exerciseKey: 'custom_old_name',
      isCustom: true,
      primaryMuscles: ['chest'],
      equipment: 'barbell',
      exerciseType: 'compound',
      loadType: 'weighted',
    } as any;

    it('actualiza el nombre y recalcula el key', async () => {
      mockExerciseRepo.getById.mockResolvedValue(existing);
      mockExerciseRepo.getByKey.mockResolvedValue(null);

      const result = await service.updateExercise('ex-1', { name: 'New Name' });

      expect(result.name).toBe('New Name');
      expect(result.exerciseKey).toBe('custom_new_name');
      expect(mockExerciseRepo.save).toHaveBeenCalled();
    });

    it('lanza error si el nuevo nombre colisiona con otro ejercicio', async () => {
      mockExerciseRepo.getById.mockResolvedValue(existing);
      mockExerciseRepo.getByKey.mockResolvedValue({ id: 'other-id' } as any);

      await expect(service.updateExercise('ex-1', { name: 'Collision' }))
        .rejects.toThrow(ValidationError);
    });

    it('lanza error si los datos del ejercicio custom son inválidos', async () => {
      mockExerciseRepo.getById.mockResolvedValue(existing);
      
      await expect(service.updateExercise('ex-1', { name: '' }))
        .rejects.toThrow(ValidationError);
    });

    it('lanza NotFoundError si no existe', async () => {
      mockExerciseRepo.getById.mockResolvedValue(null);
      await expect(service.updateExercise('ex-1', { name: 'X' })).rejects.toThrow(NotFoundError);
    });
  });

  describe('Read operations', () => {
    it('getExerciseHistory llama al workoutRepo', async () => {
      mockWorkoutRepo.getExerciseHistory.mockResolvedValue([]);
      await service.getExerciseHistory('ex-1');
      expect(mockWorkoutRepo.getExerciseHistory).toHaveBeenCalledWith('ex-1', 20);
    });

    it('getPreviousSets llama al workoutRepo', async () => {
      mockWorkoutRepo.getPreviousSets.mockResolvedValue([]);
      await service.getPreviousSets('ex-1');
      expect(mockWorkoutRepo.getPreviousSets).toHaveBeenCalledWith('ex-1');
    });
  });
});
