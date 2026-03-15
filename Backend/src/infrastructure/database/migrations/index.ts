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
  m011, m012, m013
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
