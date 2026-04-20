
import { z } from 'zod';
import { MUSCLE_GROUPS, EQUIPMENT } from '@shared';

export const LoadTypeSchema = z.enum(['weighted', 'bodyweight', 'assisted', 'timed']);

export const CreateCustomExerciseSchema = z.object({
  name: z.string().trim().min(2, 'Mínimo 2 caracteres').max(60, 'Máximo 60 caracteres'),
  primaryMuscles: z.array(z.enum(MUSCLE_GROUPS, {
    errorMap: () => ({ message: 'Grupo muscular inválido' }),
  })).min(1, 'Al menos un músculo primario'),
  secondaryMuscles: z.array(z.enum(MUSCLE_GROUPS)).default([]),
  equipment: z.enum(EQUIPMENT, {
    errorMap: () => ({ message: 'Equipamiento inválido' }),
  }),
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
