import type { WorkoutSet } from '../../../domain/entities/WorkoutSet';
import type { StatsRepository } from '../../../domain/repositories/StatsRepository';
import { detectBrokenRecords } from '../../services/StatsCalculator';

export class EvaluateSetPRUseCase {
  constructor(private readonly statsRepo: StatsRepository) {}

  async execute(
    exerciseId: string,
    set: WorkoutSet,
  ): Promise<Array<{ recordType: 'max_weight' | 'max_reps' | 'max_volume' | 'estimated_1rm'; value: number }>> {
    const currentStats = await this.statsRepo.getExerciseStats(exerciseId);
    return detectBrokenRecords(currentStats, set);
  }
}
