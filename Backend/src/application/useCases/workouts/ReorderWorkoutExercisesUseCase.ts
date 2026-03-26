import type { WorkoutRepository } from '../../../domain/repositories/WorkoutRepository';
import { NotFoundError } from '../../../shared/errors';

export class ReorderWorkoutExercisesUseCase {
  constructor(private readonly workoutRepo: WorkoutRepository) {}

  async execute(workoutId: string, exerciseIds: string[]): Promise<void> {
    const workout = await this.workoutRepo.getById(workoutId);
    if (!workout) {
      throw new NotFoundError(`Workout con ID ${workoutId} no encontrado`);
    }

    await this.workoutRepo.reorderExercises(workoutId, exerciseIds);
  }
}
