import type * as SQLite from 'expo-sqlite';

import * as m001 from './001_schema_migrations';
import * as m002 from './002_exercises';
import * as m003 from './003_routines';
import * as m004 from './004_routine_exercises';
import * as m005 from './005_workouts';
import * as m006 from './006_workout_exercises';
import * as m007 from './007_sets';
import * as m008 from './008_exercise_stats';
import * as m009 from './009_personal_records';
import * as m010 from './010_daily_stats';
import * as m011 from './011_add_rir_and_rep_range';
import * as m012 from './012_add_anatomical_svg_to_exercises';
import * as m013 from './013_seed_wger_exercises';
import * as m014 from './014_add_set_type';
import * as m015 from './015_add_workout_exercise_notes';
import * as m016 from './016_add_rest_seconds';
import * as m017 from './017_user_preferences';
import * as m018 from './018_body_weight_log';
import * as m019 from './019_superset_groups';
import * as m020 from './020_add_max_reps';
import * as m021 from './021_primary_muscles_array';
import * as m022 from './022_fix_exercise_muscles';
import * as m023 from './023_fix_more_exercise_muscles';
import * as m024 from './024_fix_exercise_muscles_batch3';
import * as m025 from './025_fix_exercise_muscles_batch4';
import * as m026 from './026_add_name_es_column';
import * as m027 from './027_add_exercise_key';
import * as m028 from './028_deduplicate_exercises';
import * as m029 from './029_add_custom_exercise_fields';
import * as m030 from './030_add_exercise_load_cache';

interface Migration {
  version: number;
  name: string;
  up: (db: SQLite.SQLiteDatabase) => Promise<void>;
}

/**
 * All migrations in order. Add new migrations to the end.
 */
const migrations: Migration[] = [
  m001, m002, m003, m004, m005,
  m006, m007, m008, m009, m010,
  m011, m012, m013, m014, m015,
  m016, m017, m018, m019, m020,
  m021, m022, m023, m024, m025,
  m026, m027, m028, m029, m030,
];

/**
 * Runs all pending migrations in order.
 * Tracks applied versions in `schema_migrations` table.
 */
export async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
  // Always run migration 001 first (creates the tracking table)
  await m001.up(db);

  // Get already-applied versions
  const applied = await db.getAllAsync<{ version: number }>(
    'SELECT version FROM schema_migrations ORDER BY version',
  );
  const appliedVersions = new Set(applied.map((r) => r.version));

  // Run pending migrations
  for (const migration of migrations) {
    if (!appliedVersions.has(migration.version)) {
      await migration.up(db);
      await db.runAsync(
        'INSERT OR IGNORE INTO schema_migrations (version, name) VALUES (?, ?)',
        [migration.version, migration.name],
      );
    }
  }
}
