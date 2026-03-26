import type * as SQLite from 'expo-sqlite';

/**
 * Migration 023 — Fix muscles for 40 additional exercises.
 *
 * Continues the work of 022 by correcting primary_muscles,
 * secondary_muscles and exercise_type for exercises that still
 * had 'other' as primary or incorrect muscle assignments.
 */
export const version = 23;
export const name = '023_fix_more_exercise_muscles';

const EXERCISE_FIXES: Array<{
  name: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  exerciseType: 'compound' | 'isolation';
}> = [
  // ── Exercises that had 'other' as primary_muscle ──

  { name: 'Jogging',
    primaryMuscles: ['quadriceps', 'hamstrings'],
    secondaryMuscles: ['calves', 'glutes', 'abs'],
    exerciseType: 'compound' },

  { name: 'Run',
    primaryMuscles: ['quadriceps', 'hamstrings'],
    secondaryMuscles: ['calves', 'glutes'],
    exerciseType: 'compound' },

  { name: 'Run - Treadmill',
    primaryMuscles: ['quadriceps', 'hamstrings'],
    secondaryMuscles: ['calves', 'glutes'],
    exerciseType: 'compound' },

  { name: 'Run - Interval Training',
    primaryMuscles: ['quadriceps', 'hamstrings'],
    secondaryMuscles: ['calves', 'glutes', 'abs'],
    exerciseType: 'compound' },

  { name: 'Overhead Squat',
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['shoulders', 'abs', 'back'],
    exerciseType: 'compound' },

  { name: 'Speed Deadlift',
    primaryMuscles: ['back', 'hamstrings', 'glutes'],
    secondaryMuscles: ['quadriceps', 'traps', 'forearms'],
    exerciseType: 'compound' },

  { name: 'V-Bar Pulldown',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps', 'forearms'],
    exerciseType: 'compound' },

  { name: 'Rear Delt Raises',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: ['traps', 'back'],
    exerciseType: 'isolation' },

  { name: 'Reverse Plank',
    primaryMuscles: ['abs', 'glutes'],
    secondaryMuscles: ['shoulders', 'back'],
    exerciseType: 'compound' },

  { name: 'Roman Chair',
    primaryMuscles: ['abs'],
    secondaryMuscles: [],
    exerciseType: 'isolation' },

  { name: 'Weighted Step-ups',
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves'],
    exerciseType: 'compound' },

  { name: 'L Hold',
    primaryMuscles: ['abs'],
    secondaryMuscles: ['forearms', 'shoulders'],
    exerciseType: 'isolation' },

  { name: 'Dumbbell Push-Up',
    primaryMuscles: ['chest', 'triceps'],
    secondaryMuscles: ['shoulders'],
    exerciseType: 'compound' },

  { name: 'Barbell Lunges Walking',
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves'],
    exerciseType: 'compound' },

  { name: 'One Arm Triceps Extensions on Cable',
    primaryMuscles: ['triceps'],
    secondaryMuscles: [],
    exerciseType: 'isolation' },

  { name: 'Rowing with TRX band',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps', 'abs'],
    exerciseType: 'compound' },

  { name: 'Side-lying External Rotation',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: [],
    exerciseType: 'isolation' },

  { name: 'Lying Rotator Cuff Exercise',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: [],
    exerciseType: 'isolation' },

  { name: 'Standing Rope Forearm',
    primaryMuscles: ['forearms'],
    secondaryMuscles: [],
    exerciseType: 'isolation' },

  { name: 'Stationary Bike',
    primaryMuscles: ['quadriceps', 'hamstrings'],
    secondaryMuscles: ['calves', 'glutes'],
    exerciseType: 'compound' },

  { name: 'Front Wood Chop',
    primaryMuscles: ['abs'],
    secondaryMuscles: ['shoulders', 'back'],
    exerciseType: 'compound' },

  { name: 'Press militar',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: ['triceps', 'traps'],
    exerciseType: 'compound' },

  { name: 'Zone 2 Running',
    primaryMuscles: ['quadriceps', 'hamstrings'],
    secondaryMuscles: ['calves', 'glutes'],
    exerciseType: 'compound' },

  { name: 'Incline Dumbbell Row',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps', 'traps'],
    exerciseType: 'compound' },

  { name: 'Flexión a pino contra la pared',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: ['triceps', 'chest', 'traps'],
    exerciseType: 'compound' },

  // ── Exercises with correct single primary but missing multi-muscle + exerciseType ──

  { name: 'Benchpress Dumbbells',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['shoulders', 'triceps'],
    exerciseType: 'compound' },

  { name: 'Decline Bench Press Barbell',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['triceps', 'shoulders'],
    exerciseType: 'compound' },

  { name: 'Decline Bench Press Dumbbell',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['triceps', 'shoulders'],
    exerciseType: 'compound' },

  { name: 'Fly With Dumbbells',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['shoulders'],
    exerciseType: 'isolation' },

  { name: 'Incline Dumbbell Fly',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['shoulders'],
    exerciseType: 'isolation' },

  { name: 'Good Mornings',
    primaryMuscles: ['hamstrings', 'back'],
    secondaryMuscles: ['glutes'],
    exerciseType: 'compound' },

  { name: 'Stiff-legged Deadlifts',
    primaryMuscles: ['hamstrings', 'glutes'],
    secondaryMuscles: ['back'],
    exerciseType: 'compound' },

  { name: 'Nordic Curl',
    primaryMuscles: ['hamstrings'],
    secondaryMuscles: ['glutes'],
    exerciseType: 'isolation' },

  { name: 'Reverse Nordic Curl',
    primaryMuscles: ['quadriceps'],
    secondaryMuscles: ['glutes', 'abs'],
    exerciseType: 'isolation' },

  { name: 'Glute Bridge',
    primaryMuscles: ['glutes'],
    secondaryMuscles: ['hamstrings', 'abs'],
    exerciseType: 'compound' },

  { name: 'Hanging Leg Raises',
    primaryMuscles: ['abs'],
    secondaryMuscles: ['forearms'],
    exerciseType: 'isolation' },

  { name: 'Sumo Deadlift',
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings', 'back', 'traps'],
    exerciseType: 'compound' },

  { name: 'Hammercurls',
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearms'],
    exerciseType: 'isolation' },

  { name: 'Lateral Raises',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: [],
    exerciseType: 'isolation' },

  { name: 'Hyperextensions',
    primaryMuscles: ['back', 'glutes'],
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
