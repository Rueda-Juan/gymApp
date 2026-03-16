import type { UserPreferencesRepository } from '../../domain/repositories/UserPreferencesRepository';
import type { UserPreferences } from '../../domain/entities/UserPreferences';

export class GetPreferencesUseCase {
  constructor(private readonly preferencesRepo: UserPreferencesRepository) {}

  async execute(): Promise<UserPreferences> {
    return this.preferencesRepo.getAll();
  }
}
