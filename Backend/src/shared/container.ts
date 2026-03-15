import type * as SQLite from 'expo-sqlite';
import { SQLiteExerciseRepository } from '../infrastructure/repositories/SQLiteExerciseRepository';
import { SQLiteRoutineRepository } from '../infrastructure/repositories/SQLiteRoutineRepository';
import { SQLiteWorkoutRepository } from '../infrastructure/repositories/SQLiteWorkoutRepository';
import { SQLiteStatsRepository } from '../infrastructure/repositories/SQLiteStatsRepository';
import { StartWorkoutUseCase } from '../application/useCases/StartWorkout';
import { RecordSetUseCase } from '../application/useCases/RecordSet';
import { FinishWorkoutUseCase } from '../application/useCases/FinishWorkout';
import { SkipExerciseUseCase } from '../application/useCases/SkipExercise';
import { SuggestWeightUseCase } from '../application/useCases/SuggestWeight';

import type { ExerciseRepository } from '../domain/repositories/ExerciseRepository';
import type { RoutineRepository } from '../domain/repositories/RoutineRepository';
import type { WorkoutRepository } from '../domain/repositories/WorkoutRepository';
import type { StatsRepository } from '../domain/repositories/StatsRepository';

/**
 * Application services container.
 * Single point of instantiation for all dependencies.
 */
export interface AppContainer {
  // Repositories
  readonly exerciseRepo: ExerciseRepository;
  readonly routineRepo: RoutineRepository;
  readonly workoutRepo: WorkoutRepository;
  readonly statsRepo: StatsRepository;

  // Use Cases
  readonly startWorkout: StartWorkoutUseCase;
  readonly recordSet: RecordSetUseCase;
  readonly finishWorkout: FinishWorkoutUseCase;
  readonly skipExercise: SkipExerciseUseCase;
  readonly suggestWeight: SuggestWeightUseCase;
}

/**
 * Creates the full dependency graph for the application.
 * Call once at app startup after initializing the database.
 *
 * @param db - Initialized SQLite database connection.
 * @returns AppContainer with all repositories and use cases wired up.
 */
export function createContainer(db: SQLite.SQLiteDatabase): AppContainer {
  // Infrastructure layer
  const exerciseRepo = new SQLiteExerciseRepository(db);
  const routineRepo = new SQLiteRoutineRepository(db);
  const workoutRepo = new SQLiteWorkoutRepository(db);
  const statsRepo = new SQLiteStatsRepository(db);

  // Application layer — use cases
  const startWorkout = new StartWorkoutUseCase(workoutRepo, routineRepo);
  const recordSet = new RecordSetUseCase(workoutRepo, statsRepo, db);
  const finishWorkout = new FinishWorkoutUseCase(workoutRepo);
  const skipExercise = new SkipExerciseUseCase(workoutRepo);
  const suggestWeight = new SuggestWeightUseCase(workoutRepo, statsRepo, exerciseRepo);

  return {
    exerciseRepo,
    routineRepo,
    workoutRepo,
    statsRepo,
    startWorkout,
    recordSet,
    finishWorkout,
    skipExercise,
    suggestWeight,
  };
}
