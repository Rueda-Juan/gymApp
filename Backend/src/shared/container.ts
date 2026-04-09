import type * as SQLite from 'expo-sqlite';

// --- Infrastructure ---
import { SQLiteExerciseRepository } from '../infrastructure/repositories/SQLiteExerciseRepository';
import { SQLiteRoutineRepository } from '../infrastructure/repositories/SQLiteRoutineRepository';
import { SQLiteWorkoutRepository } from '../infrastructure/repositories/SQLiteWorkoutRepository';
import { SQLiteStatsRepository } from '../infrastructure/repositories/SQLiteStatsRepository';
import { SQLiteUserPreferencesRepository } from '../infrastructure/repositories/SQLiteUserPreferencesRepository';
import { SQLiteBodyWeightRepository } from '../infrastructure/repositories/SQLiteBodyWeightRepository';
import { SQLiteBackupRepository } from '../infrastructure/repositories/SQLiteBackupRepository';
import { SQLiteExerciseLoadCacheRepository } from '../infrastructure/repositories/SQLiteExerciseLoadCacheRepository';
import { ConsoleLogger } from '../infrastructure/services/ConsoleLogger';
import { PlateRounder } from '../domain/services/PlateRounder';

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
import { SuggestWarmupUseCase } from '../application/useCases/exercises/SuggestWarmup';
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
import { WipeDatabaseUseCase } from '../application/useCases/backup/WipeDatabaseUseCase';

// --- Records Use Cases ---
import { GetPersonalRecordsUseCase, GetBestPersonalRecordUseCase, GetPRCountSinceUseCase } from '../application/useCases/stats/GetPersonalRecords';

export interface AppContainer {
  // Exercises
  readonly createExercise: CreateExerciseUseCase;
  readonly updateExercise: UpdateExerciseUseCase;
  readonly deleteExercise: DeleteExerciseUseCase;
  readonly getExerciseHistory: GetExerciseHistoryUseCase;
  readonly getExercises: GetExercisesUseCase;
  readonly getExerciseById: GetExerciseByIdUseCase;

  // Routines
  readonly createRoutine: CreateRoutineUseCase;
  readonly updateRoutine: UpdateRoutineUseCase;
  readonly deleteRoutine: DeleteRoutineUseCase;
  readonly duplicateRoutine: DuplicateRoutineUseCase;
  readonly getRoutines: GetRoutinesUseCase;
  readonly getRoutineById: GetRoutineByIdUseCase;
  readonly getRoutineExercises: GetRoutineExercisesUseCase;

  // Workouts
  readonly startWorkout: StartWorkoutUseCase;
  readonly finishWorkout: FinishWorkoutUseCase;
  readonly deleteWorkout: DeleteWorkoutUseCase;
  readonly recordSet: RecordSetUseCase;
  readonly recordAllSets: RecordAllSetsUseCase;
  readonly updateSet: UpdateSetUseCase;
  readonly deleteSet: DeleteSetUseCase;
  readonly skipExercise: SkipExerciseUseCase;
  readonly addExerciseToWorkout: AddExerciseToWorkoutUseCase;
  readonly reorderWorkoutExercises: ReorderWorkoutExercisesUseCase;
  readonly deleteWorkoutExercise: DeleteWorkoutExerciseUseCase;
  readonly updateWorkoutExercise: UpdateWorkoutExerciseUseCase;
  readonly suggestWeight: SuggestWeightUseCase;
  readonly suggestWarmup: SuggestWarmupUseCase;
  readonly getWorkoutHistory: GetWorkoutHistoryUseCase;
  readonly getWorkoutById: GetWorkoutByIdUseCase;
  readonly getPreviousSets: GetPreviousSetsUseCase;

  // Stats
  readonly getWeeklyStats: GetWeeklyStatsUseCase;
  readonly getMuscleBalance: GetMuscleBalanceUseCase;
  readonly getTrainingFrequency: GetTrainingFrequencyUseCase;

  // Preferences
  readonly getPreferences: GetPreferencesUseCase;
  readonly updatePreference: UpdatePreferenceUseCase;

  // BodyWeight
  readonly logBodyWeight: LogBodyWeightUseCase;
  readonly getBodyWeightHistory: GetBodyWeightHistoryUseCase;
  readonly updateBodyWeight: UpdateBodyWeightUseCase;
  readonly deleteBodyWeight: DeleteBodyWeightUseCase;

  // Backup
  readonly createBackup: CreateBackupUseCase;
  readonly restoreBackup: RestoreBackupUseCase;
  readonly exportCSV: ExportCSVUseCase;
  readonly wipeDatabase: WipeDatabaseUseCase;

  // Personal Records
  readonly getPersonalRecords: GetPersonalRecordsUseCase;
  readonly getBestPersonalRecord: GetBestPersonalRecordUseCase;
  readonly getPRCountSince: GetPRCountSinceUseCase;
}

export function createContainer(db: SQLite.SQLiteDatabase): AppContainer {
  // 1. Repositories
  const exerciseRepo = new SQLiteExerciseRepository(db);
  const routineRepo = new SQLiteRoutineRepository(db);
  const workoutRepo = new SQLiteWorkoutRepository(db);
  const statsRepo = new SQLiteStatsRepository(db);
  const preferencesRepo = new SQLiteUserPreferencesRepository(db);
  const bodyWeightRepo = new SQLiteBodyWeightRepository(db);
  const backupRepo = new SQLiteBackupRepository(db);
  const loadCacheRepo = new SQLiteExerciseLoadCacheRepository(db);

  // 2. Domain services
  const plateRounder = new PlateRounder();

  // 2. Use Cases Base (that have internal dependencies to other Use Cases)
  const suggestWeightUseCaseInstance = new SuggestWeightUseCase(workoutRepo, statsRepo, exerciseRepo, loadCacheRepo, plateRounder);

  // 3. Return Instances
  return {
    // Exercises
    createExercise: new CreateExerciseUseCase(exerciseRepo),
    updateExercise: new UpdateExerciseUseCase(exerciseRepo),
    deleteExercise: new DeleteExerciseUseCase(exerciseRepo),
    getExerciseHistory: new GetExerciseHistoryUseCase(workoutRepo),
    getExercises: new GetExercisesUseCase(exerciseRepo),
    getExerciseById: new GetExerciseByIdUseCase(exerciseRepo),

    // Routines
    createRoutine: new CreateRoutineUseCase(routineRepo),
    updateRoutine: new UpdateRoutineUseCase(routineRepo),
    deleteRoutine: new DeleteRoutineUseCase(routineRepo),
    duplicateRoutine: new DuplicateRoutineUseCase(routineRepo),
    getRoutines: new GetRoutinesUseCase(routineRepo),
    getRoutineById: new GetRoutineByIdUseCase(routineRepo),
    getRoutineExercises: new GetRoutineExercisesUseCase(routineRepo),

    // Workouts
    startWorkout: new StartWorkoutUseCase(workoutRepo, routineRepo),
    finishWorkout: new FinishWorkoutUseCase(workoutRepo, loadCacheRepo),
    deleteWorkout: new DeleteWorkoutUseCase(workoutRepo, statsRepo, db),
    recordSet: new RecordSetUseCase(workoutRepo, statsRepo, db, loadCacheRepo),
    recordAllSets: new RecordAllSetsUseCase(workoutRepo, statsRepo, db),
    updateSet: new UpdateSetUseCase(workoutRepo, statsRepo, loadCacheRepo),
    deleteSet: new DeleteSetUseCase(workoutRepo, statsRepo, loadCacheRepo),
    skipExercise: new SkipExerciseUseCase(workoutRepo),
    addExerciseToWorkout: new AddExerciseToWorkoutUseCase(workoutRepo),
    reorderWorkoutExercises: new ReorderWorkoutExercisesUseCase(workoutRepo),
    deleteWorkoutExercise: new DeleteWorkoutExerciseUseCase(workoutRepo, statsRepo),
    updateWorkoutExercise: new UpdateWorkoutExerciseUseCase(workoutRepo),
    suggestWeight: suggestWeightUseCaseInstance,
    suggestWarmup: new SuggestWarmupUseCase(exerciseRepo, suggestWeightUseCaseInstance),
    getWorkoutHistory: new GetWorkoutHistoryUseCase(workoutRepo),
    getWorkoutById: new GetWorkoutByIdUseCase(workoutRepo),
    getPreviousSets: new GetPreviousSetsUseCase(workoutRepo),

    // Stats
    getWeeklyStats: new GetWeeklyStatsUseCase(statsRepo),
    getMuscleBalance: new GetMuscleBalanceUseCase(statsRepo),
    getTrainingFrequency: new GetTrainingFrequencyUseCase(statsRepo),

    // Preferences
    getPreferences: new GetPreferencesUseCase(preferencesRepo),
    updatePreference: new UpdatePreferenceUseCase(preferencesRepo),

    // BodyWeight
    logBodyWeight: new LogBodyWeightUseCase(bodyWeightRepo),
    getBodyWeightHistory: new GetBodyWeightHistoryUseCase(bodyWeightRepo),
    updateBodyWeight: new UpdateBodyWeightUseCase(bodyWeightRepo),
    deleteBodyWeight: new DeleteBodyWeightUseCase(bodyWeightRepo),

    // Backup
    createBackup: new CreateBackupUseCase(backupRepo),
    restoreBackup: new RestoreBackupUseCase(backupRepo),
    exportCSV: new ExportCSVUseCase(backupRepo),
    wipeDatabase: new WipeDatabaseUseCase(backupRepo),

    // Personal Records
    getPersonalRecords: new GetPersonalRecordsUseCase(statsRepo),
    getBestPersonalRecord: new GetBestPersonalRecordUseCase(statsRepo),
    getPRCountSince: new GetPRCountSinceUseCase(statsRepo),
  };
}
