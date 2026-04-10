import type * as SQLite from 'expo-sqlite';

export const version = 29;
export const name = '029_add_custom_exercise_fields';

export async function up(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`ALTER TABLE exercises ADD COLUMN is_custom BOOLEAN NOT NULL DEFAULT 0;`);
  await db.execAsync(`ALTER TABLE exercises ADD COLUMN created_by TEXT;`);
  await db.execAsync(`
    ALTER TABLE exercises ADD COLUMN load_type TEXT NOT NULL DEFAULT 'weighted'
      CHECK(load_type IN ('weighted', 'bodyweight', 'assisted', 'timed'));
  `);
  await db.execAsync(`ALTER TABLE exercises ADD COLUMN is_archived BOOLEAN NOT NULL DEFAULT 0;`);
  await db.execAsync(`ALTER TABLE exercises ADD COLUMN name_es TEXT;`);

  await db.execAsync(`
    UPDATE exercises SET load_type = 'bodyweight' WHERE equipment = 'bodyweight';
  `);

  await db.execAsync(
    `CREATE INDEX IF NOT EXISTS idx_exercises_is_custom ON exercises(is_custom);`,
  );
  await db.execAsync(
    `CREATE INDEX IF NOT EXISTS idx_exercises_load_type ON exercises(load_type);`,
  );
  await db.execAsync(
    `CREATE INDEX IF NOT EXISTS idx_exercises_created_by ON exercises(created_by);`,
  );
}
