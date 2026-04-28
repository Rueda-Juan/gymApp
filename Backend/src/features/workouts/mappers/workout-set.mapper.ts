import { WorkoutSet } from '@entities/workout';
import { WorkoutSetDTO } from '@shared';

export function toWorkoutSetDTO(entity: WorkoutSet): WorkoutSetDTO {
  return {
    id: entity.id,
    exerciseId: entity.exerciseId,
    setNumber: entity.setNumber,
    weight: entity.weight,
    reps: entity.reps,
    rir: entity.rir,
    restSeconds: entity.restSeconds,
    completed: entity.completed,
  };
}
