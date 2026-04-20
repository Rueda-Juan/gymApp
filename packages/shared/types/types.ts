// Central types for the app

export type MuscleGroup =
  | 'chest' | 'upper-chest' | 'mid-chest' | 'lower-chest'
  | 'back' | 'lats' | 'upper-back' | 'mid-back' | 'lower-back'
  | 'shoulders' | 'front-delts' | 'side-delts' | 'rear-delts'
  | 'biceps' | 'triceps' | 'forearms'
  | 'legs' | 'quads' | 'hamstrings' | 'glutes' | 'calves'
  | 'abs' | 'core' | 'traps';

export type Equipment =
  | 'barbell' | 'dumbbell' | 'machine' | 'cable' | 'bodyweight' | 'band' | 'other';

export type ExerciseType = 'compound' | 'isolation';
export type LoadType = 'weighted' | 'bodyweight' | 'assisted' | 'timed';

export interface Exercise {
  id: string;
  name: string;
  type: ExerciseType;
  muscles: MuscleGroup[];
  equipment: Equipment;
  primaryMuscles?: MuscleGroup[];
  secondaryMuscles?: MuscleGroup[];
}

export interface WorkoutSet {
  id: string;
  reps: number;
  weight: number;
  rpe?: number;
  completed?: boolean;
}

export interface WorkoutExercise {
  id: string;
  exercise: Exercise;
  sets: WorkoutSet[];
}

export interface Routine {
  id: string;
  name: string;
  exercises: RoutineExercise[];
  muscles?: MuscleGroup[];
  workouts: string[];
  updatedAt?: string;
}

export interface RoutineExercise {
  exercise: Exercise;
  sets: WorkoutSet[];
}

export interface BodyWeight {
  id: string;
  userId: string;
  date: string;
  weight: number;
}

export interface UserPreferences {
  id: string;
  userId: string;
  language: string;
  notificationsEnabled: boolean;
}

export interface ExerciseStats {
  id: string;
  userId: string;
  date: string;
  volume: number;
  prCount: number;
}

export interface Stats {
  id: string;
  userId: string;
  date: string;
  volume: number;
  prCount: number;
}

export interface StartableRoutine {
  id: string;
  name: string;
  exercises: RoutineExercise[];
  muscles?: MuscleGroup[];
}

export interface RoutineWithLastPerformed extends StartableRoutine {
  lastPerformed?: string;
}

export interface RecordType {
  id: string;
  name: string;
  value: number;
  date: string;
}

export interface UpdateBodyWeightInput {
  weight: number;
  date: string;
}

export interface WeightSuggestion {
  exerciseId: string;
  suggestedWeight: number;
}

export interface SessionContext {
  workoutId: string;
  userId: string;
}

export interface DailyStats {
  date: string;
  volume: number;
}

export interface TrainingFrequencyResult {
  week: string;
  frequency: number;
}
