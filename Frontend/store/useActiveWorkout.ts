import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClientId } from '@/utils/clientId';
import { useRestTimer } from '@/store/useRestTimer';

export interface WorkoutSetState {
  id: string;
  weight: number;
  reps: number;
  isCompleted: boolean;
  type: 'warmup' | 'normal' | 'failure' | 'dropset';
  rir?: number | null;
}

export interface WorkoutExerciseState {
  id: string; // ID temporal en el entreno activo
  exerciseId: string; // ID real del DB
  name: string;
  nameEs?: string | null;
  sets: WorkoutSetState[];
  status?: 'active' | 'pending' | 'completed' | 'skipped';
  supersetGroup?: number | null;
}

interface ActiveWorkoutStore {
  isActive: boolean;
  workoutId: string | null;
  startTime: number | null;
  routineId: string | null;
  routineName: string | null;
  exercises: WorkoutExerciseState[];
  currentExerciseIndex: number;
  sessionNote?: string;
  lastSessionOutcome: 'finished' | 'cancelled' | null;

  // Actions
  startWorkout: (workoutId: string, routineId: string | null, name: string | null, initialExercises: WorkoutExerciseState[]) => void;
  finishWorkout: () => void;
  cancelWorkout: () => void;
  setSessionNote: (note: string) => void;
  
  // Sets Actions
  toggleSetComplete: (exerciseId: string, setId: string) => void;
  updateSetValues: (exerciseId: string, setId: string, values: Partial<WorkoutSetState>) => void;
  addSet: (exerciseId: string) => void;
  removeSet: (exerciseId: string, setId: string) => void;
  
  // Exercises Actions
  addExercise: (exercise: WorkoutExerciseState) => void;
  removeExercise: (exerciseId: string) => void;
  skipExercise: (exerciseId: string) => void;
  setCurrentExercise: (index: number) => void;
  moveExerciseToEnd: (exerciseId: string) => void;
  replaceExercise: (oldExerciseId: string, newExercise: WorkoutExerciseState) => void;
}

const createInactiveWorkoutState = (lastSessionOutcome: 'finished' | 'cancelled' | null = null) => ({
  isActive: false,
  workoutId: null,
  startTime: null,
  routineId: null,
  routineName: null,
  exercises: [],
  currentExerciseIndex: 0,
  sessionNote: undefined,
  lastSessionOutcome,
});

const staleWorkoutThresholdMs = 1000 * 60 * 60 * 12;

export const useActiveWorkout = create<ActiveWorkoutStore>()(
  persist(
    (set, get) => ({
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
    }),

  finishWorkout: () => {
    useRestTimer.getState().stopTimer();
    set(createInactiveWorkoutState('finished'));
  },

  cancelWorkout: () => {
    useRestTimer.getState().stopTimer();
    set(createInactiveWorkoutState('cancelled'));
  },

  setSessionNote: (note) => set({ sessionNote: note }),

  toggleSetComplete: (exerciseId, setId) => 
    set((state) => ({
      exercises: state.exercises.map(ex => {
        if (ex.id !== exerciseId) return ex;
        return {
          ...ex,
          sets: ex.sets.map(s => s.id === setId ? { ...s, isCompleted: !s.isCompleted } : s)
        };
      })
    })),

  updateSetValues: (exerciseId, setId, values) =>
    set((state) => ({
      exercises: state.exercises.map(ex => {
        if (ex.id !== exerciseId) return ex;
        return {
          ...ex,
          sets: ex.sets.map(s => s.id === setId ? { ...s, ...values } : s)
        };
      })
    })),

  addSet: (exerciseId) =>
    set((state) => ({
      exercises: state.exercises.map(ex => {
        if (ex.id !== exerciseId) return ex;
        const lastSet = ex.sets[ex.sets.length - 1];
        const newSet: WorkoutSetState = {
          id: createClientId(),
          weight: lastSet ? lastSet.weight : 0,
          reps: lastSet ? lastSet.reps : 0,
          isCompleted: false,
          type: 'normal',
        };
        return { ...ex, sets: [...ex.sets, newSet] };
      })
    })),

  removeSet: (exerciseId, setId) =>
    set((state) => ({
      exercises: state.exercises.map(ex => {
        if (ex.id !== exerciseId) return ex;
        return {
          ...ex,
          sets: ex.sets.filter(s => s.id !== setId)
        };
      })
    })),

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
}), {
  name: 'active-workout-storage',
  storage: createJSONStorage(() => AsyncStorage),
  onRehydrateStorage: () => (state) => {
    if (!state?.isActive) return;

    const hasMissingIdentity = !state.workoutId || !state.startTime;
    const isStaleWorkout = !hasMissingIdentity && (Date.now() - state.startTime! > staleWorkoutThresholdMs);

    if (hasMissingIdentity || isStaleWorkout) {
      state.cancelWorkout();
    }
  },
}));
