import { useCallback, useMemo } from 'react';
import { useContainer } from './useContainer';
import type { UserPreferences } from '../../domain/entities/UserPreferences';

/**
 * Hook that exposes user preferences operations.
 * Wraps PreferencesService from the DI container.
 */
export function usePreferences() {
  const { preferencesService } = useContainer();

  const getPreferences = useCallback(
    () => preferencesService.getPreferences(),
    [preferencesService],
  );

  const updatePreference = useCallback(
    <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) =>
      preferencesService.updatePreference(key, value),
    [preferencesService],
  );

  return useMemo(() => ({
    getPreferences,
    updatePreference,
  }), [getPreferences, updatePreference]);
}
