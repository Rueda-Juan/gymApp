import { create } from 'zustand';

const DEFAULT_SETS = 3;
const DEFAULT_REP_RANGE = '8-12';

interface RoutineExercise {
  id: string;
  name: string;
  nameEs?: string | null;
  muscle: string;
  sets: number;
  reps: string;
  supersetGroup?: number | null;
}

interface LoadableRoutine {
  name: string;
  notes?: string | null;
  exercises: {
    exerciseId?: string;
    id?: string;
    exercise?: { name: string; nameEs?: string | null; primaryMuscles?: string[] };
    targetSets?: number;
    maxReps?: string | number;
    name?: string;
    nameEs?: string | null;
    muscle?: string;
    sets?: number;
    reps?: string;
    supersetGroup?: number | null;
  }[];
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
  loadRoutine: (routine: LoadableRoutine) => void;
  reset: () => void;
}

export const useRoutineStore = create<RoutineState>((set) => ({
  name: '',
  notes: '',
  exercises: [],
  setName: (name) => set({ name }),
  setNotes: (notes) => set({ notes }),
  addExercise: (exercise) => set((state) => {
    // Prevenir duplicados por id
    if (state.exercises.some(e => e.id === exercise.id)) {
      // AquÃƒÆ’Ã‚Â­ podrÃƒÆ’Ã‚Â­as disparar un toast o feedback si lo deseas
      return {};
    }
    return {
      exercises: [...state.exercises, { ...exercise, sets: DEFAULT_SETS, reps: DEFAULT_REP_RANGE }]
    };
  }),
  removeExercise: (id) => set((state) => ({
    exercises: state.exercises.filter(e => e.id !== id)
  })),
  updateExercise: (id, sets, reps) => set((state) => ({
    exercises: state.exercises.map(e => e.id === id ? { ...e, sets, reps } : e)
  })),
  linkExerciseNext: (index) => set((state) => {
    const ex = [...state.exercises];
    if (index >= ex.length - 1) return state;
    const current = ex[index];
    const next = ex[index + 1];
    const existingGroup = current.supersetGroup ?? next.supersetGroup ?? null;
    const groupId = existingGroup ?? (Math.max(0, ...ex.map(e => e.supersetGroup ?? 0)) + 1);

    return {
      exercises: ex.map((e, i) => {
        if (i === index || i === index + 1) return { ...e, supersetGroup: groupId };
        if (e.supersetGroup === current.supersetGroup && current.supersetGroup != null) return { ...e, supersetGroup: groupId };
        if (e.supersetGroup === next.supersetGroup && next.supersetGroup != null) return { ...e, supersetGroup: groupId };
        return e;
      }),
    };
  }),
  unlinkExercise: (index) => set((state) => {
    const ex = [...state.exercises];
    if (!ex[index]) return { exercises: ex };
    const currentGroup = ex[index].supersetGroup;
    if (currentGroup == null) return { exercises: ex };

    const resetLinked = ex.map((exercise, i) =>
      i === index ? { ...exercise, supersetGroup: null } : exercise
    );

    return { exercises: resetLinked };
  }),
  reorderExercises: (newExercises) => set({
    exercises: newExercises
  }),
  loadRoutine: (routine) => set({
    name: routine.name,
    notes: routine.notes || '',
    exercises: (routine.exercises || []).map((e) => {
      const hasNestedExercise = 'exercise' in e && e.exercise != null;
      if (hasNestedExercise) {
        return {
          id: e.exerciseId ?? e.id ?? '',
          name: e.exercise!.name,
          nameEs: e.exercise!.nameEs,
          muscle: e.exercise!.primaryMuscles?.[0] || 'other',
          sets: e.targetSets ?? e.sets ?? DEFAULT_SETS,
          reps: String(e.maxReps ?? e.reps ?? DEFAULT_REP_RANGE),
          supersetGroup: e.supersetGroup ?? null,
        };
      }
      return {
        id: e.exerciseId ?? e.id ?? '',
        name: e.name ?? '',
        nameEs: e.nameEs || null,
        muscle: e.muscle || 'other',
        sets: e.sets || DEFAULT_SETS,
        reps: e.reps || DEFAULT_REP_RANGE,
        supersetGroup: e.supersetGroup || null,
      };
    })
  }),
  reset: () => set({ name: '', notes: '', exercises: [] }),
}));

