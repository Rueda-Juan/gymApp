import type { UserPreferencesRepository } from './user-preferences.repository';
import type { UserPreferences } from './user-preferences.entity';

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export class SettingsService {
  constructor(private readonly preferencesRepo: UserPreferencesRepository) {}

  // ── Read ──────────────────────────────────────────────────────────────────

  async getPreferences(): Promise<UserPreferences> {
    return this.preferencesRepo.getAll();
  }

  // ── Update ────────────────────────────────────────────────────────────────

  async updatePreference<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K],
  ): Promise<void> {
    await this.preferencesRepo.set(key, value);
  }
}