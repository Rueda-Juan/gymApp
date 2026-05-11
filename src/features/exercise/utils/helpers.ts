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
  name: z.string().trim().min(2, 'Mínimo 2 caracteres').max(60, 'Máximo 60 caracteres'),
  primaryMuscles: z.array(z.enum(MUSCLE_GROUPS as [string, ...string[]])).min(1, 'Al menos un músculo primario'),
  secondaryMuscles: z.array(z.enum(MUSCLE_GROUPS as [string, ...string[]])).default([]),
  equipment: z.enum(EQUIPMENT as [string, ...string[]]),
  exerciseType: z.enum(['compound', 'isolation']).default('isolation'),
  loadType: LoadTypeSchema,
  description: z.string().max(500).nullable().default(null),
});

import { getErrorMessage } from '@/shared/lib/errorHelpers';

export { getErrorMessage };

