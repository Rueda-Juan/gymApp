import type { WorkoutRepository } from '../../../domain/repositories/WorkoutRepository';
import type { StatsRepository } from '../../../domain/repositories/StatsRepository';
import { NotFoundError } from '../../../shared/errors';

export class DeleteWorkoutExerciseUseCase {
  constructor(
    private readonly workoutRepo: WorkoutRepository,
    private readonly statsRepo: StatsRepository,
  ) {}

  async execute(workoutId: string, workoutExerciseId: string): Promise<void> {
    // Verify workout exists
    const workout = await this.workoutRepo.getById(workoutId);
    if (!workout) {
      throw new NotFoundError(`Workout con ID ${workoutId} no encontrado`);
    }

    // Find the exercise to get its ID and date for stats recalculation
    const workoutExercise = workout.exercises.find((ex) => ex.id === workoutExerciseId);
    if (!workoutExercise) {
      throw new NotFoundError(
        `Exercise con ID ${workoutExerciseId} no encontrado en workout ${workoutId}`,
      );
    }

    const exerciseId = workoutExercise.exerciseId;
    const dateStr = workout.date.toISOString().split('T')[0];

    // Delete the exercise
    await this.workoutRepo.deleteExercise(workoutId, workoutExerciseId);

    // Recalculate stats for this exercise
    await this.statsRepo.recalculateExerciseStats(exerciseId);

    // Recalculate daily stats
    await this.statsRepo.recalculateDailyStats(dateStr);
  }
}
