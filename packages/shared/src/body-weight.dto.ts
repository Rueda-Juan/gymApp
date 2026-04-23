// DTO de entrada para crear registro de peso corporal
import { z } from 'zod';

export const BodyWeightEntrySchema = z.object({
  weight: z.number().positive(),
  date: z.union([z.string(), z.date()]),
  notes: z.string().max(500).nullable().default(null),
});

export type BodyWeightEntryInput = z.infer<typeof BodyWeightEntrySchema>;
