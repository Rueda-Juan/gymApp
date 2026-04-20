export type ID = string;
export type ISODate = string;

export interface ExerciseDTO {
  id: ID;
  name: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: 'barbell' | 'dumbbell' | 'machine' | 'cable' | 'bodyweight' | 'band' | 'other';
  type: 'compound' | 'isolation';
  loadType: 'weighted' | 'bodyweight' | 'assisted' | 'timed';
}

export interface CreateExerciseDTO {
  name: string;
  primaryMuscles: string[];
  secondaryMuscles?: string[];
  equipment: string;
  type: 'compound' | 'isolation';
  loadType: 'weighted' | 'bodyweight' | 'assisted' | 'timed';
}
