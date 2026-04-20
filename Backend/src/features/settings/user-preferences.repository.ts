import type { UserPreferences } from './user-preferences.entity';

export interface UserPreferencesRepository {
  /** Gets all preferences combined */
  getAll(): Promise<UserPreferences>;
  
  /** Gets a specific preference by key */
  get<K extends keyof UserPreferences>(key: K): Promise<UserPreferences[K] | null>;
  
  /** Sets a specific preference */
  set<K extends keyof UserPreferences>(key: K, value: UserPreferences[K]): Promise<void>;
}
