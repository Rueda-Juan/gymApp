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
import { CreateExerciseUseCase } from '../application/useCases/exercises/CreateExerciseUseCase';
import { UpdateExerciseUseCase } from '../application/useCases/exercises/UpdateExerciseUseCase';
import { DeleteExerciseUseCase } from '../application/useCases/exercises/DeleteExerciseUseCase';
import { GetExerciseHistoryUseCase } from '../application/useCases/exercises/GetExerciseHistoryUseCase';
import { GetExercisesUseCase } from '../application/useCases/exercises/GetExercisesUseCase';
import { GetExerciseByIdUseCase } from '../application/useCases/exercises/GetExerciseByIdUseCase';

// --- Use Cases: Routines ---
import { CreateRoutineUseCase } from '../application/useCases/routines/CreateRoutineUseCase';
import { UpdateRoutineUseCase } from '../application/useCases/routines/UpdateRoutineUseCase';
import { DeleteRoutineUseCase } from '../application/useCases/routines/DeleteRoutineUseCase';
import { DuplicateRoutineUseCase } from '../application/useCases/routines/DuplicateRoutineUseCase';
import { GetRoutinesUseCase } from '../application/useCases/routines/GetRoutinesUseCase';
import { GetRoutineByIdUseCase } from '../application/useCases/routines/GetRoutineByIdUseCase';
import { GetRoutineExercisesUseCase } from '../application/useCases/routines/GetRoutineExercisesUseCase';

// --- Use Cases: Workouts ---
import { StartWorkoutUseCase } from '../application/useCases/workouts/StartWorkout';
import { FinishWorkoutUseCase } from '../application/useCases/workouts/FinishWorkout';
import { DeleteWorkoutUseCase } from '../application/useCases/workouts/DeleteWorkoutUseCase';
import { RecordSetUseCase } from '../application/useCases/workouts/RecordSet';
import { RecordAllSetsUseCase } from '../application/useCases/workouts/RecordAllSetsUseCase';
import { UpdateSetUseCase } from '../application/useCases/workouts/UpdateSetUseCase';
import { DeleteSetUseCase } from '../application/useCases/workouts/DeleteSetUseCase';
import { SkipExerciseUseCase } from '../application/useCases/workouts/SkipExercise';
import { AddExerciseToWorkoutUseCase } from '../application/useCases/workouts/AddExerciseToWorkoutUseCase';
import { ReorderWorkoutExercisesUseCase } from '../application/useCases/workouts/ReorderWorkoutExercisesUseCase';
import { DeleteWorkoutExerciseUseCase } from '../application/useCases/workouts/DeleteWorkoutExerciseUseCase';
import { UpdateWorkoutExerciseUseCase } from '../application/useCases/workouts/UpdateWorkoutExerciseUseCase';
import { SuggestWeightUseCase } from '../application/useCases/exercises/SuggestWeight';
import { GetWorkoutHistoryUseCase } from '../application/useCases/workouts/GetWorkoutHistoryUseCase';
import { GetWorkoutByIdUseCase } from '../application/useCases/workouts/GetWorkoutByIdUseCase';
import { GetPreviousSetsUseCase } from '../application/useCases/exercises/GetPreviousSetsUseCase';

// --- Use Cases: Stats ---
import { GetWeeklyStatsUseCase } from '../application/useCases/stats/GetWeeklyStatsUseCase';
import { GetMuscleBalanceUseCase } from '../application/useCases/stats/GetMuscleBalanceUseCase';
import { GetTrainingFrequencyUseCase } from '../application/useCases/stats/GetTrainingFrequencyUseCase';

// --- Use Cases: Others ---
import { GetPreferencesUseCase } from '../application/useCases/settings/GetPreferencesUseCase';
import { UpdatePreferenceUseCase } from '../application/useCases/settings/UpdatePreferenceUseCase';
import { LogBodyWeightUseCase } from '../application/useCases/stats/LogBodyWeightUseCase';
import { GetBodyWeightHistoryUseCase } from '../application/useCases/stats/GetBodyWeightHistoryUseCase';
import { UpdateBodyWeightUseCase } from '../application/useCases/stats/UpdateBodyWeightUseCase';
import { DeleteBodyWeightUseCase } from '../application/useCases/stats/DeleteBodyWeightUseCase';
import { CreateBackupUseCase } from '../application/useCases/backup/CreateBackupUseCase';
import { RestoreBackupUseCase } from '../application/useCases/backup/RestoreBackupUseCase';
import { ExportCSVUseCase } from '../application/useCases/backup/ExportCSVUseCase';

// --- Service Facades ---
import { ExerciseService } from '../interface/services/ExerciseService';
import { RoutineService } from '../interface/services/RoutineService';
import { WorkoutService } from '../interface/services/WorkoutService';
import { StatsService } from '../interface/services/StatsService';
import { BackupService } from '../interface/services/BackupService';
import { PreferencesService } from '../interface/services/PreferencesService';
import { BodyWeightService } from '../interface/services/BodyWeightService';
import { PersonalRecordService } from '../interface/services/PersonalRecordService';

// --- Records Use Cases ---
import { GetPersonalRecordsUseCase, GetBestPersonalRecordUseCase, GetPRCountSinceUseCase } from '../application/useCases/stats/GetPersonalRecords';

export interface AppContainer {
  readonly exerciseService: ExerciseService;
  readonly routineService: RoutineService;
  readonly workoutService: WorkoutService;
  readonly statsService: StatsService;
  readonly backupService: BackupService;
  readonly preferencesService: PreferencesService;
  readonly bodyWeightService: BodyWeightService;
  readonly personalRecordService: PersonalRecordService;
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
    new GetExerciseHistoryUseCase(workoutRepo),
    new GetExercisesUseCase(exerciseRepo),
    new GetExerciseByIdUseCase(exerciseRepo)
  );

  const routineService = new RoutineService(
    new CreateRoutineUseCase(routineRepo),
    new UpdateRoutineUseCase(routineRepo),
    new DeleteRoutineUseCase(routineRepo),
    new DuplicateRoutineUseCase(routineRepo),
    new GetRoutinesUseCase(routineRepo),
    new GetRoutineByIdUseCase(routineRepo),
    new GetRoutineExercisesUseCase(routineRepo)
  );

  const workoutService = new WorkoutService(
    new StartWorkoutUseCase(workoutRepo, routineRepo),
    new FinishWorkoutUseCase(workoutRepo),
    new DeleteWorkoutUseCase(workoutRepo, statsRepo, db),
    new RecordSetUseCase(workoutRepo, statsRepo, db),
    new RecordAllSetsUseCase(workoutRepo, statsRepo, db),
    new UpdateSetUseCase(workoutRepo, statsRepo),
    new DeleteSetUseCase(workoutRepo, statsRepo),
    new SkipExerciseUseCase(workoutRepo),
    new AddExerciseToWorkoutUseCase(workoutRepo),
    new ReorderWorkoutExercisesUseCase(workoutRepo),
    new DeleteWorkoutExerciseUseCase(workoutRepo, statsRepo),
    new UpdateWorkoutExerciseUseCase(workoutRepo),
    new SuggestWeightUseCase(workoutRepo, statsRepo, exerciseRepo),
    new GetWorkoutHistoryUseCase(workoutRepo),
    new GetWorkoutByIdUseCase(workoutRepo),
    new GetPreviousSetsUseCase(workoutRepo),
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
    new GetBodyWeightHistoryUseCase(bodyWeightRepo),
    new UpdateBodyWeightUseCase(bodyWeightRepo),
    new DeleteBodyWeightUseCase(bodyWeightRepo)
  );

  const personalRecordService = new PersonalRecordService(
    new GetPersonalRecordsUseCase(statsRepo),
    new GetBestPersonalRecordUseCase(statsRepo),
    new GetPRCountSinceUseCase(statsRepo),
  );

  return {
    exerciseService,
    routineService,
    workoutService,
    statsService,
    backupService,
    preferencesService,
    bodyWeightService,
    personalRecordService,
  };
}
