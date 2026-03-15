import type * as SQLite from 'expo-sqlite';

/**
 * Migration 001 — Schema migrations tracking table.
 * Must run first to enable version tracking for all other migrations.
 */
export const version = 1;
export const name = '001_schema_migrations';

export async function up(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version    INTEGER PRIMARY KEY,
      name       TEXT NOT NULL,
      applied_at DATETIME DEFAULT (datetime('now'))
    );
  `);
}
