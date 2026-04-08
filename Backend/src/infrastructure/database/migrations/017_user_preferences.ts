import type * as SQLite from 'expo-sqlite';

/**
 * Migration 017 — Create user_preferences table.
 * Key-value store for user settings (weight unit, theme, default rest, etc.).
 */
export const version = 17;
export const name = '017_user_preferences';

export async function up(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS user_preferences (
      key        TEXT PRIMARY KEY,
      value      TEXT NOT NULL,
      updated_at DATETIME DEFAULT (datetime('now'))
    );
  `);

  // Insert default preferences
  await db.execAsync(`
    INSERT OR IGNORE INTO user_preferences (key, value) VALUES
      ('weight_unit', 'kg'),
      ('theme', 'dark'),
      ('default_rest_seconds', '90'),
      ('haptics_enabled', 'true');
  `);
}
