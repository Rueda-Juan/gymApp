import { z } from 'zod';
import { ValidationError } from '@core/errors/errors';

export const BackupSchema = z.object({
  version: z.number(),
  timestamp: z.string().datetime(),
  data: z.record(z.string(), z.array(z.record(z.string(), z.unknown()))),
});

export type BackupInput = z.infer<typeof BackupSchema>;

export function validateBackupInput(raw: unknown): BackupInput {
  const result = BackupSchema.safeParse(raw);
  if (!result.success) {
    throw new ValidationError(
      'Backup XML/JSON inválido',
      result.error.flatten().fieldErrors as Record<string, string[]>,
    );
  }
  return result.data;
}
