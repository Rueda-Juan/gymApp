import type { WorkoutRepository } from '../../domain/repositories/WorkoutRepository';
import type { StatsRepository } from '../../domain/repositories/StatsRepository';
import type { WorkoutSet } from '../../domain/entities/WorkoutSet';

export class UpdateSetUseCase {
  constructor(
    private readonly workoutRepo: WorkoutRepository,
    private readonly statsRepo: StatsRepository,
  ) {}

  async execute(workoutId: string, dateStr: string, set: WorkoutSet): Promise<void> {
    await this.workoutRepo.updateSet(workoutId, set);
    await this.statsRepo.recalculateExerciseStats(set.exerciseId);
    await this.statsRepo.recalculateDailyStats(dateStr);
  }
}
