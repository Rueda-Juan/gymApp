// DTO de entrada para crear rutina
import { z } from 'zod';

export const RoutineExerciseSchema = z.object({
  exerciseId: z.string().min(1),
  orderIndex: z.number().int().min(0),
  targetSets: z.number().int().positive(),
  minReps: z.number().int().positive(),
  maxReps: z.number().int().positive(),
  restSeconds: z.number().int().min(0).nullable().default(null),
  supersetGroup: z.number().int().nullable().default(null),
}).refine(data => data.minReps <= data.maxReps, {
  message: 'minReps no puede ser mayor que maxReps',
  path: ['minReps'],
});

export const CreateRoutineInputSchema = z.object({
  name: z.string().min(1).max(100),
  notes: z.string().max(500).nullable().default(null),
  exercises: z.array(RoutineExerciseSchema).min(1),
});

export type CreateRoutineInput = z.infer<typeof CreateRoutineInputSchema>;
