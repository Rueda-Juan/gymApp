import { Factory } from 'fishery';
import { WorkoutSet, WorkoutExercise, SetType } from '@kernel';

export const workoutSetFactory = Factory.define<WorkoutSet>(({ sequence }) => ({
  id: `set-${sequence}`,
  workoutId: `workout-1`,
  exerciseId: `exercise-1`,
  reps: 10,
  weight: 20,
  setNumber: sequence,
  setType: 'normal' as SetType,
  completed: true,
  skipped: false,
  rir: 2,
  createdAt: new Date().toISOString(),
  durationSeconds: null,
  restSeconds: null,
  partialReps: null,
}));

export const workoutExerciseFactory = Factory.define<WorkoutExercise>(({ sequence }) => ({
  id: `work-ex-${sequence}`,
  workoutId: `workout-1`,
  exerciseId: `exercise-1`,
  orderIndex: sequence,
  notes: null,
  supersetGroup: null,
  skipped: false,
}));
