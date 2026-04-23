import { ValidationError } from '../../core/errors/errors';
import type { WorkoutSet } from '../workouts/workout-set.entity';
import type { StatsRepository } from './stats.repository';
import type { PersonalRecord, RecordType } from './personal-record.entity';
import type { DailyStats } from './daily-stats.entity';
import { detectBrokenRecords } from './utils/stats-calculator';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TrainingFrequencyResult {
  totalWorkouts: number;
  workoutsPerDay: Record<string, number>;
}

export interface MuscleVolumeDistribution {
  muscle: string;
  volume: number;
  sets: number;
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export class StatsService {
  constructor(private readonly statsRepo: StatsRepository) {}

  // ── Daily stats ───────────────────────────────────────────────────────────

  async getWeeklyStats(startDate: string, endDate: string): Promise<DailyStats[]> {
    this.validateDateRange(startDate, endDate);
    return this.statsRepo.getWeeklyStats(startDate, endDate);
  }

  async getTrainingFrequency(startDate: string, endDate: string): Promise<TrainingFrequencyResult> {
    this.validateDateRange(startDate, endDate);
    const dailyStats = await this.statsRepo.getWeeklyStats(startDate, endDate);
    const workoutsPerDay = dailyStats.reduce((acc, stat) => {
      acc[stat.date] = stat.workoutCount;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalWorkouts: dailyStats.reduce((sum, stat) => sum + stat.workoutCount, 0),
      workoutsPerDay,
    };
  }

  async getMuscleBalance(startDate: string, endDate: string): Promise<MuscleVolumeDistribution[]> {
    this.validateDateRange(startDate, endDate);
    return this.statsRepo.getMuscleVolumeDistribution(startDate, endDate);
  }

  // ── Personal records ──────────────────────────────────────────────────────

  /** Retrieves all personal records for a given exercise. */
  async getPersonalRecords(exerciseId: string): Promise<PersonalRecord[]> {
    return this.statsRepo.getPersonalRecords(exerciseId);
  }

  /** Retrieves the best record for a specific type and exercise. */
  async getBestPersonalRecord(
    exerciseId: string,
    recordType: RecordType,
  ): Promise<PersonalRecord | null> {
    return this.statsRepo.getLatestRecord(exerciseId, recordType);
  }

  /** Counts all personal records logged on or after a given date. */
  async getPRCountSince(since: string): Promise<number> {
    return this.statsRepo.countRecordsSince(since);
  }

  /** Evaluates a set against current stats and returns any broken records. */
  async evaluateSetPR(
    exerciseId: string,
    set: WorkoutSet,
  ): Promise<
    Array<{ recordType: 'max_weight' | 'max_reps' | 'max_volume' | 'estimated_1rm'; value: number }>
  > {
    const currentStats = await this.statsRepo.getExerciseStats(exerciseId);
    return detectBrokenRecords(currentStats, set);
  }

  private validateDateRange(start: string, end: string): void {
    if (new Date(start) > new Date(end)) {
      throw new ValidationError('La fecha de inicio no puede ser posterior a la fecha de fin', {});
    }
  }
}