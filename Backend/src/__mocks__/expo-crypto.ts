export function randomUUID(): string {
  return 'mock-uuid-' + Math.random().toString(36).substring(2, 10);
}
