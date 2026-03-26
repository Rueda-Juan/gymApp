import type { WorkoutRepository } from '../../../domain/repositories/WorkoutRepository';
import { NotFoundError } from '../../../shared/errors';
import { generateId } from '../../../shared/utils/generateId';

export class AddExerciseToWorkoutUseCase {
  constructor(private readonly workoutRepo: WorkoutRepository) {}

  async execute(workoutId: string, exerciseId: string): Promise<void> {
    const workout = await this.workoutRepo.getById(workoutId);
    if (!workout) {
      throw new NotFoundError(`Workout con ID ${workoutId} no encontrado`);
    }

    const newOrderIndex = workout.exercises.length > 0 
      ? Math.max(...workout.exercises.map(e => e.orderIndex)) + 1 
      : 0;

    await this.workoutRepo.addExercise(workoutId, {
      id: generateId(),
      exerciseId,
      orderIndex: newOrderIndex,
      skipped: false,
      notes: null,
      supersetGroup: null,
      sets: [],
    });
  }
}
