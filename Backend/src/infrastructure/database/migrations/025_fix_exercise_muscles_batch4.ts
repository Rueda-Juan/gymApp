import type * as SQLite from 'expo-sqlite';

/**
 * Migration 025 — Fix muscles for another 40 exercises (batch 4).
 *
 * Covers Spanish-named exercises, curl variations, crunch
 * variations, pulldown variants, and remaining compound lifts.
 */
export const version = 25;
export const name = '025_fix_exercise_muscles_batch4';

const EXERCISE_FIXES: Array<{
  name: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  exerciseType: 'compound' | 'isolation';
}> = [
  // ── Exercises with wrong primary muscle ──

  { name: 'Prensa de piernas',
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves'],
    exerciseType: 'compound' },

  { name: 'Cross-Bench Dumbbell Pullovers',
    primaryMuscles: ['chest', 'back'],
    secondaryMuscles: ['triceps', 'shoulders'],
    exerciseType: 'compound' },

  // ── Biceps / Curl variations needing exercise_type + secondaries ──

  { name: 'Biceps Curls With Barbell',
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearms'],
    exerciseType: 'isolation' },

  { name: 'Curl de bíceps con mancuerna',
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearms'],
    exerciseType: 'isolation' },

  { name: 'Curl de biceps con barra Z',
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearms'],
    exerciseType: 'isolation' },

  { name: 'Biceps Curl With Cable',
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearms'],
    exerciseType: 'isolation' },

  { name: 'Dumbbell Concentration Curl',
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearms'],
    exerciseType: 'isolation' },

  { name: 'Dumbbell Incline Curl',
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearms'],
    exerciseType: 'isolation' },

  { name: 'Dumbbells on Scott Machine',
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearms'],
    exerciseType: 'isolation' },

  { name: 'Hammercurls on Cable',
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearms'],
    exerciseType: 'isolation' },

  { name: 'Standing Bicep Curl',
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearms'],
    exerciseType: 'isolation' },

  { name: 'Reverse Bar Curl',
    primaryMuscles: ['forearms', 'biceps'],
    secondaryMuscles: [],
    exerciseType: 'isolation' },

  { name: 'Reverse Curl',
    primaryMuscles: ['forearms', 'biceps'],
    secondaryMuscles: [],
    exerciseType: 'isolation' },

  { name: 'Overhand Cable Curl',
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearms'],
    exerciseType: 'isolation' },

  // ── Crunch / Ab variations ──

  { name: 'Abdominales',
    primaryMuscles: ['abs'],
    secondaryMuscles: [],
    exerciseType: 'isolation' },

  { name: 'Abdominal Stabilization',
    primaryMuscles: ['abs'],
    secondaryMuscles: [],
    exerciseType: 'isolation' },

  { name: 'Crunches on incline bench',
    primaryMuscles: ['abs'],
    secondaryMuscles: [],
    exerciseType: 'isolation' },

  { name: 'Crunches on Machine',
    primaryMuscles: ['abs'],
    secondaryMuscles: [],
    exerciseType: 'isolation' },

  { name: 'Crunches With Cable',
    primaryMuscles: ['abs'],
    secondaryMuscles: [],
    exerciseType: 'isolation' },

  { name: 'Crunches With Legs Up',
    primaryMuscles: ['abs'],
    secondaryMuscles: [],
    exerciseType: 'isolation' },

  { name: 'Negative Crunches',
    primaryMuscles: ['abs'],
    secondaryMuscles: [],
    exerciseType: 'isolation' },

  { name: 'Levantamiento de piernas',
    primaryMuscles: ['abs'],
    secondaryMuscles: [],
    exerciseType: 'isolation' },

  { name: 'Scissors',
    primaryMuscles: ['abs'],
    secondaryMuscles: ['hamstrings'],
    exerciseType: 'isolation' },

  { name: 'Splinter Sit-ups',
    primaryMuscles: ['abs'],
    secondaryMuscles: [],
    exerciseType: 'compound' },

  // ── Pulldown / Back variations ──

  { name: 'Dominadas Supinas',
    primaryMuscles: ['back', 'biceps'],
    secondaryMuscles: ['forearms'],
    exerciseType: 'compound' },

  { name: 'Close-grip Lat Pull Down',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps', 'forearms'],
    exerciseType: 'compound' },

  { name: 'Lat Pull Down (Leaning Back)',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps', 'forearms'],
    exerciseType: 'compound' },

  { name: 'Lat Pull Down (Straight Back)',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps', 'forearms'],
    exerciseType: 'compound' },

  { name: 'Underhand Lat Pull Down',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps', 'forearms'],
    exerciseType: 'compound' },

  { name: 'Wide-grip Pulldown',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps', 'forearms'],
    exerciseType: 'compound' },

  // ── Legs / Glutes ──

  { name: 'Seated Hip Adduction',
    primaryMuscles: ['glutes'],
    secondaryMuscles: [],
    exerciseType: 'isolation' },

  { name: 'Curl femoral',
    primaryMuscles: ['hamstrings'],
    secondaryMuscles: [],
    exerciseType: 'isolation' },

  { name: 'Curl cuadriceps',
    primaryMuscles: ['quadriceps'],
    secondaryMuscles: [],
    exerciseType: 'isolation' },

  { name: 'Prensa de piernas cerrada',
    primaryMuscles: ['quadriceps'],
    secondaryMuscles: ['glutes'],
    exerciseType: 'compound' },

  { name: 'Press de piernas abierto',
    primaryMuscles: ['quadriceps'],
    secondaryMuscles: ['glutes', 'hamstrings'],
    exerciseType: 'compound' },

  { name: 'Hindu Squats',
    primaryMuscles: ['quadriceps'],
    secondaryMuscles: ['glutes', 'calves'],
    exerciseType: 'compound' },

  { name: 'Squats on Multipress',
    primaryMuscles: ['quadriceps'],
    secondaryMuscles: ['glutes', 'hamstrings'],
    exerciseType: 'compound' },

  { name: 'Kettlebell Swings',
    primaryMuscles: ['glutes', 'hamstrings'],
    secondaryMuscles: ['back', 'shoulders', 'abs'],
    exerciseType: 'compound' },

  // ── Shoulders / Other ──

  { name: 'Front Raises with Plates',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: [],
    exerciseType: 'isolation' },

  { name: 'Elevaciones frontales',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: [],
    exerciseType: 'isolation' },

  { name: 'Bear Walk',
    primaryMuscles: ['shoulders', 'chest'],
    secondaryMuscles: ['glutes', 'back', 'abs', 'quadriceps', 'traps'],
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
