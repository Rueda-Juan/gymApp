import type { WorkoutRepository } from '../../domain/repositories/WorkoutRepository';
import type { WorkoutSet } from '../../domain/entities/WorkoutSet';

export class GetExerciseHistoryUseCase {
  constructor(private readonly workoutRepo: WorkoutRepository) {}

  async execute(exerciseId: string, limit: number = 20): Promise<WorkoutSet[]> {
    return this.workoutRepo.getExerciseHistory(exerciseId, limit);
  }
}
