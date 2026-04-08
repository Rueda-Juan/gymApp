import type * as SQLite from 'expo-sqlite';

import { deduplicateExercises } from '../../scripts/deduplicateExercises';

export const version = 28;
export const name = '028_deduplicate_exercises';

export async function up(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.withTransactionAsync(async () => {
    await deduplicateExercises(db);
  });

  await db.execAsync(
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_exercises_key ON exercises(exercise_key);`,
  );
}
