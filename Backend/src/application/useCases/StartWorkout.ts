import type { Workout } from '../../domain/entities/Workout';
import type { WorkoutRepository } from '../../domain/repositories/WorkoutRepository';
import type { RoutineRepository } from '../../domain/repositories/RoutineRepository';
import { NotFoundError } from '../../shared/errors';
import { generateId } from '../../shared/utils/generateId';

/**
 * StartWorkout use case — creates a new workout instance from a routine.
 */
export class StartWorkoutUseCase {
  constructor(
    private readonly workoutRepo: WorkoutRepository,
    private readonly routineRepo: RoutineRepository,
  ) {}

  /**
   * Creates a new workout from an existing routine.
   * @param routineId - ID of the routine to base the workout on.
   * @returns The newly created Workout.
   * @throws NotFoundError if the routine doesn't exist.
   */
  async execute(routineId: string): Promise<Workout> {
    const routine = await this.routineRepo.getById(routineId);
    if (!routine) {
      throw new NotFoundError(`Routine ${routineId} no encontrada`);
    }

    const workout: Workout = {
      id: generateId(),
      routineId,
      date: new Date(),
      durationSeconds: 0,
      notes: null,
      exercises: routine.exercises.map((re) => ({
        id: generateId(),
        exerciseId: re.exerciseId,
        orderIndex: re.orderIndex,
        skipped: false,
        sets: [],
      })),
    };

    await this.workoutRepo.save(workout);
    return workout;
  }
}
