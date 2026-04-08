import type { ExerciseRepository } from '../../../domain/repositories/ExerciseRepository';
import { generateId } from '../../../shared/utils/generateId';
import { ValidationError } from '../../../shared/errors';
import type { Exercise } from '../../../domain/entities/Exercise';
import { validateCustomExerciseInput } from '../../../shared/schemas/exerciseSchemas';

export function generateExerciseKey(name: string, isCustom: boolean): string {
  const normalizedName = name
    .toLowerCase()
    .trim()
    .replace(/['\u2019]/g, '')
    .replace(/[\s-]+/g, '_');

  return isCustom ? `custom_${normalizedName}` : normalizedName;
}

export class CreateExerciseUseCase {
  constructor(private readonly exerciseRepository: ExerciseRepository) {}

  async execute(params: Omit<Exercise, 'id'>): Promise<Exercise> {
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
}
