import type { Workout } from '../../domain/entities/Workout';
import type { WorkoutRepository } from '../../domain/repositories/WorkoutRepository';
import { NotFoundError } from '../../shared/errors';

/**
 * FinishWorkout use case — closes an active workout and records duration.
 */
export class FinishWorkoutUseCase {
  constructor(
    private readonly workoutRepo: WorkoutRepository,
  ) {}

  /**
   * Finishes an active workout by computing the elapsed duration.
   * @param workoutId - ID of the workout to finish.
   * @returns The finished Workout with computed durationSeconds.
   * @throws NotFoundError if the workout doesn't exist.
   */
  async execute(workoutId: string): Promise<Workout> {
    const workout = await this.workoutRepo.getById(workoutId);
    if (!workout) {
      throw new NotFoundError(`Workout ${workoutId} no encontrado`);
    }

    // Calculate duration from start to now
    const durationSeconds = Math.floor(
      (Date.now() - workout.date.getTime()) / 1000,
    );

    const finishedWorkout: Workout = {
      ...workout,
      durationSeconds,
    };

    await this.workoutRepo.save(finishedWorkout);
    return finishedWorkout;
  }
}
