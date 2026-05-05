export interface WorkoutSetState {
  id: string;
  weight: number;
  reps: number;
  isCompleted: boolean;
  type: 'warmup' | 'normal' | 'failure' | 'dropset';
  rir?: number | null;
  partialReps?: boolean;
}

export interface WorkoutExerciseState {
  id: string; // ID temporal en el entreno activo
  exerciseId: string; // ID real del DB
  name: string;
  nameEs?: string | null;
  sets: WorkoutSetState[];
  status?: 'active' | 'pending' | 'completed' | 'skipped';
  supersetGroup?: number | null;
}

export interface PendingDeletion {
  exerciseId: string;
  set: WorkoutSetState;
  index: number;
}
