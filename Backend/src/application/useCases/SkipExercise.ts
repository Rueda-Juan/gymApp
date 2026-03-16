import type { WorkoutRepository } from '../../domain/repositories/WorkoutRepository';

/**
 * SkipExercise use case — marks an exercise as skipped during a workout.
 */
export class SkipExerciseUseCase {
  constructor(
    private readonly workoutRepo: WorkoutRepository,
  ) {}

  /**
   * Marks an exercise as skipped within a workout.
   * @param workoutId - ID of the active workout.
   * @param exerciseId - ID of the exercise to skip.
   */
  async execute(workoutId: string, exerciseId: string): Promise<void> {
    await this.workoutRepo.markExerciseSkipped(workoutId, exerciseId, true);
  }
}
