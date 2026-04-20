import type * as SQLite from 'expo-sqlite';
// import { WGER_SEED_SQL } from '../../scripts/seed_wger';

/**
 * Migration 031 — remove wger seed exercises
 * Parses the original seed SQL to obtain the exercise IDs and
 * removes dependent rows in a safe order before deleting the exercises.
 */
export const version = 31;
export const name = '031_remove_wger_seed_exercises';

export async function up(db: SQLite.SQLiteDatabase): Promise<void> {
  // Identify seed exercises by known markers (wger image host). This avoids
  // importing compiled seed SQL and prevents bundler resolution issues.
  // Matches exercises whose anatomical_representation_svg, animation_path or
  // description reference wger.de — these are the entries inserted by the seed.
  const marker = '%wger.de%';

  try {
    await db.execAsync('BEGIN TRANSACTION;');

    // 1) Remove sets that reference these exercises
    await db.execAsync(`
      DELETE FROM sets
      WHERE exercise_id IN (
        SELECT id FROM exercises WHERE anatomical_representation_svg LIKE '${marker}'
          OR (animation_path IS NOT NULL AND animation_path LIKE '${marker}')
          OR (description IS NOT NULL AND description LIKE '${marker}')
      );
    `);

    // 2) Remove workout_exercises referencing these exercises
    await db.execAsync(`
      DELETE FROM workout_exercises
      WHERE exercise_id IN (
        SELECT id FROM exercises WHERE anatomical_representation_svg LIKE '${marker}'
          OR (animation_path IS NOT NULL AND animation_path LIKE '${marker}')
          OR (description IS NOT NULL AND description LIKE '${marker}')
      );
    `);

    // 3) Remove routine_exercises referencing these exercises
    await db.execAsync(`
      DELETE FROM routine_exercises
      WHERE exercise_id IN (
        SELECT id FROM exercises WHERE anatomical_representation_svg LIKE '${marker}'
          OR (animation_path IS NOT NULL AND animation_path LIKE '${marker}')
          OR (description IS NOT NULL AND description LIKE '${marker}')
      );
    `);

    // 4) Remove any cached entries (table may not exist on older schemas)
    try {
      await db.execAsync(`
        DELETE FROM exercise_load_cache
        WHERE exercise_id IN (
          SELECT id FROM exercises WHERE anatomical_representation_svg LIKE '${marker}'
            OR (animation_path IS NOT NULL AND animation_path LIKE '${marker}')
            OR (description IS NOT NULL AND description LIKE '${marker}')
        );
      `);
    } catch (e) {
      // ignore if table does not exist
    }

    // 5) Finally delete exercises themselves
    await db.execAsync(`
      DELETE FROM exercises
      WHERE anatomical_representation_svg LIKE '${marker}'
        OR (animation_path IS NOT NULL AND animation_path LIKE '${marker}')
        OR (description IS NOT NULL AND description LIKE '${marker}');
    `);

    await db.execAsync('COMMIT;');
  } catch (err) {
    await db.execAsync('ROLLBACK;');
    throw err;
  }
}
