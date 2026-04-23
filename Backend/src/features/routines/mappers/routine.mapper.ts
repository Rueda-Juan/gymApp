import { Routine, RoutineExercise } from '../routine.entity';
import { RoutineDTO, RoutineExerciseDTO, MuscleGroup } from '@shared';

function toRoutineExerciseDTO(ex: RoutineExercise): RoutineExerciseDTO {
  return {
    exerciseId: ex.exerciseId,
    order: ex.orderIndex,
  };
}

export function toRoutineDTO(entity: Routine): RoutineDTO {
  return {
    id: entity.id,
    name: entity.name,
    notes: entity.notes ?? null,
    createdAt: typeof entity.createdAt === 'string' ? entity.createdAt : entity.createdAt.toISOString(),
    exercises: entity.exercises.map(toRoutineExerciseDTO),
    ...(entity.muscles ? { muscles: entity.muscles as MuscleGroup[] } : {}),
  };
}
