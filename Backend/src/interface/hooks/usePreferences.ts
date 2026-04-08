import { useCallback, useMemo } from 'react';
import { useContainer } from './useContainer';
import type { UserPreferences } from '../../domain/entities/UserPreferences';

export function usePreferences() {
  const { getPreferences: getPreferencesUseCase, updatePreference: updatePreferenceUseCase } = useContainer();

  const getPreferences = useCallback(
    () => getPreferencesUseCase.execute(),
    [getPreferencesUseCase],
  );

  const updatePreference = useCallback(
    <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => updatePreferenceUseCase.execute(key, value),
    [updatePreferenceUseCase],
  );

  return useMemo(() => ({
    getPreferences,
    updatePreference,
  }), [getPreferences, updatePreference]);
}
