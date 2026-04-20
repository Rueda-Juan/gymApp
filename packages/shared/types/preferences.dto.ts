// DTO de entrada para preferencias de usuario
import { z } from 'zod';

export const UserPreferencesSchema = z.object({
  weightUnit: z.enum(['kg', 'lbs']).default('kg'),
  theme: z.enum(['light', 'dark', 'system']).default('dark'),
  defaultRestSeconds: z.number().int().min(0).default(90),
});

export type UserPreferencesInput = z.infer<typeof UserPreferencesSchema>;
