/**
 * Shared utility types used across the backend.
 *
 * This file centralizes commonly used type patterns to avoid
 * duplication and provide a consistent type vocabulary.
 */

// ─── Result Types ─────────────────────────────────────────────

/** Wraps async operations that can succeed or fail */
export type AsyncResult<T> = Promise<
  | { success: true; data: T }
  | { success: false; error: string }
>;

// ─── Utility Types ────────────────────────────────────────────

/** Shorthand for T | null */
export type Nullable<T> = T | null;

/** ISO date string in 'YYYY-MM-DD' format */
export type DateString = string & { readonly __brand: 'DateString' };

/** UUID string */
export type UUID = string & { readonly __brand: 'UUID' };

/** Weight in kilograms */
export type Kilograms = number;

/** Duration in seconds */
export type Seconds = number;

// ─── Entity Helpers ───────────────────────────────────────────

/** Fields that are auto-generated and should not be provided on creation */
export type CreateInput<T> = Omit<T, 'id' | 'createdAt'>;

/** Fields that can be updated (excludes id and createdAt) */
export type UpdateInput<T> = Partial<Omit<T, 'id' | 'createdAt'>>;

// ─── Re-exports ───────────────────────────────────────────────
// Convenience re-exports of the most commonly used domain types.

export type { Exercise, ExerciseType } from '../domain/entities/Exercise';
export type { Routine, RoutineExercise } from '../domain/entities/Routine';
export type { Workout, WorkoutExercise } from '../domain/entities/Workout';
export type { WorkoutSet } from '../domain/entities/WorkoutSet';
export type { ExerciseStats } from '../domain/entities/ExerciseStats';
export type { PersonalRecord, RecordType } from '../domain/entities/PersonalRecord';
export type { DailyStats } from '../domain/entities/DailyStats';
export type { UserPreferences } from '../domain/entities/UserPreferences';
export type { BodyWeightEntry } from '../domain/entities/BodyWeightEntry';
export type { MuscleGroup } from '../domain/valueObjects/MuscleGroup';
export type { Equipment } from '../domain/valueObjects/Equipment';
export type { SetType } from '../domain/valueObjects/SetType';
