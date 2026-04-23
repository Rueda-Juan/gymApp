import { Factory } from 'fishery';
import { WorkoutSet, WorkoutExercise, SetType } from '@kernel';
import { exerciseFactory } from './exercise.factory';

export const workoutSetFactory = Factory.define<WorkoutSet>(({ sequence }) => ({
  id: `set-${sequence}`,
  reps: 10,
  weight: 20,
  setNumber: sequence,
  setType: 'normal' as SetType,
  completed: true,
  rir: 2,
}));

export const workoutExerciseFactory = Factory.define<WorkoutExercise>(({ sequence }) => ({
  id: `work-ex-${sequence}`,
  exercise: exerciseFactory.build(),
  sets: workoutSetFactory.buildList(3),
}));
