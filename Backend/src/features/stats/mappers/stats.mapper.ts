import { ExerciseStats } from '../exercise-stats.entity';
import { ExerciseStatsDTO } from '@shared';

export function toExerciseStatsDTO(entity: ExerciseStats): ExerciseStatsDTO {
  return {
    exerciseId: entity.exerciseId,
    bestWeight: entity.maxWeight,
    bestReps: entity.maxReps,
    estimated1RM: entity.estimated1RM,
  };
}
