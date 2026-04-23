import type { RoutineRepository } from './routine.repository';
import type { Routine, RoutineExercise } from './routine.entity';
import type { Workout } from '../workouts/workout.entity';
import { generateId } from '../../core/utils/generate-id';
import { ValidationError, NotFoundError } from '../../core/errors/errors';

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export class RoutineService {
  constructor(private readonly routineRepository: RoutineRepository) {}

  // ── Create ────────────────────────────────────────────────────────────────

  async createRoutine(params: Omit<Routine, 'id' | 'createdAt'>): Promise<Routine> {
    if (!params.name || params.name.trim() === '') {
      throw new ValidationError('El nombre de la rutina es requerido', {
        name: ['El nombre de la rutina es requerido'],
      });
    }

    const newRoutine: Routine = {
      ...params,
      id: generateId(),
      createdAt: new Date(),
      exercises: params.exercises.map((ex) => {
        if (ex.minReps > ex.maxReps) {
          throw new ValidationError('El rango de repeticiones es inválido (min > max)', {});
        }
        if (ex.targetSets <= 0) {
          throw new ValidationError('El número de series debe ser mayor a 0', {});
        }
        return {
          ...ex,
          id: ex.id || generateId(),
        };
      }),
    };

    await this.routineRepository.save(newRoutine);
    return newRoutine;
  }

  /**
   * Extracts valid exercises and sets from a completed workout
   * to generate a reusable Routine template.
   */
  async createRoutineFromWorkout(workout: Workout, routineName: string): Promise<Routine> {
    const routineExercises: RoutineExercise[] = [];

    const validExercises = workout.exercises.filter(
      (ex) => !ex.skipped && ex.sets.length > 0,
    );

    for (let i = 0; i < validExercises.length; i++) {
      const we = validExercises[i]!;

      const completedSets = we.sets.filter((s) => s.completed && !s.skipped);
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
        supersetGroup: we.supersetGroup,
      });
    }

    const routine: Routine = {
      id: generateId(),
      name: routineName,
      notes: `Generada a partir de sesión del ${workout.date.toLocaleDateString()}`,
      exercises: routineExercises,
      createdAt: new Date(),
    };

    await this.routineRepository.save(routine);
    return routine;
  }

  // ── Read ──────────────────────────────────────────────────────────────────

  async getRoutines(): Promise<Routine[]> {
    return this.routineRepository.getAll();
  }

  async getRoutineById(id: string): Promise<Routine | null> {
    return this.routineRepository.getById(id);
  }

  async getRoutineExercises(routineId: string): Promise<RoutineExercise[]> {
    const routine = await this.routineRepository.getById(routineId);
    if (!routine) {
      throw new NotFoundError(`Rutina con ID ${routineId} no encontrada`);
    }

    return routine.exercises.sort((a, b) => a.orderIndex - b.orderIndex);
  }

  // ── Update ────────────────────────────────────────────────────────────────

  async updateRoutine(
    id: string,
    params: Partial<Omit<Routine, 'id' | 'createdAt'>>,
  ): Promise<Routine> {
    const existing = await this.routineRepository.getById(id);
    if (!existing) {
      throw new NotFoundError(`Rutina con ID ${id} no encontrada`);
    }

    if (params.name !== undefined && params.name.trim() === '') {
      throw new ValidationError('El nombre de la rutina no puede estar vacío', {
        name: ['El nombre no puede estar vacío'],
      });
    }

    const updatedRoutine: Routine = {
      ...existing,
      ...params,
      exercises: params.exercises
        ? params.exercises.map((ex) => {
            if (ex.minReps > ex.maxReps) {
              throw new ValidationError('El rango de repeticiones es inválido (min > max)', {});
            }
            if (ex.targetSets <= 0) {
              throw new ValidationError('El número de series debe ser mayor a 0', {});
            }
            return { ...ex, id: ex.id || generateId() };
          })
        : existing.exercises,
    };

    await this.routineRepository.save(updatedRoutine);
    return updatedRoutine;
  }

  async duplicateRoutine(id: string): Promise<Routine> {
    const existing = await this.routineRepository.getById(id);
    if (!existing) {
      throw new NotFoundError(`Rutina con ID ${id} no encontrada`);
    }

    const duplicatedRoutine: Routine = {
      ...existing,
      id: generateId(),
      name: `${existing.name} (Copia)`,
      createdAt: new Date(),
      exercises: existing.exercises.map((ex) => ({ ...ex, id: generateId() })),
    };

    await this.routineRepository.save(duplicatedRoutine);
    return duplicatedRoutine;
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  async deleteRoutine(id: string): Promise<void> {
    const existing = await this.routineRepository.getById(id);
    if (!existing) {
      throw new NotFoundError(`Rutina con ID ${id} no encontrada`);
    }
    await this.routineRepository.delete(id);
  }
}