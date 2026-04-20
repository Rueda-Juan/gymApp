import type * as SQLite from 'expo-sqlite';

export const version = 27;
export const name = '027_add_exercise_key';

export async function up(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`ALTER TABLE exercises ADD COLUMN exercise_key TEXT;`);

  await db.execAsync(`
    UPDATE exercises
    SET exercise_key = LOWER(
      REPLACE(REPLACE(REPLACE(REPLACE(TRIM(name), ' ', '_'), '''', ''), '-', '_'), '.', '')
    )
    WHERE exercise_key IS NULL;
  `);
}
