import type { WorkoutRepository } from '../../domain/repositories/WorkoutRepository';
import type { StatsRepository } from '../../domain/repositories/StatsRepository';

export class DeleteSetUseCase {
  constructor(
    private readonly workoutRepo: WorkoutRepository,
    private readonly statsRepo: StatsRepository,
  ) {}

  async execute(workoutId: string, setId: string, exerciseId: string, dateStr: string): Promise<void> {
    await this.workoutRepo.deleteSet(workoutId, setId);
    await this.statsRepo.recalculateExerciseStats(exerciseId);
    await this.statsRepo.recalculateDailyStats(dateStr);
  }
}
