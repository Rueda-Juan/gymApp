import type { WorkoutRepository } from '../../../domain/repositories/WorkoutRepository';
import { NotFoundError } from '../../../shared/errors';

export interface UpdateWorkoutExerciseInput {
  workoutId: string;
  workoutExerciseId: string;
  notes?: string;
}

export class UpdateWorkoutExerciseUseCase {
  constructor(private readonly workoutRepo: WorkoutRepository) {}

  async execute(params: UpdateWorkoutExerciseInput): Promise<void> {
    // Verify workout exists
    const workout = await this.workoutRepo.getById(params.workoutId);
    if (!workout) {
      throw new NotFoundError(`Workout con ID ${params.workoutId} no encontrado`);
    }

    // Verify exercise exists in workout
    const workoutExercise = workout.exercises.find((ex) => ex.id === params.workoutExerciseId);
    if (!workoutExercise) {
      throw new NotFoundError(
        `Exercise con ID ${params.workoutExerciseId} no encontrado en workout ${params.workoutId}`,
      );
    }

    // Update exercise notes
    if (params.notes !== undefined) {
      await this.workoutRepo.updateExerciseNotes(
        params.workoutId,
        params.workoutExerciseId,
        params.notes,
      );
    }
  }
}
