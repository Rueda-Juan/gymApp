// Arrays de enums para validaciones zod
export const MUSCLE_GROUPS = [
	'chest', 'upper-chest', 'mid-chest', 'lower-chest',
	'back', 'lats', 'upper-back', 'mid-back', 'lower-back',
	'shoulders', 'front-delts', 'side-delts', 'rear-delts',
	'biceps', 'triceps', 'forearms',
	'legs', 'quads', 'hamstrings', 'glutes', 'calves',
	'abs', 'core', 'traps',
] as const;
export const EQUIPMENT = [
	'barbell', 'dumbbell', 'machine', 'cable', 'bodyweight', 'band', 'other',
] as const;
// Tipo para PRs y estadísticas
export type RecordType = 'max_weight' | 'max_reps' | 'max_volume' | 'max_1rm';
// Set types for workout sets
export const SET_TYPES = ['normal', 'warmup', 'dropset', 'failure'] as const;
export type SetType = typeof SET_TYPES[number];
// Export all shared types needed by Frontend and Backend
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
