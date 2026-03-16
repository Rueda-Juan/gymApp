import { z } from 'zod';
import { ValidationError } from '../errors';

export const UserPreferencesSchema = z.object({
  weightUnit: z.enum(['kg', 'lbs']).default('kg'),
  theme: z.enum(['light', 'dark', 'system']).default('dark'),
  defaultRestSeconds: z.number().int().min(0).default(90),
});

export type UserPreferencesInput = z.infer<typeof UserPreferencesSchema>;

export function validatePreferencesInput(raw: unknown): UserPreferencesInput {
  const result = UserPreferencesSchema.safeParse(raw);
  if (!result.success) {
    throw new ValidationError(
      'Preferencias inválidas',
      result.error.flatten().fieldErrors as Record<string, string[]>,
    );
  }
  return result.data;
}
