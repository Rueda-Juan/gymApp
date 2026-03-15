import type { MuscleGroup } from '../valueObjects/MuscleGroup';
import type { Equipment } from '../valueObjects/Equipment';

/**
 * Exercise entity — represents a single exercise in the catalog.
 * Maps to the `exercises` table in SQLite.
 */
export interface Exercise {
  readonly id: string;
  name: string;
  primaryMuscle: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  equipment: Equipment;
  weightIncrement: number;
  animationPath: string | null;
  description: string | null;
  anatomicalRepresentationSvg: string | null;
}
