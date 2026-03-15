import * as Crypto from 'expo-crypto';

/**
 * Generates a UUID v4 string for use as entity primary key.
 * Uses expo-crypto for native performance instead of the uuid package.
 */
export function generateId(): string {
  return Crypto.randomUUID();
}
