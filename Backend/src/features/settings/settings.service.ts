import type { UserPreferencesRepository } from './user-preferences.repository';
import type { UserPreferences } from './user-preferences.entity';
import { UserPreferencesSchema } from './preferences.schemas';
import { ValidationError } from '../../core/errors/errors';

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
    // Validar el cambio usando un esquema parcial
    const result = UserPreferencesSchema.partial().safeParse({ [key]: value });
    
    if (!result.success) {
      throw new ValidationError(
        `Valor inválido para la preferencia ${key}`,
        result.error.flatten().fieldErrors as Record<string, string[]>,
      );
    }

    await this.preferencesRepo.set(key, value);
  }
}