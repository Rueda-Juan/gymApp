import { Factory } from 'fishery';
import { Exercise, ExerciseType, LoadType } from '@kernel';

export const exerciseFactory = Factory.define<Exercise>(({ sequence }) => ({
  id: `exercise-${sequence}`,
  name: `Exercise ${sequence}`,
  nameEs: null,
  primaryMuscle: 'chest',
  primaryMuscles: ['chest'],
  secondaryMuscles: ['triceps'],
  equipment: 'dumbbell',
  weightIncrement: 1.25,
  type: 'isolation' as ExerciseType,
  loadType: 'weighted' as LoadType,
  animationPath: null,
  description: null,
  isCustom: false,
  createdBy: null,
  isArchived: false,
  exerciseKey: null,
  anatomicalSvg: null,
}));
