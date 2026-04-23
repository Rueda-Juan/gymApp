import { Factory } from 'fishery';
import { Routine, RoutineExercise } from '@kernel';

export const routineExerciseFactory = Factory.define<RoutineExercise>(({ sequence }) => ({
  exerciseId: `exercise-${sequence}`,
  order: sequence,
  sets: 3,
  reps: '8-12',
}));

export const routineFactory = Factory.define<Routine>(({ sequence }) => ({
  id: `routine-${sequence}`,
  name: `Routine ${sequence}`,
  notes: 'Default notes',
  exercises: routineExerciseFactory.buildList(3),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));
