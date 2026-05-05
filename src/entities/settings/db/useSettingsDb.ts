import { useCallback } from 'react';
import { db } from '@/db/connection';
import * as schema from '@/db/schema';

export function useSettingsDb() {
  const getPreferences = useCallback(async () => {
    const prefs = await db.query.userPreferences.findMany();
    return prefs.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
  }, []);

  const updatePreference = useCallback(async (key: string, value: string) => {
    await db.insert(schema.userPreferences)
      .values({ key, value, updatedAt: new Date().toISOString() })
      .onConflictDoUpdate({
        target: schema.userPreferences.key,
        set: { value, updatedAt: new Date().toISOString() },
      });
  }, []);

  return {
    getPreferences,
    updatePreference,
  };
}
