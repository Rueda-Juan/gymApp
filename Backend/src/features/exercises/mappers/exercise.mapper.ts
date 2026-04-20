import { Exercise } from '../exercise.entity';
import { ExerciseDTO } from '@shared';

export function toExerciseDTO(entity: Exercise): ExerciseDTO {
  // Map only valid LoadType values
  let loadType: ExerciseDTO['loadType'] = 'weighted';
  if (entity.loadType === 'weighted' || entity.loadType === 'bodyweight' || entity.loadType === 'assisted' || entity.loadType === 'timed') {
    loadType = entity.loadType;
  }
  return {
    id: entity.id,
    name: entity.name,
    primaryMuscles: entity.primaryMuscles,
    secondaryMuscles: entity.secondaryMuscles,
    equipment: entity.equipment,
    type: entity.exerciseType,
    loadType,
  };
}
