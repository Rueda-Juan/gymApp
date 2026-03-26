import type * as SQLite from 'expo-sqlite';

/**
 * Migration 022 — Fix primary muscles for common exercises.
 *
 * Corrects exercises that had 'other' as primary_muscle and adds
 * proper primary_muscles (JSON array) and exercise_type for the
 * most commonly used exercises in training programs.
 *
 * This migration works alongside 021_primary_muscles_array which
 * added the primary_muscles and exercise_type columns.
 */
export const version = 22;
export const name = '022_fix_exercise_muscles';

/**
 * Map of exercise name → [primary_muscles[], secondary_muscles[], exercise_type]
 *
 * These are the most commonly used exercises that had incorrect
 * muscle data in the original wger seed.
 */
const EXERCISE_FIXES: Array<{
  name: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  exerciseType: 'compound' | 'isolation';
}> = [
  // ── Exercises that had 'other' as primary_muscle ──

  { name: '2 Handed Kettlebell Swing',
    primaryMuscles: ['glutes', 'hamstrings'],
    secondaryMuscles: ['back', 'shoulders', 'abs'],
    exerciseType: 'compound' },

  { name: 'Arnold Shoulder Press',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: ['triceps'],
    exerciseType: 'compound' },

  { name: 'Axe Hold',
    primaryMuscles: ['forearms'],
    secondaryMuscles: [],
    exerciseType: 'isolation' },

  { name: 'Barbell Hack Squats',
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves'],
    exerciseType: 'compound' },

  { name: 'Barbell Reverse Wrist Curl',
    primaryMuscles: ['forearms'],
    secondaryMuscles: [],
    exerciseType: 'isolation' },

  { name: 'Bent-over Lateral Raises',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: ['traps', 'back'],
    exerciseType: 'isolation' },

  { name: 'Body-Ups',
    primaryMuscles: ['chest', 'triceps'],
    secondaryMuscles: ['shoulders'],
    exerciseType: 'compound' },

  { name: 'Burpees',
    primaryMuscles: ['quadriceps', 'chest'],
    secondaryMuscles: ['shoulders', 'triceps', 'abs', 'glutes'],
    exerciseType: 'compound' },

  { name: 'Chin Up',
    primaryMuscles: ['back', 'biceps'],
    secondaryMuscles: ['forearms', 'abs'],
    exerciseType: 'compound' },

  { name: 'Ball crunches',
    primaryMuscles: ['abs'],
    secondaryMuscles: [],
    exerciseType: 'isolation' },

  { name: 'Deadbug',
    primaryMuscles: ['abs'],
    secondaryMuscles: ['glutes'],
    exerciseType: 'isolation' },

  { name: 'Deadhang',
    primaryMuscles: ['forearms', 'back'],
    secondaryMuscles: ['shoulders'],
    exerciseType: 'compound' },

  { name: 'Deficit Deadlift',
    primaryMuscles: ['back', 'hamstrings', 'glutes'],
    secondaryMuscles: ['quadriceps', 'traps', 'forearms'],
    exerciseType: 'compound' },

  { name: 'Diagonal Shoulder Press',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: ['triceps'],
    exerciseType: 'compound' },

  { name: 'Hand Grip',
    primaryMuscles: ['forearms'],
    secondaryMuscles: [],
    exerciseType: 'isolation' },

  { name: 'Hip Raise, Lying',
    primaryMuscles: ['glutes', 'hamstrings'],
    secondaryMuscles: ['abs'],
    exerciseType: 'compound' },

  // ── Exercises with correct single primary but need multi-muscle + exerciseType ──

  { name: 'Bench Press',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['triceps', 'shoulders'],
    exerciseType: 'compound' },

  { name: 'Incline Bench Press',
    primaryMuscles: ['chest', 'shoulders'],
    secondaryMuscles: ['triceps'],
    exerciseType: 'compound' },

  { name: 'Deadlift',
    primaryMuscles: ['back', 'hamstrings', 'glutes'],
    secondaryMuscles: ['quadriceps', 'traps', 'forearms'],
    exerciseType: 'compound' },

  { name: 'Squat',
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings', 'abs', 'back'],
    exerciseType: 'compound' },

  { name: 'Barbell Squat',
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings', 'abs', 'back'],
    exerciseType: 'compound' },

  { name: 'Front Squat',
    primaryMuscles: ['quadriceps'],
    secondaryMuscles: ['glutes', 'abs', 'back'],
    exerciseType: 'compound' },

  { name: 'Overhead Press',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: ['triceps', 'traps', 'abs'],
    exerciseType: 'compound' },

  { name: 'Barbell Row',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps', 'traps', 'forearms'],
    exerciseType: 'compound' },

  { name: 'Bent Over Row',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps', 'traps'],
    exerciseType: 'compound' },

  { name: 'Pull Up',
    primaryMuscles: ['back', 'biceps'],
    secondaryMuscles: ['forearms', 'abs'],
    exerciseType: 'compound' },

  { name: 'Romanian Deadlift',
    primaryMuscles: ['hamstrings', 'glutes'],
    secondaryMuscles: ['back'],
    exerciseType: 'compound' },

  { name: 'Leg Press',
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings'],
    exerciseType: 'compound' },

  { name: 'Dips',
    primaryMuscles: ['chest', 'triceps'],
    secondaryMuscles: ['shoulders'],
    exerciseType: 'compound' },

  { name: 'Lunges',
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves'],
    exerciseType: 'compound' },

  { name: 'Hip Thrust',
    primaryMuscles: ['glutes'],
    secondaryMuscles: ['hamstrings', 'quadriceps'],
    exerciseType: 'compound' },

  { name: 'Lat Pulldown',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps', 'forearms'],
    exerciseType: 'compound' },

  { name: 'Cable Row',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps', 'traps'],
    exerciseType: 'compound' },

  { name: 'Push Up',
    primaryMuscles: ['chest', 'triceps'],
    secondaryMuscles: ['shoulders', 'abs'],
    exerciseType: 'compound' },

  { name: 'Face Pull',
    primaryMuscles: ['shoulders', 'traps'],
    secondaryMuscles: ['back'],
    exerciseType: 'compound' },

  { name: 'Lunge',
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings'],
    exerciseType: 'compound' },
];

export async function up(db: SQLite.SQLiteDatabase): Promise<void> {
  for (const fix of EXERCISE_FIXES) {
    await db.runAsync(
      `UPDATE exercises
       SET primary_muscles = ?,
           primary_muscle = ?,
           secondary_muscles = ?,
           exercise_type = ?
       WHERE name = ?`,
      [
        JSON.stringify(fix.primaryMuscles),
        fix.primaryMuscles[0] ?? 'other',
        JSON.stringify(fix.secondaryMuscles),
        fix.exerciseType,
        fix.name,
      ],
    );
  }
}
