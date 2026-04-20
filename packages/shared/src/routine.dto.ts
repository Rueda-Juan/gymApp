import type { ID, ISODate } from './exercise.dto';

export interface RoutineDTO {
  id: ID;
  name: string;
  notes: string | null;
  createdAt: ISODate;
  exercises: RoutineExerciseDTO[];
  muscles?: string[];
}

export interface RoutineExerciseDTO {
  exerciseId: ID;
  order: number;
}
