/**
 * Parses a string input into a valid number for weights.
 * Normalizes commas to dots and strips non-numeric characters.
 */
export function parseWeight(value: string): number {
  const normalized = value.replace(',', '.').replace(/[^0-9.]/g, '');
  const parsed = parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}
