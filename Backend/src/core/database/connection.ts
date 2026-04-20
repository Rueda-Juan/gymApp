import * as SQLite from 'expo-sqlite';

let dbInstance: SQLite.SQLiteDatabase | null = null;

/**
 * Returns the singleton SQLite database connection.
 * Initializes PRAGMAs on first call.
 */
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) return dbInstance;

  const db = await SQLite.openDatabaseAsync('gymapp.db');

  // Enable foreign key constraints (required for ON DELETE CASCADE)
  await db.execAsync('PRAGMA foreign_keys = ON;');

  // WAL mode for better concurrent read/write performance
  await db.execAsync('PRAGMA journal_mode = WAL;');

  dbInstance = db;
  return db;
}

/**
 * Closes the database connection. Use during cleanup or testing.
 */
export async function closeDatabase(): Promise<void> {
  if (dbInstance) {
    await dbInstance.closeAsync();
    dbInstance = null;
  }
}
