import type { MuscleGroup } from '../valueObjects/MuscleGroup';
import type { Equipment } from '../valueObjects/Equipment';

/** Classification of an exercise by number of joints/muscles involved. */
export type ExerciseType = 'compound' | 'isolation';

/** How an exercise tracks/progresses its load. */
export type LoadType = 'weighted' | 'bodyweight' | 'assisted' | 'timed';

/**
 * Exercise entity — represents a single exercise in the catalog.
 * Maps to the `exercises` table in SQLite.
 */
export interface Exercise {
  readonly id: string;
  name: string;
  nameEs: string | null;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  equipment: Equipment;
  exerciseType: ExerciseType;
  weightIncrement: number;
  animationPath: string | null;
  description: string | null;
  anatomicalRepresentationSvg: string | null;
  exerciseKey: string;
  isCustom: boolean;
  createdBy: string | null;
  loadType: LoadType;
  isArchived: boolean;
}
