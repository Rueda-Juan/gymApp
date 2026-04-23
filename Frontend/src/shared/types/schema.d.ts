import { 
  Exercise, 
  WorkoutSet, 
  WorkoutExercise, 
  Routine, 
  MuscleGroup, 
  Equipment,
  SetType
} from '@kernel';

declare global {
  namespace GymApp {
    export type { 
      Exercise, 
      WorkoutSet, 
      WorkoutExercise, 
      Routine, 
      MuscleGroup, 
      Equipment,
      SetType 
    };

    export interface ActiveWorkoutState {
      id: string;
      routineId?: string;
      routineName?: string;
      startTime: string;
      endTime?: string;
      exercises: WorkoutExercise[];
      isActive: boolean;
      currentExerciseIndex: number;
      sessionNote?: string;
    }
  }
}
