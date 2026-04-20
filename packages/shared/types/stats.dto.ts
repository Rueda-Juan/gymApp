// DTO de entrada para estadísticas (placeholder, completar según necesidad)
import { z } from 'zod';

export const StatsEntrySchema = z.object({
  userId: z.string().min(1),
  date: z.string(),
  volume: z.number(),
  prCount: z.number(),
});

export type StatsEntryInput = z.infer<typeof StatsEntrySchema>;
