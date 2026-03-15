import { z } from 'zod';
import { MUSCLE_GROUPS } from '../../domain/valueObjects/MuscleGroup';
import { EQUIPMENT } from '../../domain/valueObjects/Equipment';
import { ValidationError } from '../errors';

// --- Exercise Schema ---

export const ExerciseSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100),
  primaryMuscle: z.enum(MUSCLE_GROUPS, {
    errorMap: () => ({ message: 'Grupo muscular inválido' }),
  }),
  secondaryMuscles: z.array(z.enum(MUSCLE_GROUPS)).default([]),
  equipment: z.enum(EQUIPMENT, {
    errorMap: () => ({ message: 'Equipamiento inválido' }),
  }),
  weightIncrement: z.number().min(0).default(2.5),
  animationPath: z.string().nullable().default(null),
  description: z.string().nullable().default(null),
  anatomicalRepresentationSvg: z.string().nullable().default(null),
});

export type CreateExerciseInput = z.infer<typeof ExerciseSchema>;

// --- Routine Schema ---

export const RoutineExerciseSchema = z.object({
  exerciseId: z.string().min(1, 'exerciseId es requerido'),
  orderIndex: z.number().int().min(0),
  targetSets: z.number().int().positive('targetSets debe ser positivo'),
  minReps: z.number().int().positive('minReps debe ser positivo'),
  maxReps: z.number().int().positive('maxReps debe ser positivo'),
}).refine(data => data.minReps <= data.maxReps, {
  message: 'minReps no puede ser mayor que maxReps',
  path: ['minReps'],
});

export const RoutineSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100),
  notes: z.string().max(500).nullable().default(null),
  exercises: z.array(RoutineExerciseSchema).min(1, 'Al menos un ejercicio es requerido'),
});

export type CreateRoutineInput = z.infer<typeof RoutineSchema>;

// --- Validators ---

/**
 * Validates raw input for creating/updating an exercise.
 * Throws ValidationError on failure.
 */
export function validateExerciseInput(raw: unknown): CreateExerciseInput {
  const result = ExerciseSchema.safeParse(raw);
  if (!result.success) {
    throw new ValidationError(
      'Ejercicio inválido',
      result.error.flatten().fieldErrors as Record<string, string[]>,
    );
  }
  return result.data;
}

/**
 * Validates raw input for creating/updating a routine.
 * Throws ValidationError on failure.
 */
export function validateRoutineInput(raw: unknown): CreateRoutineInput {
  const result = RoutineSchema.safeParse(raw);
  if (!result.success) {
    throw new ValidationError(
      'Rutina inválida',
      result.error.flatten().fieldErrors as Record<string, string[]>,
    );
  }
  return result.data;
}
