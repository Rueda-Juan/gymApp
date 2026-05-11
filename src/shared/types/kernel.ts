import { InferSelectModel } from 'drizzle-orm';
import {
  exercises,
  routines,
  workoutExercises,
  sets,
  workouts,
  bodyWeightLog,
  dailyStats,
  exerciseStats,
  routineExercises,
} from '@/db/schema';

// --- Base Types (Drizzle — single source of truth) ---
export type Exercise = InferSelectModel<typeof exercises>;
export type Routine = InferSelectModel<typeof routines>;
export type RoutineExercise = InferSelectModel<typeof routineExercises>;
export type WorkoutExercise = InferSelectModel<typeof workoutExercises>;
export type WorkoutSet = InferSelectModel<typeof sets>;
export type Workout = InferSelectModel<typeof workouts>;
export type BodyWeight = InferSelectModel<typeof bodyWeightLog>;
export type DailyStats = InferSelectModel<typeof dailyStats>;
export type ExerciseStats = InferSelectModel<typeof exerciseStats>;

// --- Composite Types (relations that Drizzle cannot express alone) ---
export type RoutineExerciseWithExercise = RoutineExercise & {
  exercise?: Exercise;
};

export type RoutineWithExercises = Routine & {
  routineExercises?: RoutineExerciseWithExercise[];
};

export interface RoutineWithLastPerformed extends RoutineWithExercises {
  lastPerformed?: string | null;
  exercises?: RoutineExerciseWithExercise[];
  muscles?: string[];
}

export interface WorkoutWithExercises extends Workout {
  workoutExercises: (WorkoutExercise & {
    exercise?: Exercise;
    sets: WorkoutSet[];
  })[];
}

// --- Enum Aliases (derived from schema enums for convenience) ---
export type MuscleGroup = string;
export type Equipment = string;
export type ExerciseType = 'compound' | 'isolation';
export type LoadType = 'weighted' | 'bodyweight' | 'assisted' | 'timed';
export type SetType = 'warmup' | 'normal' | 'failure' | 'dropset';
export type RecordType = 'max_weight' | 'max_reps' | 'max_volume' | 'estimated_1rm';

// --- UI / Domain Interfaces ---
export interface WeightSuggestion {
  weight: number;
  reps: number;
  reason?: string | null;
}

// --- Active Workout UI State (ephemeral, not persisted in DB) ---
export * from './workout';
