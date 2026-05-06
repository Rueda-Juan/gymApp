import { z } from 'zod';

const ErrorSchema = z.object({
  message: z.string().optional(),
  fieldErrors: z.record(z.string(), z.unknown()).optional(),
}).catchall(z.unknown());

export function getErrorMessage(error: unknown, fallback = 'Ocurrió un error inesperado'): string {
  if (error == null) return fallback;

  // Handle SQLite/DB specific errors if possible (based on message patterns)
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (msg.includes('database is locked')) return 'La base de datos está ocupada. Reintenta en un momento.';
    if (msg.includes('disk full') || msg.includes('no space left')) return 'Espacio en disco insuficiente para guardar.';
    if (msg.includes('unique constraint')) return 'Ya existe un registro con estos datos.';
    return error.message;
  }

  try {
    const parsed = ErrorSchema.safeParse(error);
    if (parsed.success) {
      const data = parsed.data;
      if (data.fieldErrors) {
        // Try to find the first field error
        const firstField = Object.values(data.fieldErrors)[0];
        if (Array.isArray(firstField) && firstField.length > 0) {
          return String(firstField[0]);
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
  return fallback;
}
