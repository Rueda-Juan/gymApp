import type { Workout } from '../../../domain/entities/Workout';
import { WorkoutRepository } from '../../../domain/repositories/WorkoutRepository';

export class GetWorkoutHistoryUseCase {
  constructor(private readonly workoutRepository: WorkoutRepository) {}

  async execute(limit?: number): Promise<Workout[]> {
    return this.workoutRepository.getRecent(limit ?? 10);
  }
}
