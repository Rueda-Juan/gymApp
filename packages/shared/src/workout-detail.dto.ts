import type { ID, ISODate } from './exercise.dto';
import type { ExerciseDTO } from './exercise.dto';
import type { WorkoutSetDTO } from './workout.dto';

// DTO para iniciar un workout desde una rutina
export interface StartableRoutineDTO {
  id: ID;
  name: string;
  exercises: RoutineExerciseForWorkoutDTO[];
  muscles?: string[];
}

export interface RoutineExerciseForWorkoutDTO {
  exercise: ExerciseDTO;
  targetSets: number;
  maxReps: number;
  minReps: number;
  restSeconds: number | null;
  order: number;
}

// DTO para detalle de workout
export interface WorkoutDetailDTO {
  id: ID;
  routineId: ID | null;
  date: ISODate;
  durationSeconds: number;
  notes: string | null;
  exercises: WorkoutExerciseDetailDTO[];
}

export interface WorkoutExerciseDetailDTO {
  id: ID;
  exercise: ExerciseDTO;
  order: number;
  sets: WorkoutSetDTO[];
}
