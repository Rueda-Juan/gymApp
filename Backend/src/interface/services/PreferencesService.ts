import type { GetPreferencesUseCase } from '../../application/useCases/settings/GetPreferencesUseCase';
import type { UpdatePreferenceUseCase } from '../../application/useCases/settings/UpdatePreferenceUseCase';
import type { UserPreferences } from '../../domain/entities/UserPreferences';

export class PreferencesService {
  constructor(
    private readonly _getPreferences: GetPreferencesUseCase,
    private readonly _updatePreference: UpdatePreferenceUseCase,
  ) {}

  async getPreferences() {
    return this._getPreferences.execute();
  }

  async updatePreference<K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) {
    return this._updatePreference.execute(key, value);
  }
}
