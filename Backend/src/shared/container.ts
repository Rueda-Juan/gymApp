import type * as SQLite from 'expo-sqlite';

// --- Infrastructure ---
import { SQLiteExerciseRepository } from '../infrastructure/repositories/SQLiteExerciseRepository';
import { SQLiteRoutineRepository } from '../infrastructure/repositories/SQLiteRoutineRepository';
import { SQLiteWorkoutRepository } from '../infrastructure/repositories/SQLiteWorkoutRepository';
import { SQLiteStatsRepository } from '../infrastructure/repositories/SQLiteStatsRepository';
import { SQLiteUserPreferencesRepository } from '../infrastructure/repositories/SQLiteUserPreferencesRepository';
import { SQLiteBodyWeightRepository } from '../infrastructure/repositories/SQLiteBodyWeightRepository';
import { SQLiteBackupRepository } from '../infrastructure/repositories/SQLiteBackupRepository';
import { ConsoleLogger } from '../infrastructure/services/ConsoleLogger';

// --- Use Cases: Exercises ---
import { CreateExerciseUseCase } from '../application/useCases/CreateExerciseUseCase';
import { UpdateExerciseUseCase } from '../application/useCases/UpdateExerciseUseCase';
import { DeleteExerciseUseCase } from '../application/useCases/DeleteExerciseUseCase';
import { GetExerciseHistoryUseCase } from '../application/useCases/GetExerciseHistoryUseCase';

// --- Use Cases: Routines ---
import { CreateRoutineUseCase } from '../application/useCases/CreateRoutineUseCase';
import { UpdateRoutineUseCase } from '../application/useCases/UpdateRoutineUseCase';
import { DeleteRoutineUseCase } from '../application/useCases/DeleteRoutineUseCase';
import { DuplicateRoutineUseCase } from '../application/useCases/DuplicateRoutineUseCase';

// --- Use Cases: Workouts ---
import { StartWorkoutUseCase } from '../application/useCases/StartWorkout';
import { FinishWorkoutUseCase } from '../application/useCases/FinishWorkout';
import { DeleteWorkoutUseCase } from '../application/useCases/DeleteWorkoutUseCase';
import { RecordSetUseCase } from '../application/useCases/RecordSet';
import { UpdateSetUseCase } from '../application/useCases/UpdateSetUseCase';
import { DeleteSetUseCase } from '../application/useCases/DeleteSetUseCase';
import { SkipExerciseUseCase } from '../application/useCases/SkipExercise';
import { AddExerciseToWorkoutUseCase } from '../application/useCases/AddExerciseToWorkoutUseCase';
import { ReorderWorkoutExercisesUseCase } from '../application/useCases/ReorderWorkoutExercisesUseCase';
import { SuggestWeightUseCase } from '../application/useCases/SuggestWeight';

// --- Use Cases: Stats ---
import { GetWeeklyStatsUseCase } from '../application/useCases/GetWeeklyStatsUseCase';
import { GetMuscleBalanceUseCase } from '../application/useCases/GetMuscleBalanceUseCase';
import { GetTrainingFrequencyUseCase } from '../application/useCases/GetTrainingFrequencyUseCase';

// --- Use Cases: Others ---
import { GetPreferencesUseCase } from '../application/useCases/GetPreferencesUseCase';
import { UpdatePreferenceUseCase } from '../application/useCases/UpdatePreferenceUseCase';
import { LogBodyWeightUseCase } from '../application/useCases/LogBodyWeightUseCase';
import { GetBodyWeightHistoryUseCase } from '../application/useCases/GetBodyWeightHistoryUseCase';
import { CreateBackupUseCase } from '../application/useCases/CreateBackupUseCase';
import { RestoreBackupUseCase } from '../application/useCases/RestoreBackupUseCase';
import { ExportCSVUseCase } from '../application/useCases/ExportCSVUseCase';

// --- Service Facades ---
import { ExerciseService } from '../interface/services/ExerciseService';
import { RoutineService } from '../interface/services/RoutineService';
import { WorkoutService } from '../interface/services/WorkoutService';
import { StatsService } from '../interface/services/StatsService';
import { BackupService } from '../interface/services/BackupService';
import { PreferencesService } from '../interface/services/PreferencesService';
import { BodyWeightService } from '../interface/services/BodyWeightService';

export interface AppContainer {
  readonly exerciseService: ExerciseService;
  readonly routineService: RoutineService;
  readonly workoutService: WorkoutService;
  readonly statsService: StatsService;
  readonly backupService: BackupService;
  readonly preferencesService: PreferencesService;
  readonly bodyWeightService: BodyWeightService;
}

export function createContainer(db: SQLite.SQLiteDatabase): AppContainer {
  // 1. Repositories
  const logger = new ConsoleLogger();
  const exerciseRepo = new SQLiteExerciseRepository(db);
  const routineRepo = new SQLiteRoutineRepository(db);
  const workoutRepo = new SQLiteWorkoutRepository(db);
  const statsRepo = new SQLiteStatsRepository(db);
  const preferencesRepo = new SQLiteUserPreferencesRepository(db);
  const bodyWeightRepo = new SQLiteBodyWeightRepository(db);
  const backupRepo = new SQLiteBackupRepository(db);

  // 2. Use Cases
  const exerciseService = new ExerciseService(
    new CreateExerciseUseCase(exerciseRepo),
    new UpdateExerciseUseCase(exerciseRepo),
    new DeleteExerciseUseCase(exerciseRepo),
    new GetExerciseHistoryUseCase(workoutRepo)
  );

  const routineService = new RoutineService(
    new CreateRoutineUseCase(routineRepo),
    new UpdateRoutineUseCase(routineRepo),
    new DeleteRoutineUseCase(routineRepo),
    new DuplicateRoutineUseCase(routineRepo)
  );

  const workoutService = new WorkoutService(
    new StartWorkoutUseCase(workoutRepo, routineRepo),
    new FinishWorkoutUseCase(workoutRepo),
    new DeleteWorkoutUseCase(workoutRepo, statsRepo),
    new RecordSetUseCase(workoutRepo, statsRepo, db),
    new UpdateSetUseCase(workoutRepo, statsRepo),
    new DeleteSetUseCase(workoutRepo, statsRepo),
    new SkipExerciseUseCase(workoutRepo),
    new AddExerciseToWorkoutUseCase(workoutRepo),
    new ReorderWorkoutExercisesUseCase(workoutRepo),
    new SuggestWeightUseCase(workoutRepo, statsRepo, exerciseRepo)
  );

  const statsService = new StatsService(
    new GetWeeklyStatsUseCase(statsRepo),
    new GetMuscleBalanceUseCase(statsRepo),
    new GetTrainingFrequencyUseCase(statsRepo)
  );

  const backupService = new BackupService(
    new CreateBackupUseCase(backupRepo),
    new RestoreBackupUseCase(backupRepo),
    new ExportCSVUseCase(backupRepo)
  );

  const preferencesService = new PreferencesService(
    new GetPreferencesUseCase(preferencesRepo),
    new UpdatePreferenceUseCase(preferencesRepo)
  );

  const bodyWeightService = new BodyWeightService(
    new LogBodyWeightUseCase(bodyWeightRepo),
    new GetBodyWeightHistoryUseCase(bodyWeightRepo)
  );

  return {
    exerciseService,
    routineService,
    workoutService,
    statsService,
    backupService,
    preferencesService,
    bodyWeightService,
  };
}
