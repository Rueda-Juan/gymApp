import { useRoutineStore } from '@/entities/routine';

export function useRoutineEditor() {
  const name = useRoutineStore(s => s.name);
  const notes = useRoutineStore(s => s.notes);
  const exercises = useRoutineStore(s => s.exercises);
  const setName = useRoutineStore(s => s.setName);
  const setNotes = useRoutineStore(s => s.setNotes);
  const removeExercise = useRoutineStore(s => s.removeExercise);
  const updateExercise = useRoutineStore(s => s.updateExercise);
  const reorderExercises = useRoutineStore(s => s.reorderExercises);
  const linkExerciseNext = useRoutineStore(s => s.linkExerciseNext);
  const unlinkExercise = useRoutineStore(s => s.unlinkExercise);
  const loadRoutine = useRoutineStore(s => s.loadRoutine);
  const reset = useRoutineStore(s => s.reset);

  return {
    name, notes, exercises,
    setName, setNotes,
    removeExercise, updateExercise, reorderExercises,
    linkExerciseNext, unlinkExercise,
    loadRoutine, reset,
  };
}
