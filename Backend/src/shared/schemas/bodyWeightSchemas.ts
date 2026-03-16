import { z } from 'zod';
import { ValidationError } from '../errors';

export const BodyWeightEntrySchema = z.object({
  weight: z.number().positive('El peso debe ser positivo'),
  date: z.union([z.string().datetime(), z.date()]),
  notes: z.string().max(500).nullable().default(null),
});

export type BodyWeightEntryInput = z.infer<typeof BodyWeightEntrySchema>;

export function validateBodyWeightInput(raw: unknown): BodyWeightEntryInput {
  const result = BodyWeightEntrySchema.safeParse(raw);
  if (!result.success) {
    throw new ValidationError(
      'Registro de peso corporal inválido',
      result.error.flatten().fieldErrors as Record<string, string[]>,
    );
  }
  return result.data;
}
