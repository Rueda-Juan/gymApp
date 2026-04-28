import { Workout } from '@entities/workout';
import { WorkoutDTO } from '@shared';
import { toWorkoutExerciseDTO } from './workout-exercise.map';

export function toWorkoutDTO(entity: Workout): WorkoutDTO {
  return {
    id: entity.id,
    routineId: entity.routineId ?? null,
    date: entity.date.toISOString(),
    durationSeconds: entity.durationSeconds,
    notes: entity.notes ?? null,
    exercises: entity.exercises.map(toWorkoutExerciseDTO),
  };
}
