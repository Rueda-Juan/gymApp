import { Factory } from 'fishery';
import { Routine, RoutineExercise } from '@kernel';

export const routineExerciseFactory = Factory.define<RoutineExercise>(({ sequence }) => ({
  id: `re-${sequence}`,
  routineId: `routine-${sequence}`,
  exerciseId: `exercise-${sequence}`,
  orderIndex: sequence,
  targetSets: 3,
  targetReps: 12,
  supersetGroup: null,
}));

export const routineFactory = Factory.define<Routine>(({ sequence }) => ({
  id: `routine-${sequence}`,
  name: `Routine ${sequence}`,
  notes: 'Default notes',
  createdAt: new Date().toISOString(),
}));
