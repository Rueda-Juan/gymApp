import type * as SQLite from 'expo-sqlite';
import type { WorkoutRepository } from '../../../domain/repositories/WorkoutRepository';
import type { StatsRepository } from '../../../domain/repositories/StatsRepository';
import { NotFoundError } from '../../../shared/errors';
import { toSQLiteDate } from '../../../shared/utils/dateUtils';

export class DeleteWorkoutUseCase {
  constructor(
    private readonly workoutRepo: WorkoutRepository,
    private readonly statsRepo: StatsRepository,
    private readonly db: SQLite.SQLiteDatabase,
  ) {}

  async execute(id: string): Promise<void> {
    const workout = await this.workoutRepo.getById(id);
    if (!workout) {
      throw new NotFoundError(`Workout con ID ${id} no encontrado`);
    }

    await this.db.withTransactionAsync(async () => {
      await this.workoutRepo.delete(id);

      const uniqueExerciseIds = new Set(workout.exercises.map(e => e.exerciseId));
      for (const exerciseId of uniqueExerciseIds) {
        await this.statsRepo.recalculateExerciseStats(exerciseId);
      }

      const dateStr = toSQLiteDate(workout.date);
      await this.statsRepo.recalculateDailyStats(dateStr);
    });
  }
}
