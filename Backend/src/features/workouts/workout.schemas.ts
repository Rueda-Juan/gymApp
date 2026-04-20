import { z } from 'zod';
import { ValidationError } from '../../core/errors/errors';
import { SET_TYPES } from '@shared';

// --- Set Schema ---

export const WorkoutSetSchema = z.object({
  exerciseId: z.string().min(1, 'exerciseId es requerido'),
  setNumber: z.number().int().positive('setNumber debe ser positivo'),
  weight: z.number().min(0, 'El peso no puede ser negativo'),
  reps: z.number().int().min(0, 'Las reps no pueden ser negativas'),
  setType: z.enum(SET_TYPES).default('normal'),
  rir: z.number().int().min(0).max(10).nullable().default(null),
  partialReps: z.number().int().min(0).nullable().default(null),
  restSeconds: z.number().int().min(0).nullable().default(null),
  durationSeconds: z.number().int().min(0).default(0),
  completed: z.boolean().default(false),
  skipped: z.boolean().default(false),
});

export const UpdateSetSchema = WorkoutSetSchema.partial().extend({
  id: z.string().min(1, 'ID es requerido para actualizar'),
});

export type CreateSetInput = z.infer<typeof WorkoutSetSchema>;
export type UpdateSetInput = z.infer<typeof UpdateSetSchema>;

// --- Workout Schema ---

export const CreateWorkoutSchema = z.object({
  routineId: z.string().min(1).nullable().default(null),
  notes: z.string().max(500).nullable().default(null),
});

export type CreateWorkoutInput = z.infer<typeof CreateWorkoutSchema>;

// --- Validators ---

/**
 * Validates raw input for creating a workout set.
 * Throws ValidationError on failure.
 */
export function validateSetInput(raw: unknown): CreateSetInput {
  const result = WorkoutSetSchema.safeParse(raw);
  if (!result.success) {
    throw new ValidationError(
      'Set inválido',
      result.error.flatten().fieldErrors as Record<string, string[]>,
    );
  }
  return result.data;
}

/**
 * Validates raw input for creating a workout.
 * Throws ValidationError on failure.
 */
export function validateWorkoutInput(raw: unknown): CreateWorkoutInput {
  const result = CreateWorkoutSchema.safeParse(raw);
  if (!result.success) {
    throw new ValidationError(
      'Workout inválido',
      result.error.flatten().fieldErrors as Record<string, string[]>,
    );
  }
  return result.data;
}
