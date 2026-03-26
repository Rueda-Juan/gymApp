import { create } from 'zustand';

interface RoutineExercise {
  id: string;
  name: string;
  nameEs?: string | null;
  muscle: string;
  sets: number;
  reps: string;
  supersetGroup?: number | null;
}

interface RoutineState {
  name: string;
  notes: string;
  exercises: RoutineExercise[];
  setName: (name: string) => void;
  setNotes: (notes: string) => void;
  addExercise: (exercise: { id: string, name: string, nameEs?: string | null, muscle: string }) => void;
  removeExercise: (id: string) => void;
  updateExercise: (id: string, sets: number, reps: string) => void;
  linkExerciseNext: (index: number) => void;
  unlinkExercise: (index: number) => void;
  reorderExercises: (newExercises: RoutineExercise[]) => void;
  loadRoutine: (routine: any) => void;
  reset: () => void;
}

export const useRoutineStore = create<RoutineState>((set) => ({
  name: '',
  notes: '',
  exercises: [],
  setName: (name) => set({ name }),
  setNotes: (notes) => set({ notes }),
  addExercise: (exercise) => set((state) => ({
    exercises: [...state.exercises, { ...exercise, sets: 3, reps: '8-12' }]
  })),
  removeExercise: (id) => set((state) => ({
    exercises: state.exercises.filter(e => e.id !== id)
  })),
  updateExercise: (id, sets, reps) => set((state) => ({
    exercises: state.exercises.map(e => e.id === id ? { ...e, sets, reps } : e)
  })),
  linkExerciseNext: (index) => set((state) => {
    const ex = [...state.exercises];
    if (index >= ex.length - 1) return state; // Can't link the last one to nothing
    // Give them a matching group ID (milliseconds) if they don't have one
    const groupId = ex[index].supersetGroup || ex[index + 1].supersetGroup || Date.now();
    ex[index].supersetGroup = groupId;
    ex[index + 1].supersetGroup = groupId;
    return { exercises: ex };
  }),
  unlinkExercise: (index) => set((state) => {
    const ex = [...state.exercises];
    ex[index].supersetGroup = null;
    return { exercises: ex };
  }),
  reorderExercises: (newExercises) => set({
    exercises: newExercises
  }),
  loadRoutine: (routine) => set({
    name: routine.name,
    notes: routine.notes || '',
    exercises: routine.exercises.map((e: any) => ({
      id: e.exerciseId,
      name: e.exercise.name,
      nameEs: e.exercise.nameEs,
      muscle: e.exercise.primaryMuscles?.[0] || 'other',
      sets: e.targetSets,
      reps: e.maxReps.toString(), 
      supersetGroup: e.supersetGroup,
    }))
  }),
  reset: () => set({ name: '', notes: '', exercises: [] }),
}));
