import type { ID } from './exercise.dto';

export interface ExerciseStatsDTO {
  exerciseId: ID;
  bestWeight: number;
  bestReps: number;
  estimated1RM: number;
}
