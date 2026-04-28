import type { ExerciseRepository } from '@entities/exercise';
import type { WorkoutRepository } from '@entities/workout';
import type { Exercise } from '@entities/exercise';
import type { WorkoutSet } from '@entities/workout';
import { generateId } from '@core/utils/generate-id';
import { validateCustomExerciseInput } from './exercise.schemas';
import { ValidationError, NotFoundError } from '@core/errors/errors';

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

export function generateExerciseKey(name: string, isCustom: boolean): string {
  const normalizedName = name
    .toLowerCase()
    .trim()
    .replace(/['\u2019]/g, '')
    .replace(/[\s-]+/g, '_');

  return isCustom ? `custom_${normalizedName}` : normalizedName;
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export class ExerciseService {
  constructor(
    private readonly exerciseRepository: ExerciseRepository,
    private readonly workoutRepository: WorkoutRepository,
  ) {}

  // ── Create ────────────────────────────────────────────────────────────────

  async createExercise(params: Omit<Exercise, 'id'>): Promise<Exercise> {
    if (params.isCustom) {
      validateCustomExerciseInput({
        name: params.name,
        primaryMuscles: params.primaryMuscles,
        secondaryMuscles: params.secondaryMuscles,
        equipment: params.equipment,
        exerciseType: params.exerciseType,
        loadType: params.loadType,
        description: params.description,
      });
    } else if (!params.name || params.name.trim() === '') {
      throw new ValidationError('El nombre del ejercicio es requerido', {
        name: ['El nombre del ejercicio es requerido'],
      });
    }

    const exerciseKey = generateExerciseKey(params.name, params.isCustom);

    const existingWithKey = await this.exerciseRepository.getByKey(exerciseKey);
    if (existingWithKey) {
      throw new ValidationError('Ya existe un ejercicio con ese nombre', {
        name: ['Ya existe un ejercicio con ese nombre'],
      });
    }

    const newExercise: Exercise = {
      ...params,
      id: generateId(),
      exerciseKey,
    };

    await this.exerciseRepository.save(newExercise);
    return newExercise;
  }

  // ── Read ──────────────────────────────────────────────────────────────────

  async getExercises(): Promise<Exercise[]> {
    return this.exerciseRepository.getAll();
  }

  async getExerciseById(id: string): Promise<Exercise | null> {
    return this.exerciseRepository.getById(id);
  }

  async getExerciseHistory(exerciseId: string, limit: number = 20): Promise<WorkoutSet[]> {
    return this.workoutRepository.getExerciseHistory(exerciseId, limit);
  }

  async getPreviousSets(exerciseId: string): Promise<WorkoutSet[]> {
    return this.workoutRepository.getPreviousSets(exerciseId);
  }

  // ── Update ────────────────────────────────────────────────────────────────

  async updateExercise(id: string, params: Partial<Omit<Exercise, 'id'>>): Promise<Exercise> {
    const existing = await this.exerciseRepository.getById(id);
    if (!existing) {
      throw new NotFoundError(`Ejercicio con ID ${id} no encontrado`);
    }

    if (params.name !== undefined && params.name.trim() === '') {
      throw new ValidationError('El nombre del ejercicio no puede estar vacío', {
        name: ['El nombre no puede estar vacío'],
      });
    }

    let exerciseKey = existing.exerciseKey;
    if (params.name && params.name !== existing.name) {
      exerciseKey = generateExerciseKey(params.name, existing.isCustom);
      const existingWithKey = await this.exerciseRepository.getByKey(exerciseKey);
      if (existingWithKey && existingWithKey.id !== id) {
        throw new ValidationError('Ya existe un ejercicio con ese nombre', {
          name: ['Ya existe un ejercicio con ese nombre'],
        });
      }
    }

    if (existing.isCustom && (params.name || params.primaryMuscles || params.exerciseType)) {
      validateCustomExerciseInput({
        name: params.name ?? existing.name,
        primaryMuscles: params.primaryMuscles ?? existing.primaryMuscles,
        secondaryMuscles: params.secondaryMuscles ?? existing.secondaryMuscles,
        equipment: params.equipment ?? existing.equipment,
        exerciseType: params.exerciseType ?? existing.exerciseType,
        loadType: params.loadType ?? existing.loadType,
        description: params.description ?? existing.description,
      });
    }

    const updatedExercise: Exercise = {
      ...existing,
      ...params,
      exerciseKey,
    };

    await this.exerciseRepository.save(updatedExercise);
    return updatedExercise;
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  async deleteExercise(id: string): Promise<void> {
    const existing = await this.exerciseRepository.getById(id);
    if (!existing) {
      throw new NotFoundError(`Ejercicio con ID ${id} no encontrado`);
    }

    const inUse = await this.exerciseRepository.isInUse(id);

    if (inUse) {
      if (existing.isCustom) {
        await this.exerciseRepository.archive(id);
        return;
      }
      throw new ValidationError(
        'No se puede eliminar un ejercicio del catálogo que está en uso',
        { general: ['En uso'] },
      );
    }

    await this.exerciseRepository.delete(id);
  }
}
