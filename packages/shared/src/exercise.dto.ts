// DTO de entrada para crear un ejercicio
import { z } from 'zod';


export const CreateExerciseInputSchema = z.object({
  name: z.string().min(1).max(100),
  primaryMuscles: z.array(z.enum([
    'chest', 'upper-chest', 'mid-chest', 'lower-chest',
    'back', 'lats', 'upper-back', 'mid-back', 'lower-back',
    'shoulders', 'front-delts', 'side-delts', 'rear-delts',
    'biceps', 'triceps', 'forearms',
    'legs', 'quads', 'hamstrings', 'glutes', 'calves',
    'abs', 'core', 'traps',
  ])).min(1),
  secondaryMuscles: z.array(z.enum([
    'chest', 'upper-chest', 'mid-chest', 'lower-chest',
    'back', 'lats', 'upper-back', 'mid-back', 'lower-back',
    'shoulders', 'front-delts', 'side-delts', 'rear-delts',
    'biceps', 'triceps', 'forearms',
    'legs', 'quads', 'hamstrings', 'glutes', 'calves',
    'abs', 'core', 'traps',
  ])).default([]),
  equipment: z.enum([
    'barbell', 'dumbbell', 'machine', 'cable', 'bodyweight', 'band', 'other',
  ]),
  exerciseType: z.enum(['compound', 'isolation']).default('isolation'),
  weightIncrement: z.number().min(0).default(2.5),
  animationPath: z.string().nullable().default(null),
  description: z.string().nullable().default(null),
  anatomicalRepresentationSvg: z.string().nullable().default(null),
  loadType: z.enum(['weighted', 'bodyweight', 'assisted', 'timed']).default('weighted'),
});

export type CreateExerciseInput = z.infer<typeof CreateExerciseInputSchema>;
