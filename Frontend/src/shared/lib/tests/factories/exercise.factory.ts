import { Factory } from 'fishery';
import { Exercise, MuscleGroup, Equipment, ExerciseType, LoadType } from '@kernel';

export const exerciseFactory = Factory.define<Exercise>(({ sequence }) => ({
  id: `exercise-${sequence}`,
  name: `Exercise ${sequence}`,
  type: 'isolation' as ExerciseType,
  loadType: 'weighted' as LoadType,
  muscles: ['chest'] as MuscleGroup[],
  equipment: 'dumbbell' as Equipment,
  primaryMuscles: ['chest'] as MuscleGroup[],
  secondaryMuscles: ['triceps'] as MuscleGroup[],
}));
