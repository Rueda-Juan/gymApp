import { z } from 'zod';

const ErrorSchema = z.object({
  message: z.string().optional(),
  fieldErrors: z.record(z.string(), z.unknown()).optional(),
}).catchall(z.unknown());

export function getErrorMessage(error: unknown): string {
  const defaultMsg = 'No se pudo crear el ejercicio';
  if (error == null) return defaultMsg;

  try {
    const parsed = ErrorSchema.safeParse(error);
    if (parsed.success) {
      const data = parsed.data;
      if (data.fieldErrors) {
        const nameErrors = data.fieldErrors.name;
        if (Array.isArray(nameErrors) && nameErrors.length > 0) {
          return String(nameErrors[0]);
        }
      }
      if (typeof data.message === 'string' && data.message.trim()) {
        return data.message;
      }
    }
    if (typeof error === 'string' && error.trim()) return error;
  } catch {
    // ignore
  }
  return defaultMsg;
}
