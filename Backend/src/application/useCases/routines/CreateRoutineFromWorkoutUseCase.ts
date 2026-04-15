import { generateId } from '../../../shared/utils/generateId';
import type { Routine, RoutineExercise } from '../../../domain/entities/Routine';
import type { Workout } from '../../../domain/entities/Workout';
import type { RoutineRepository } from '../../../domain/repositories/RoutineRepository';

/**
 * Use case: extracts valid exercises and sets from a completed workout
 * to generate a reusable Routine template. This aligns with /file-audit
 * principles of pure mapping, data encapsulation, and single responsibility.
 */
export class CreateRoutineFromWorkoutUseCase {
  constructor(private readonly routineRepo: RoutineRepository) {}

  async execute(workout: Workout, routineName: string): Promise<Routine> {
    const routineExercises: RoutineExercise[] = [];
    
    // Filter skipped exercises and those without sets
    const validExercises = workout.exercises.filter(ex => !ex.skipped && ex.sets.length > 0);

    for (let i = 0; i < validExercises.length; i++) {
        const we = validExercises[i]!;
        
        // Find best set or average for min/max logic
        const completedSets = we.sets.filter(s => s.completed && !s.skipped);
        if (completedSets.length === 0) continue;

        let maxReps = 0;
        let minReps = 999;
        let sumRest = 0;
        let restCount = 0;

        for (const s of completedSets) {
            if (s.reps > maxReps) maxReps = s.reps;
            if (s.reps < minReps) minReps = s.reps;
            if (s.restSeconds) {
                sumRest += s.restSeconds;
                restCount++;
            }
        }

        const avgRest = restCount > 0 ? Math.round(sumRest / restCount) : null;

        routineExercises.push({
            id: generateId(),
            exerciseId: we.exerciseId,
            orderIndex: i,
            targetSets: completedSets.length,
            minReps: minReps === 999 ? 0 : minReps,
            maxReps,
            restSeconds: avgRest,
            supersetGroup: we.supersetGroup
        });
    }

    const routine: Routine = {
        id: generateId(),
        name: routineName,
        notes: `Generada a partir de sesión del ${workout.date.toLocaleDateString()}`,
        exercises: routineExercises,
        createdAt: new Date(),
    };

    await this.routineRepo.save(routine);
    return routine;
  }
}
