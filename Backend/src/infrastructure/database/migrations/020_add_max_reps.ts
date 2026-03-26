import type * as SQLite from 'expo-sqlite';

export const version = 20;
export const name = '020_add_max_reps';

export async function up(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    ALTER TABLE exercise_stats ADD COLUMN max_reps INTEGER DEFAULT 0;
  `);
}
