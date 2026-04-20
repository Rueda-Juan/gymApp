import { WorkoutSetDTO } from '../src/workout-set.dto';

export interface WorkoutExerciseDTO {
  id: string;
  exerciseId: string;
  order: number;
  sets: WorkoutSetDTO[];
}
