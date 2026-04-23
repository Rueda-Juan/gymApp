// DTO de entrada para crear un set de entrenamiento
import { z } from 'zod';


export const CreateSetInputSchema = z.object({
  exerciseId: z.string().min(1),
  setNumber: z.number().int().positive(),
  weight: z.number().min(0),
  reps: z.number().int().min(0),
  setType: z.enum(['normal', 'warmup', 'dropset', 'failure']).default('normal'),
  rir: z.number().int().min(0).max(10).nullable().default(null),
  partialReps: z.number().int().min(0).nullable().default(null),
  restSeconds: z.number().int().min(0).nullable().default(null),
  durationSeconds: z.number().int().min(0).default(0),
  completed: z.boolean().default(false),
  skipped: z.boolean().default(false),
});

export type CreateSetInput = z.infer<typeof CreateSetInputSchema>;
