/**
 * DailyStats entity — aggregated daily workout statistics.
 * Maps to the `daily_stats` table in SQLite.
 */
export interface DailyStats {
  date: string; // 'YYYY-MM-DD' format
  totalVolume: number;
  totalSets: number;
  totalReps: number;
  workoutCount: number;
  totalDuration: number; // in seconds
}
