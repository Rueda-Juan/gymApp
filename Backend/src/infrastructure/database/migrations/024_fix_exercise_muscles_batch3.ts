import type * as SQLite from 'expo-sqlite';

/**
 * Migration 024 — Fix muscles for another 40 exercises.
 *
 * Third batch of muscle data corrections, covering exercises
 * that had wrong primary muscles, missing secondaries, or
 * missing exercise_type classification.
 */
export const version = 24;
export const name = '024_fix_exercise_muscles_batch3';

const EXERCISE_FIXES: Array<{
  name: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  exerciseType: 'compound' | 'isolation';
}> = [
  // ── Exercises with wrong primary muscle ──

  { name: 'Barbell Wrist Curl',
    primaryMuscles: ['forearms'],
    secondaryMuscles: [],
    exerciseType: 'isolation' },

  { name: 'Handstand Pushup',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: ['triceps', 'traps'],
    exerciseType: 'compound' },

  { name: 'Front Squats',
    primaryMuscles: ['quadriceps'],
    secondaryMuscles: ['glutes', 'abs', 'back'],
    exerciseType: 'compound' },

  // ── Exercises missing exercise_type and/or secondary muscles ──

  { name: 'Barbell Ab Rollout',
    primaryMuscles: ['abs'],
    secondaryMuscles: ['shoulders', 'back'],
    exerciseType: 'compound' },

  { name: 'Bench Press Narrow Grip',
    primaryMuscles: ['triceps', 'chest'],
    secondaryMuscles: ['shoulders'],
    exerciseType: 'compound' },

  { name: 'Bent High Pulls',
    primaryMuscles: ['traps'],
    secondaryMuscles: ['shoulders', 'back'],
    exerciseType: 'compound' },

  { name: 'Braced Squat',
    primaryMuscles: ['quadriceps'],
    secondaryMuscles: ['glutes', 'abs'],
    exerciseType: 'compound' },

  { name: 'Chest Press',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['triceps', 'shoulders'],
    exerciseType: 'compound' },

  { name: 'Butterfly',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['shoulders'],
    exerciseType: 'isolation' },

  { name: 'Butterfly Reverse',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: ['traps', 'back'],
    exerciseType: 'isolation' },

  { name: 'Cable External Rotation',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: [],
    exerciseType: 'isolation' },

  { name: 'Cable Woodchoppers',
    primaryMuscles: ['abs'],
    secondaryMuscles: ['shoulders'],
    exerciseType: 'compound' },

  { name: 'Calf Press Using Leg Press Machine',
    primaryMuscles: ['calves'],
    secondaryMuscles: [],
    exerciseType: 'isolation' },

  { name: 'Decline Pushups',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['shoulders', 'triceps'],
    exerciseType: 'compound' },

  { name: 'Diamond push ups',
    primaryMuscles: ['triceps', 'chest'],
    secondaryMuscles: ['shoulders'],
    exerciseType: 'compound' },

  { name: 'Dumbbell Goblet Squat',
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['abs', 'hamstrings'],
    exerciseType: 'compound' },

  { name: 'Dumbbell Lunges Standing',
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves'],
    exerciseType: 'compound' },

  { name: 'Dumbbell Lunges Walking',
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves'],
    exerciseType: 'compound' },

  { name: 'Dumbbell Triceps Extension',
    primaryMuscles: ['triceps'],
    secondaryMuscles: ['shoulders'],
    exerciseType: 'isolation' },

  { name: 'Flutter Kicks',
    primaryMuscles: ['abs'],
    secondaryMuscles: ['quadriceps'],
    exerciseType: 'isolation' },

  { name: 'Fly With Cable',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['shoulders'],
    exerciseType: 'isolation' },

  { name: 'Hollow Hold',
    primaryMuscles: ['abs'],
    secondaryMuscles: [],
    exerciseType: 'isolation' },

  { name: 'Incline Push up',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['triceps', 'shoulders'],
    exerciseType: 'compound' },

  { name: 'Barbell Lunges Standing',
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves'],
    exerciseType: 'compound' },

  { name: 'Cable Cross-over',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['shoulders'],
    exerciseType: 'isolation' },

  { name: 'Landmine press',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: ['chest', 'triceps'],
    exerciseType: 'compound' },

  { name: 'Leg Curls (laying)',
    primaryMuscles: ['hamstrings'],
    secondaryMuscles: ['calves'],
    exerciseType: 'isolation' },

  { name: 'Leg Curls (sitting)',
    primaryMuscles: ['hamstrings'],
    secondaryMuscles: [],
    exerciseType: 'isolation' },

  { name: 'Leg Curls (standing)',
    primaryMuscles: ['hamstrings'],
    secondaryMuscles: [],
    exerciseType: 'isolation' },

  { name: 'Pendelay Rows',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps', 'traps'],
    exerciseType: 'compound' },

  { name: 'Shoulder Shrug',
    primaryMuscles: ['traps'],
    secondaryMuscles: ['shoulders'],
    exerciseType: 'isolation' },

  { name: 'Sumo Squats',
    primaryMuscles: ['glutes', 'quadriceps'],
    secondaryMuscles: ['hamstrings', 'abs'],
    exerciseType: 'compound' },

  { name: 'Superman',
    primaryMuscles: ['back', 'glutes'],
    secondaryMuscles: ['hamstrings', 'shoulders'],
    exerciseType: 'compound' },

  { name: 'Thruster',
    primaryMuscles: ['shoulders', 'quadriceps'],
    secondaryMuscles: ['traps', 'glutes', 'triceps'],
    exerciseType: 'compound' },

  { name: 'Ring Dips',
    primaryMuscles: ['triceps', 'chest'],
    secondaryMuscles: ['shoulders'],
    exerciseType: 'compound' },

  { name: 'Renegade Row',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps', 'abs', 'chest'],
    exerciseType: 'compound' },

  { name: 'Preacher Curls',
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearms'],
    exerciseType: 'isolation' },

  { name: 'Single Leg Extension',
    primaryMuscles: ['quadriceps'],
    secondaryMuscles: [],
    exerciseType: 'isolation' },

  { name: 'Standing Calf Raises',
    primaryMuscles: ['calves'],
    secondaryMuscles: [],
    exerciseType: 'isolation' },

  { name: 'Sitting Calf Raises',
    primaryMuscles: ['calves'],
    secondaryMuscles: [],
    exerciseType: 'isolation' },
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
