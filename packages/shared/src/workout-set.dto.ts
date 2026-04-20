export type SetType = 'normal' | 'warmup' | 'failure' | 'dropset';

export interface WorkoutSetDTO {
  id: string;
  exerciseId: string;
  workoutId?: string;
  setNumber: number;
  weight: number;
  reps: number;
  partialReps: number | null;
  rir: number | null;
  setType: SetType;
  restSeconds: number | null;
  durationSeconds: number;
  completed: boolean;
  skipped: boolean;
  createdAt: string | Date;
}
