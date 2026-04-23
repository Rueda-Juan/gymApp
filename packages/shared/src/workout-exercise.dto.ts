import type { WorkoutSetDTO } from '@shared';

export interface WorkoutExerciseDTO {
  id: string;
  exerciseId: string;
  order: number;
  sets: WorkoutSetDTO[];
}
