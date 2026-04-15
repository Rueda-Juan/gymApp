export function getErrorMessage(error: unknown): string {
  const defaultMsg = 'No se pudo crear el ejercicio';
  if (error == null) return defaultMsg;
  try {
    const maybe = error as any;
    if (maybe?.fieldErrors && Array.isArray(maybe.fieldErrors.name) && maybe.fieldErrors.name.length) {
      return String(maybe.fieldErrors.name[0]);
    }
    if (typeof maybe === 'string' && maybe.trim()) return maybe;
    if (typeof maybe?.message === 'string' && maybe.message.trim()) return maybe.message;
  } catch {
    // ignore
  }
  return defaultMsg;
}

export default function ExerciseHelpersDummy() { return null; }
