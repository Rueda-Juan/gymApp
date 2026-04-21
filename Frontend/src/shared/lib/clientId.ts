let fallbackCounter = 0;

export function createClientId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  fallbackCounter += 1;
  return `id-${Date.now()}-${fallbackCounter.toString(36)}`;
}
