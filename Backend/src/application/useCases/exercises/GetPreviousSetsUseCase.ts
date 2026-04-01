import type { WorkoutRepository } from '../../../domain/repositories/WorkoutRepository';
import type { WorkoutSet } from '../../../domain/entities/WorkoutSet';

/**
 * GetPreviousSetsUseCase — returns the ordered sets from the most recent
 * workout session in which a given exercise was performed.
 *
 * Used to populate per-set weight placeholders on the active workout screen.
 * Single JOIN query — no N+1.
 */
export class GetPreviousSetsUseCase {
  constructor(private readonly workoutRepo: WorkoutRepository) {}

  async execute(exerciseId: string): Promise<WorkoutSet[]> {
    return this.workoutRepo.getPreviousSets(exerciseId);
  }
}
