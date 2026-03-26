import type { UserPreferencesRepository } from '../../../domain/repositories/UserPreferencesRepository';
import type { UserPreferences } from '../../../domain/entities/UserPreferences';

export class UpdatePreferenceUseCase {
  constructor(private readonly preferencesRepo: UserPreferencesRepository) {}

  async execute<K extends keyof UserPreferences>(key: K, value: UserPreferences[K]): Promise<void> {
    await this.preferencesRepo.set(key, value);
  }
}
