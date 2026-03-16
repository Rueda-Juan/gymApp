import type * as SQLite from 'expo-sqlite';
import type { UserPreferences } from '../../domain/entities/UserPreferences';
import type { UserPreferencesRepository } from '../../domain/repositories/UserPreferencesRepository';
import { DatabaseError } from '../../shared/errors';

export class SQLiteUserPreferencesRepository implements UserPreferencesRepository {
  constructor(private readonly db: SQLite.SQLiteDatabase) {}

  async getAll(): Promise<UserPreferences> {
    try {
      const rows = await this.db.getAllAsync<{ key: string; value: string }>(
        'SELECT key, value FROM user_preferences',
      );

      // Defaults in case the table is somehow empty
      const prefs: UserPreferences = {
        weightUnit: 'kg',
        theme: 'dark',
        defaultRestSeconds: 90,
      };

      for (const row of rows) {
        if (row.key === 'weight_unit') prefs.weightUnit = row.value as 'kg' | 'lbs';
        if (row.key === 'theme') prefs.theme = row.value as 'light' | 'dark' | 'system';
        if (row.key === 'default_rest_seconds') prefs.defaultRestSeconds = parseInt(row.value, 10);
      }

      return prefs;
    } catch (error) {
      throw new DatabaseError('Error al obtener preferencias del usuario', error);
    }
  }

  async get<K extends keyof UserPreferences>(key: K): Promise<UserPreferences[K] | null> {
    try {
      const dbKey = this.mapKeyToDb(key);
      const row = await this.db.getFirstAsync<{ value: string }>(
        'SELECT value FROM user_preferences WHERE key = ?',
        [dbKey],
      );

      if (!row) return null;

      if (key === 'defaultRestSeconds') return parseInt(row.value, 10) as UserPreferences[K];
      return row.value as UserPreferences[K];
    } catch (error) {
      throw new DatabaseError(`Error al obtener preferencia ${key}`, error);
    }
  }

  async set<K extends keyof UserPreferences>(key: K, value: UserPreferences[K]): Promise<void> {
    try {
      const dbKey = this.mapKeyToDb(key);
      const dbValue = value.toString();

      await this.db.runAsync(
        `INSERT INTO user_preferences (key, value, updated_at) 
         VALUES (?, ?, datetime('now'))
         ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = datetime('now')`,
        [dbKey, dbValue, dbValue],
      );
    } catch (error) {
      throw new DatabaseError(`Error al guardar preferencia ${key}`, error);
    }
  }

  private mapKeyToDb(key: keyof UserPreferences): string {
    switch (key) {
      case 'weightUnit': return 'weight_unit';
      case 'theme': return 'theme';
      case 'defaultRestSeconds': return 'default_rest_seconds';
    }
  }
}
