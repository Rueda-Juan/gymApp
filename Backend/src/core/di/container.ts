import type * as SQLite from 'expo-sqlite';

// --- CORE ---
// --- FEATURES: EXERCISES ---
import { SQLiteExerciseRepository } from '../../features/exercises/sqlite-exercise.repository';
import { SQLiteExerciseLoadCacheRepository } from '../../features/exercises/sqlite-exercise-load-cache.repository';
import { ExerciseService } from '../../features/exercises/exercise.service';

// --- FEATURES: ROUTINES ---
import { SQLiteRoutineRepository } from '../../features/routines/sqlite-routine.repository';
import { RoutineService } from '../../features/routines/routine.service';

// --- FEATURES: WORKOUTS ---
import { SQLiteWorkoutRepository } from '../../features/workouts/sqlite-workout.repository';
import { WorkoutService } from '../../features/workouts/workout.service';

// --- FEATURES: STATS ---
import { SQLiteStatsRepository } from '../../features/stats/sqlite-stats.repository';
import { StatsService } from '../../features/stats/stats.service';

// --- FEATURES: SETTINGS ---
import { SQLiteUserPreferencesRepository } from '../../features/settings/sqlite-user-preferences.repository';
import { SettingsService } from '../../features/settings/settings.service';

// --- FEATURES: BODY WEIGHT ---
import { SQLiteBodyWeightRepository } from '../../features/body-weight/sqlite-body-weight.repository';
import { BodyWeightService } from '../../features/body-weight/body-weight.service';

// --- FEATURES: BACKUP ---
import { SQLiteBackupRepository } from '../../features/backup/sqlite-backup.repository';
import { BackupService } from '../../features/backup/backup.service';

export interface AppContainer {
  exerciseService: ExerciseService;
  routineService: RoutineService;
  workoutService: WorkoutService;
  statsService: StatsService;
  settingsService: SettingsService;
  bodyWeightService: BodyWeightService;
  backupService: BackupService;
}

export function createContainer(db: SQLite.SQLiteDatabase): AppContainer {

  // --- REPOSITORIES ---
  const exerciseRepo = new SQLiteExerciseRepository(db);
  const loadCacheRepo = new SQLiteExerciseLoadCacheRepository(db);

  const routineRepo = new SQLiteRoutineRepository(db);
  const workoutRepo = new SQLiteWorkoutRepository(db);
  const statsRepo = new SQLiteStatsRepository(db);
  const preferencesRepo = new SQLiteUserPreferencesRepository(db);
  const bodyWeightRepo = new SQLiteBodyWeightRepository(db);
  const backupRepo = new SQLiteBackupRepository(db);

  // --- SERVICES (🔥 reemplazan TODOS los use cases) ---

  const exerciseService = new ExerciseService(
    exerciseRepo,
    workoutRepo
  );

  const routineService = new RoutineService(routineRepo);

  const workoutService = new WorkoutService(
    workoutRepo,
    statsRepo,
    loadCacheRepo,
    routineRepo,
    db
  );

  const statsService = new StatsService(statsRepo);

  const settingsService = new SettingsService(preferencesRepo);

  const bodyWeightService = new BodyWeightService(bodyWeightRepo);

  const backupService = new BackupService(backupRepo);

  return {
    exerciseService,
    routineService,
    workoutService,
    statsService,
    settingsService,
    bodyWeightService,
    backupService,
  };
}