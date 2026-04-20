import { WorkoutExerciseDTO, WorkoutSetDTO } from "@shared";
import { WorkoutExercise } from "../workout-exercise.entity";
import { toWorkoutSetDTO } from "./workout-set.mapper";

export function toWorkoutExerciseDTO(ex: WorkoutExercise): WorkoutExerciseDTO {
  return {
    id: ex.id,
    exerciseId: ex.exerciseId,
    order: ex.orderIndex,
    sets: ex.sets.map(toWorkoutSetDTO),
  };
}
