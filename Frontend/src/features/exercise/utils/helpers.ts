import { z } from 'zod';
import type { MuscleGroup, Equipment } from '@kernel';

export const MUSCLE_GROUPS: MuscleGroup[] = [
  'chest', 'upper-chest', 'mid-chest', 'lower-chest',
  'back', 'lats', 'upper-back', 'mid-back', 'lower-back',
  'shoulders', 'front-delts', 'side-delts', 'rear-delts',
  'biceps', 'triceps', 'forearms',
  'legs', 'quads', 'hamstrings', 'glutes', 'calves',
  'abs', 'core', 'traps'
];

export const EQUIPMENT: Equipment[] = [
  'barbell', 'dumbbell', 'machine', 'cable', 'bodyweight', 'band', 'other'
];

export const LoadTypeSchema = z.enum(['weighted', 'bodyweight', 'assisted', 'timed']);

export const CreateCustomExerciseSchema = z.object({
  name: z.string().trim().min(2, 'MÃƒÆ’Ã‚Â­nimo 2 caracteres').max(60, 'MÃƒÆ’Ã‚Â¡ximo 60 caracteres'),
  primaryMuscles: z.array(z.enum(MUSCLE_GROUPS as [string, ...string[]])).min(1, 'Al menos un mÃƒÆ’Ã‚Âºsculo primario'),
  secondaryMuscles: z.array(z.enum(MUSCLE_GROUPS as [string, ...string[]])).default([]),
  equipment: z.enum(EQUIPMENT as [string, ...string[]]),
  exerciseType: z.enum(['compound', 'isolation']).default('isolation'),
  loadType: LoadTypeSchema,
  description: z.string().max(500).nullable().default(null),
});

export function getErrorMessage(error: unknown): string {
  const defaultMsg = 'No se pudo crear el ejercicio';
  if (error == null) return defaultMsg;
  try {
    const maybe = error as any;
    if (maybe?.fieldErrors && Array.isArray(maybe.fieldErrors.name) && maybe.fieldErrors.name.length) {
      return String(maybe.fieldErrors.name[0]);
    }
    if (typeof maybe === 'string' && maybe.trim()) return maybe;
    if (typeof maybe?.message === 'string' && maybe.message.trim()) return maybe.message;
  } catch {
    // ignore
  }
  return defaultMsg;
}
