import type * as SQLite from 'expo-sqlite';

const FK_TABLES_WITH_EXERCISE_ID = [
  'sets',
  'workout_exercises',
  'routine_exercises',
  'exercise_stats',
  'personal_records',
] as const;

/**
 * Finds exercises sharing the same exercise_key and collapses duplicates
 * into the earliest-inserted record (canonical). All FK references in
 * dependent tables are re-pointed to the canonical before deletion.
 *
 * Must be called inside a transaction.
 */
export async function deduplicateExercises(db: SQLite.SQLiteDatabase): Promise<void> {
  const duplicateGroups = await db.getAllAsync<{ exercise_key: string }>(
    `SELECT exercise_key
     FROM exercises
     WHERE exercise_key IS NOT NULL
     GROUP BY exercise_key
     HAVING COUNT(*) > 1`,
  );

  for (const { exercise_key } of duplicateGroups) {
    const exercises = await db.getAllAsync<{ id: string }>(
      `SELECT id FROM exercises WHERE exercise_key = ? ORDER BY rowid ASC`,
      [exercise_key],
    );

    const [canonical, ...duplicates] = exercises;
    if (!canonical || !duplicates.length) continue;

    for (const duplicate of duplicates) {
      for (const table of FK_TABLES_WITH_EXERCISE_ID) {
        await db.runAsync(
          `UPDATE ${table} SET exercise_id = ? WHERE exercise_id = ?`,
          [canonical.id, duplicate.id],
        );
      }

      await db.runAsync(`DELETE FROM exercises WHERE id = ?`, [duplicate.id]);
    }
  }
}
