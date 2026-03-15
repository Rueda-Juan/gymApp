/**
 * ExerciseStats entity — precomputed aggregate stats per exercise.
 * Maps to the `exercise_stats` table in SQLite.
 */
export interface ExerciseStats {
  exerciseId: string;
  maxWeight: number;
  maxVolume: number;
  estimated1RM: number;
  totalSets: number;
  totalReps: number;
  totalVolume: number;
  lastPerformed: Date | null;
  updatedAt: Date;
}
