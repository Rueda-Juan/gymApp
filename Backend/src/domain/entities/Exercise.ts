import type { MuscleGroup } from '../valueObjects/MuscleGroup';
import type { Equipment } from '../valueObjects/Equipment';

/** Classification of an exercise by number of joints/muscles involved. */
export type ExerciseType = 'compound' | 'isolation';

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
}
