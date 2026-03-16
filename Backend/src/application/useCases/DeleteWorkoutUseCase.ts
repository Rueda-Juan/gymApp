import type { WorkoutRepository } from '../../domain/repositories/WorkoutRepository';
import type { StatsRepository } from '../../domain/repositories/StatsRepository';
import { NotFoundError } from '../../shared/errors';

export class DeleteWorkoutUseCase {
  constructor(
    private readonly workoutRepo: WorkoutRepository,
    private readonly statsRepo: StatsRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const workout = await this.workoutRepo.getById(id);
    if (!workout) {
      throw new NotFoundError(`Workout con ID ${id} no encontrado`);
    }

    await this.workoutRepo.delete(id);

    // Recalculate stats for all exercises in this workout
    const uniqueExerciseIds = new Set(workout.exercises.map(e => e.exerciseId));
    for (const exerciseId of uniqueExerciseIds) {
      await this.statsRepo.recalculateExerciseStats(exerciseId);
    }

    // Recalculate daily stats for the workout's date
    const dateStr = workout.date.toISOString().split('T')[0]!;
    await this.statsRepo.recalculateDailyStats(dateStr);
  }
}
