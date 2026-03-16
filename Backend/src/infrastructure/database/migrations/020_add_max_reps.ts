import type * as SQLite from 'expo-sqlite';

export async function up(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    ALTER TABLE exercise_stats ADD COLUMN max_reps INTEGER DEFAULT 0;
  `);
}
