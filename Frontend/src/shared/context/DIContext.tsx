import React, { createContext, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { YStack, useTheme } from 'tamagui';

export function useDI() {
  const ctx = React.useContext(DIContext);
  if (!ctx) throw new Error('DIContext not found');
  return ctx;
}
// import { createContainer, AppContainer } from 'backend/shared/container';
// import { getDatabase } from 'backend/infrastructure/database/connection';
// import { runMigrations } from 'backend/infrastructure/database/migrations';

type AppContainer = {
  // Workout
  startWorkout: { execute: (...args: any[]) => Promise<any> };
  finishWorkout: { execute: (...args: any[]) => Promise<any> };
  deleteWorkout: { execute: (...args: any[]) => Promise<any> };
  recordSet: { execute: (...args: any[]) => Promise<any> };
  updateSet: { execute: (...args: any[]) => Promise<any> };
  deleteSet: { execute: (...args: any[]) => Promise<any> };
  skipExercise: { execute: (...args: any[]) => Promise<any> };
  addExerciseToWorkout: { execute: (...args: any[]) => Promise<any> };
  reorderWorkoutExercises: { execute: (...args: any[]) => Promise<any> };
  deleteWorkoutExercise: { execute: (...args: any[]) => Promise<any> };
  updateWorkoutExercise: { execute: (...args: any[]) => Promise<any> };
  suggestWeight: { execute: (...args: any[]) => Promise<any> };
  suggestWarmup: { execute: (...args: any[]) => Promise<any> };
  getWorkoutHistory: { execute: (...args: any[]) => Promise<any[]> };
  getWorkoutById: { execute: (...args: any[]) => Promise<any> };
  recordAllSets: { execute: (...args: any[]) => Promise<any> };
  getPreviousSets: { execute: (...args: any[]) => Promise<any[]> };
  // Routines
  getRoutines: { execute: (...args: any[]) => Promise<any[]> };
  getRoutineById: { execute: (...args: any[]) => Promise<any> };
  createRoutine: { execute: (...args: any[]) => Promise<any> };
  updateRoutine: { execute: (...args: any[]) => Promise<any> };
  deleteRoutine: { execute: (...args: any[]) => Promise<any> };
  duplicateRoutine: { execute: (...args: any[]) => Promise<any> };
  // Exercises
  createExercise: { execute: (...args: any[]) => Promise<any> };
  updateExercise: { execute: (...args: any[]) => Promise<any> };
  deleteExercise: { execute: (...args: any[]) => Promise<any> };
  getExerciseHistory: { execute: (...args: any[]) => Promise<any[]> };
  getExercises: { execute: (...args: any[]) => Promise<any[]> };
  getExerciseById: { execute: (...args: any[]) => Promise<any> };
  // BodyWeight
  logBodyWeight: { execute: (...args: any[]) => Promise<any> };
  getBodyWeightHistory: { execute: (...args: any[]) => Promise<any[]> };
  updateBodyWeight: { execute: (...args: any[]) => Promise<any> };
  deleteBodyWeight: { execute: (...args: any[]) => Promise<any> };
  // Stats
  getStatsOverview: { execute: (...args: any[]) => Promise<any> };
  getWeeklyStats: { execute: (...args: any[]) => Promise<any[]> };
  getMuscleBalance: { execute: (...args: any[]) => Promise<any[]> };
  getTrainingFrequency: { execute: (...args: any[]) => Promise<any> };
  // Personal Records
  getPersonalRecords: { execute: (...args: any[]) => Promise<any[]> };
  getBestPersonalRecord: { execute: (...args: any[]) => Promise<any> };
  getPRCountSince: { execute: (...args: any[]) => Promise<number> };
  // Preferences
  getPreferences: { execute: (...args: any[]) => Promise<any> };
  updatePreference: { execute: (...args: any[]) => Promise<any> };
  // Backup
  createBackup: { execute: (...args: any[]) => Promise<any> };
  restoreBackup: { execute: (...args: any[]) => Promise<any> };
  exportCSV: { execute: (...args: any[]) => Promise<any> };
  // Achievement Evaluator
  evaluateSetPR: { execute: (...args: any[]) => Promise<any> };
  // Misc
  countSince: { execute: (...args: any[]) => Promise<number> };
};

const DIContext = createContext<AppContainer | null>(null);

// Error screen renders before the theme provider is available (DB init failure
// happens before any React tree is mounted), so raw hex fallbacks are
// intentional here — do NOT replace with Tamagui tokens.
const ERROR_FALLBACK_COLORS = {
  background:  '#000',
  title:       '#fff',
  description: '#999',
  errorText:   '#ef4444',
} as const;

interface DIProviderProps {
  children: React.ReactNode;
}

export function DIProvider({ children }: DIProviderProps) {
  const [container, setContainer] = useState<AppContainer | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const theme = useTheme();

  useEffect(() => {
    const controller = new AbortController();

    async function initDB() {
      try {
        // open DB and run migrations
        // lightweight logs help verify migration execution in Metro/Expo logs
        // without changing migration behavior
        //
        // Aquí deberías inicializar la base real si existe, si no, usar el mock:
        const appContainer = createContainer(undefined);
        if (!controller.signal.aborted) {
          setContainer(appContainer);
        }
      } catch (e) {
        const wrappedError = e instanceof Error ? e : new Error('Error desconocido en la BD local');
        if (!controller.signal.aborted) {
          setError(wrappedError);
        }
      }
    }

    initDB();
    // (El bloque de return de objeto fue eliminado, solo se usa createContainer para el mock persistente)
    return () => controller.abort();
  }, []);

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: ERROR_FALLBACK_COLORS.background, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: ERROR_FALLBACK_COLORS.title, fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>Error</Text>
        <Text style={{ color: ERROR_FALLBACK_COLORS.description, fontSize: 16, marginBottom: 16 }}>No se pudo inicializar la base de datos local.</Text>
        <Text style={{ color: ERROR_FALLBACK_COLORS.errorText }}>{error.message}</Text>
      </View>
    );
  }

  if (!container) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
        <ActivityIndicator size="large" color={theme.color?.val ?? '#fff'} />
        <Text style={{ color: theme.color?.val ?? '#fff', marginTop: 16 }}>Cargando dependencias...</Text>
      </YStack>
    );
  }

  return (
    <DIContext.Provider value={container}>
      {children}
    </DIContext.Provider>
  );
}
function createContainer(db: any): AppContainer {
  const emptyArr = async () => [];
  const emptyObj = async () => ({});
  const zero = async () => 0;
  return {
    // Workout
    startWorkout: { execute: emptyObj },
    finishWorkout: { execute: emptyObj },
    deleteWorkout: { execute: emptyObj },
    recordSet: { execute: emptyObj },
    updateSet: { execute: emptyObj },
    deleteSet: { execute: emptyObj },
    skipExercise: { execute: emptyObj },
    addExerciseToWorkout: { execute: emptyObj },
    reorderWorkoutExercises: { execute: emptyObj },
    deleteWorkoutExercise: { execute: emptyObj },
    updateWorkoutExercise: { execute: emptyObj },
    suggestWeight: { execute: emptyObj },
    suggestWarmup: { execute: emptyObj },
    getWorkoutHistory: { execute: emptyArr },
    getWorkoutById: { execute: emptyObj },
    recordAllSets: { execute: emptyObj },
    getPreviousSets: { execute: emptyArr },
    // Routines
    getRoutines: { execute: emptyArr },
    getRoutineById: { execute: emptyObj },
    createRoutine: { execute: emptyObj },
    updateRoutine: { execute: emptyObj },
    deleteRoutine: { execute: emptyObj },
    duplicateRoutine: { execute: emptyObj },
    // Exercises
    createExercise: { execute: emptyObj },
    updateExercise: { execute: emptyObj },
    deleteExercise: { execute: emptyObj },
    getExerciseHistory: { execute: emptyArr },
    getExercises: { execute: emptyArr },
    getExerciseById: { execute: emptyObj },
    // BodyWeight
    logBodyWeight: { execute: emptyObj },
    getBodyWeightHistory: { execute: emptyArr },
    updateBodyWeight: { execute: emptyObj },
    deleteBodyWeight: { execute: emptyObj },
    // Stats
    getStatsOverview: { execute: emptyObj },
    getWeeklyStats: { execute: emptyArr },
    getMuscleBalance: { execute: emptyArr },
    getTrainingFrequency: { execute: emptyObj },
    // Personal Records
    getPersonalRecords: { execute: emptyArr },
    getBestPersonalRecord: { execute: emptyObj },
    getPRCountSince: { execute: zero },
    // Preferences
    getPreferences: { execute: emptyObj },
    updatePreference: { execute: emptyObj },
    // Backup
    createBackup: { execute: emptyObj },
    restoreBackup: { execute: emptyObj },
    exportCSV: { execute: emptyObj },
    // Achievement Evaluator
    evaluateSetPR: { execute: emptyObj },
    // Misc
    countSince: { execute: zero },
  };
}

