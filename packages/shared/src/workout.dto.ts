import { WorkoutExerciseDTO } from './workout-exercise.dto';

export interface WorkoutDTO {
  id: string;
  routineId: string | null;
  date: string;
  durationSeconds: number;
  notes: string | null;
  exercises: WorkoutExerciseDTO[];
}
