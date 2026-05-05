import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClientId } from '@/shared/lib/clientId';
import { featureFlags } from '@/shared/constants/featureFlags';

import { WorkoutSetState, WorkoutExerciseState, PendingDeletion } from '@kernel';

export interface ActiveWorkoutStore {
  isActive: boolean;
  workoutId: string | null;
  startTime: number | null;
  routineId: string | null;
  routineName: string | null;
  exercises: WorkoutExerciseState[];
  currentExerciseIndex: number;
  sessionNote?: string;
  lastSessionOutcome: 'finished' | 'cancelled' | null;
  pendingDeletionsByExercise: Record<string, PendingDeletion[]>;

  // Actions
  startWorkout: (workoutId: string, routineId: string | null, name: string | null, initialExercises: WorkoutExerciseState[]) => void;
  finishWorkout: () => void;
  cancelWorkout: () => void;
  setSessionNote: (note: string) => void;

  // Sets Actions
  toggleSetComplete: (exerciseId: string, setId: string) => void;
  updateSetValues: (exerciseId: string, setId: string, values: Partial<WorkoutSetState>) => void;
  addSet: (exerciseId: string) => string;
  removeSet: (exerciseId: string, setId: string) => void;
  softRemoveSet: (exerciseId: string, setId: string) => void;
  restoreLastSet: (exerciseId: string) => void;
  clearPendingDeletions: (exerciseId: string) => void;

  // Exercises Actions
  addExercise: (exercise: WorkoutExerciseState) => void;
  removeExercise: (exerciseId: string) => void;
  skipExercise: (exerciseId: string) => void;
  setCurrentExercise: (index: number) => void;
  moveExerciseToEnd: (exerciseId: string) => void;
  replaceExercise: (oldExerciseId: string, newExercise: WorkoutExerciseState) => void;
}

const createInactiveWorkoutState = (
  lastSessionOutcome: 'finished' | 'cancelled' | null = null
): Pick<
  ActiveWorkoutStore,
  | 'isActive'
  | 'workoutId'
  | 'startTime'
  | 'routineId'
  | 'routineName'
  | 'exercises'
  | 'currentExerciseIndex'
  | 'sessionNote'
  | 'lastSessionOutcome'
  | 'pendingDeletionsByExercise'
> => ({
  isActive: false,
  workoutId: null,
  startTime: null,
  routineId: null,
  routineName: null,
  exercises: [],
  currentExerciseIndex: 0,
  sessionNote: undefined,
  lastSessionOutcome,
  pendingDeletionsByExercise: {},
});

const staleWorkoutThresholdMs = 1000 * 60 * 60 * 12;

const baseStore: StateCreator<ActiveWorkoutStore> = (set, _get) => ({
  ...createInactiveWorkoutState(),
  startWorkout: (workoutId, routineId, name, initialExercises) =>
    set({
      isActive: true,
      workoutId,
      startTime: Date.now(),
      routineId,
      routineName: name || 'Entrenamiento Libre',
      exercises: initialExercises.map((ex, i) => ({ ...ex, status: i === 0 ? 'active' : 'pending' })),
      currentExerciseIndex: 0,
      lastSessionOutcome: null,
      pendingDeletionsByExercise: {},
    }),
  finishWorkout: () => {
    set(createInactiveWorkoutState('finished'));
  },
  cancelWorkout: () => {
    set(createInactiveWorkoutState('cancelled'));
  },
  setSessionNote: (note) => set({ sessionNote: note }),
  toggleSetComplete: (exerciseId, setId) =>
    set((state) => ({
      exercises: state.exercises.map(ex => {
        if (ex.id !== exerciseId) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s: WorkoutSetState) => s.id === setId ? { ...s, isCompleted: !s.isCompleted } : s)
        };
      })
    })),
  updateSetValues: (exerciseId, setId, values) =>
    set((state) => ({
      exercises: state.exercises.map(ex => {
        if (ex.id !== exerciseId) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s: WorkoutSetState) => s.id === setId ? { ...s, ...values } : s)
        };
      })
    })),
  addSet: (exerciseId) => {
    let newId = '';
    set((state) => ({
      exercises: state.exercises.map(ex => {
        if (ex.id !== exerciseId) return ex;
        const lastSet = ex.sets[ex.sets.length - 1];
        newId = createClientId();
        const newSet: WorkoutSetState = {
          id: newId,
          weight: lastSet ? lastSet.weight : 0,
          reps: lastSet ? lastSet.reps : 0,
          isCompleted: false,
          type: 'normal',
        };
        return { ...ex, sets: [...ex.sets, newSet] };
      })
    }));
    return newId;
  },
  removeSet: (exerciseId, setId) =>
    set((state) => ({
      exercises: state.exercises.map(ex => {
        if (ex.id !== exerciseId) return ex;
        return {
          ...ex,
          sets: ex.sets.filter((s: WorkoutSetState) => s.id !== setId)
        };
      })
    })),
  softRemoveSet: (exerciseId, setId) => {
    set((state) => {
      const exercise = state.exercises.find(ex => ex.id === exerciseId);
      if (!exercise) return state;
      const setIndex = exercise.sets.findIndex((s: WorkoutSetState) => s.id === setId);
      if (setIndex === -1) return state;
      const setToDelete = exercise.sets[setIndex];
      const newSets = exercise.sets.filter((s: WorkoutSetState) => s.id !== setId);
      const newPending = {
        exerciseId,
        set: setToDelete,
        index: setIndex
      };
      const currentPending = state.pendingDeletionsByExercise[exerciseId] || [];
      return {
        exercises: state.exercises.map(ex =>
          ex.id === exerciseId ? { ...ex, sets: newSets } : ex
        ),
        pendingDeletionsByExercise: {
          ...state.pendingDeletionsByExercise,
          [exerciseId]: [...currentPending, newPending]
        }
      };
    });
  },
  restoreLastSet: (exerciseId) => {
    set((state) => {
      const pending = state.pendingDeletionsByExercise[exerciseId] || [];
      if (pending.length === 0) return state;
      const lastPending = pending[pending.length - 1];
      const newPending = pending.slice(0, -1);
      return {
        exercises: state.exercises.map(ex => {
          if (ex.id !== exerciseId) return ex;
          const newSets = [...ex.sets];
          newSets.splice(lastPending.index, 0, lastPending.set);
          return { ...ex, sets: newSets };
        }),
        pendingDeletionsByExercise: {
          ...state.pendingDeletionsByExercise,
          [exerciseId]: newPending
        }
      };
    });
  },
  clearPendingDeletions: (exerciseId) => {
    set((state) => ({
      pendingDeletionsByExercise: {
        ...state.pendingDeletionsByExercise,
        [exerciseId]: []
      }
    }));
  },
  addExercise: (exercise) =>
    set((state) => ({
      exercises: [...state.exercises, { ...exercise, status: 'pending' }]
    })),
  removeExercise: (exerciseId) =>
    set((state) => {
      const removedIdx = state.exercises.findIndex(ex => ex.id === exerciseId);
      const newExercises = state.exercises.filter(ex => ex.id !== exerciseId);
      const adjustedIndex = removedIdx !== -1 && removedIdx <= state.currentExerciseIndex
        ? Math.max(0, state.currentExerciseIndex - 1)
        : state.currentExerciseIndex;
      return {
        exercises: newExercises,
        currentExerciseIndex: Math.min(adjustedIndex, Math.max(0, newExercises.length - 1)),
      };
    }),
  skipExercise: (exerciseId) =>
    set((state) => ({
      exercises: state.exercises.map(ex =>
        ex.id === exerciseId ? { ...ex, status: 'skipped' } : ex
      )
    })),
  setCurrentExercise: (index) => set({ currentExerciseIndex: index }),
  moveExerciseToEnd: (exerciseId) =>
    set((state) => {
      const idx = state.exercises.findIndex(e => e.id === exerciseId);
      if (idx === -1) return state;
      const ex = state.exercises[idx];
      const newExercises = [...state.exercises];
      newExercises.splice(idx, 1);
      newExercises.push(ex);
      const adjustedIndex = idx < state.currentExerciseIndex
        ? state.currentExerciseIndex - 1
        : state.currentExerciseIndex;
      return { exercises: newExercises, currentExerciseIndex: adjustedIndex };
    }),
  replaceExercise: (oldExerciseId, newExercise) =>
    set((state) => {
      const idx = state.exercises.findIndex(e => e.id === oldExerciseId);
      if (idx === -1) return state;
      const newExercises = [...state.exercises];
      newExercises[idx] = newExercise;
      return { exercises: newExercises };
    }),
});
export const useActiveWorkout = featureFlags.enablePersistence
  ? create<ActiveWorkoutStore>()(
      persist(baseStore, {
        name: 'active-workout-storage',
        storage: createJSONStorage(() => AsyncStorage),
        onRehydrateStorage: () => (state) => {
          if (!state?.isActive) return;

          const startTime = state.startTime;
          const hasMissingIdentity = !state.workoutId || startTime === null;
          const isStaleWorkout =
            startTime !== null &&
            Date.now() - startTime > staleWorkoutThresholdMs;

          if (hasMissingIdentity || isStaleWorkout) {
            state.cancelWorkout();
          }
        },
      })
    )
  : create<ActiveWorkoutStore>()(baseStore);

