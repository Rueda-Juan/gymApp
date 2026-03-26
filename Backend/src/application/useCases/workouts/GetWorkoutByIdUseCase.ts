import type { Workout } from '../../../domain/entities/Workout';
import { WorkoutRepository } from '../../../domain/repositories/WorkoutRepository';

export class GetWorkoutByIdUseCase {
  constructor(private readonly workoutRepository: WorkoutRepository) {}

  async execute(id: string): Promise<Workout | null> {
    return this.workoutRepository.getById(id);
  }
}
