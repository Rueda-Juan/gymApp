// Central types for the app

export type ID = string;
export type ISODate = string;

export const MUSCLE_GROUPS = [
  "chest",
  "upper-chest",
  "mid-chest",
  "lower-chest",
  "back",
  "lats",
  "upper-back",
  "mid-back",
  "lower-back",
  "shoulders",
  "front-delts",
  "side-delts",
  "rear-delts",
  "biceps",
  "triceps",
  "forearms",
  "legs",
  "quads",
  "quadriceps",
  "hamstrings",
  "glutes",
  "calves",
  "adductors",
  "abductors",
  "abs",
  "core",
  "lower-abs",
  "upper-abs",
  "traps",
  "obliques",
] as const;

export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];

export const EQUIPMENT = [
  "barbell",
  "dumbbell",
  "machine",
  "cable",
  "bodyweight",
  "band",
  "other",
] as const;

export type Equipment = (typeof EQUIPMENT)[number];

export type ExerciseType = "compound" | "isolation";
export type LoadType = "weighted" | "bodyweight" | "assisted" | "timed";

export const SET_TYPES = ["normal", "warmup", "dropset", "failure"] as const;
export type SetType = (typeof SET_TYPES)[number];

export type WarmupStyle = "standard" | "heavy" | "ramp";

export interface Exercise {
  id: string;
  name: string;
  type: ExerciseType;
  loadType: LoadType;
  muscles?: MuscleGroup[];
  equipment: Equipment;
  primaryMuscles?: MuscleGroup[];
  secondaryMuscles?: MuscleGroup[];
}

export interface WorkoutSet {
  id: string;
  exerciseId?: string;
  setNumber?: number;
  reps: number;
  weight: number;
  rir?: number | null;
  rpe?: number;
  restSeconds?: number | null;
  setType?: SetType;
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
  notes: string | null;
  createdAt?: string;
  exercises: RoutineExercise[];
  muscles?: MuscleGroup[];
  workouts?: string[];
  updatedAt?: string;
}

export interface RoutineExercise {
  exerciseId: string;
  order: number;
  orderIndex?: number;
  sets?: number;
  reps?: string;
  supersetGroup?: number | null;
}

export interface BodyWeight {
  id: string;
  userId?: string;
  date: string;
  weight: number;
}

export interface UserPreferences {
  id?: string;
  userId?: string;
  language?: string;
  weightUnit: "kg" | "lbs" | "lb";
  restTimerSeconds?: number;
  notificationsEnabled?: boolean;
}

export interface ExerciseStats {
  id?: string;
  userId?: string;
  exerciseId: string;
  date?: string;
  volume?: number;
  bestWeight: number;
  bestReps?: number;
  estimated1RM?: number;
  prCount?: number;
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
  notes?: string | null;
  exercises: RoutineExercise[];
  muscles?: MuscleGroup[];
}

export interface RoutineWithLastPerformed extends StartableRoutine {
  lastPerformed?: string | null;
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
  weight: number;
  reason: string;
}

export interface SessionContext {
  workoutId: string;
  userId: string;
}

export interface DailyStats {
  date: string;
  totalVolume: number;
  totalSets: number;
  totalReps: number;
  workoutCount: number;
  totalDuration: number;
}

export interface TrainingFrequencyResult {
  week: string;
  frequency: number;
}

// DTO Aliases for backward compatibility
export type ExerciseDTO = Exercise;
export type RoutineDTO = Routine;
export type RoutineExerciseDTO = RoutineExercise;
export type WorkoutSetDTO = WorkoutSet;
export type BodyWeightDTO = BodyWeight;
export type ExerciseStatsDTO = ExerciseStats;
export type UserPreferencesDTO = UserPreferences;
