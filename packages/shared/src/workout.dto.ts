import type { ID, ISODate } from './exercise.dto';

export interface WorkoutDTO {
  id: ID;
  routineId: ID | null;
  date: ISODate;
  durationSeconds: number;
  notes: string | null;
  exercises: WorkoutExerciseDTO[];
}

export interface WorkoutExerciseDTO {
  id: ID;
  exerciseId: ID;
  order: number;
  sets: WorkoutSetDTO[];
}

export interface WorkoutSetDTO {
  id: ID;
  exerciseId: ID;
  setNumber: number;
  weight: number;
  reps: number;
  rir: number | null;
  restSeconds: number | null;
  completed: boolean;
  workoutId?: ID;
  createdAt?: ISODate;
}
