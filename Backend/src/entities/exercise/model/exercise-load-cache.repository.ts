export interface CachedWeightSuggestion {
  exerciseId: string;
  recommendedWeight: number;
  basis: 'progressive_overload' | 'last_set' | 'deload' | 'failure_recovery' | 'default';
  lastWeight: number | null;
  lastReps: number | null;
  sessionsAnalyzed: number;
  updatedAt: Date;
}

export interface ExerciseLoadCacheRepository {
  get(exerciseId: string): Promise<CachedWeightSuggestion | null>;
  upsert(suggestion: CachedWeightSuggestion): Promise<void>;
  invalidate(exerciseId: string): Promise<void>;
  invalidateAll(): Promise<void>;
}
