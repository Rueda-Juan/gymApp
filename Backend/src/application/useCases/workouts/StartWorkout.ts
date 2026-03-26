import type { Workout, WorkoutExercise } from '../../../domain/entities/Workout';
import type { WorkoutRepository } from '../../../domain/repositories/WorkoutRepository';
import type { RoutineRepository } from '../../../domain/repositories/RoutineRepository';
import { NotFoundError } from '../../../shared/errors';
import { generateId } from '../../../shared/utils/generateId';

/**
 * StartWorkout use case — creates a new workout instance from a routine.
 */
export class StartWorkoutUseCase {
  constructor(
    private readonly workoutRepo: WorkoutRepository,
    private readonly routineRepo: RoutineRepository,
  ) {}

  /**
   * Creates a new workout from an existing routine or empty.
   * @param routineId - ID of the routine to base the workout on, or null for empty.
   * @returns The newly created Workout.
   */
  async execute(routineId: string | null): Promise<Workout> {
    let exercises: WorkoutExercise[] = [];
    
    if (routineId) {
      const routine = await this.routineRepo.getById(routineId);
      if (!routine) {
        throw new NotFoundError(`Routine ${routineId} no encontrada`);
      }
      exercises = routine.exercises.map((re) => ({
        id: generateId(),
        exerciseId: re.exerciseId,
        orderIndex: re.orderIndex,
        skipped: false,
        notes: null,
        supersetGroup: re.supersetGroup ?? null,
        sets: [],
      }));
    }

    const workout: Workout = {
      id: generateId(),
      routineId,
      date: new Date(),
      durationSeconds: 0,
      notes: null,
      exercises,
    };

    await this.workoutRepo.save(workout);
    return workout;
  }
}
