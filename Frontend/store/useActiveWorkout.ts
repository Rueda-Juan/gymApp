import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  status?: 'active' | 'completed' | 'skipped';
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
  
  // Actions
  startWorkout: (workoutId: string, routineId: string | null, name: string | null, initialExercises: WorkoutExerciseState[]) => void;
  finishWorkout: () => void;
  cancelWorkout: () => void;
  
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

export const useActiveWorkout = create<ActiveWorkoutStore>()(
  persist(
    (set, get) => ({
  isActive: false,
  workoutId: null,
  startTime: null,
  routineId: null,
  routineName: null,
  exercises: [],
  currentExerciseIndex: 0,

  startWorkout: (workoutId, routineId, name, initialExercises) => 
    set({
      isActive: true,
      workoutId,
      startTime: Date.now(),
      routineId,
      routineName: name || 'Entrenamiento Libre',
      exercises: initialExercises.map((ex, i) => ({ ...ex, status: i === 0 ? 'active' : 'completed' })),
      currentExerciseIndex: 0,
    }),

  finishWorkout: () => set({ isActive: false, workoutId: null, startTime: null, routineId: null, routineName: null, exercises: [], currentExerciseIndex: 0 }),
  
  cancelWorkout: () => set({ isActive: false, workoutId: null, startTime: null, routineId: null, routineName: null, exercises: [], currentExerciseIndex: 0 }),

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
          id: Math.random().toString(36).substr(2, 9),
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
      exercises: [...state.exercises, { ...exercise, status: 'completed' }]
    })),

  removeExercise: (exerciseId) =>
    set((state) => ({
      exercises: state.exercises.filter(ex => ex.id !== exerciseId)
    })),

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
      return { exercises: newExercises };
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
}));
