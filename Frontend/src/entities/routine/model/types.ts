import type { RoutineWithLastPerformed as SharedRoutineWithLastPerformed, RoutineExercise } from '@kernel';

export interface RoutineWithLastPerformed extends SharedRoutineWithLastPerformed {
  lastPerformed?: string | null;
  exercises: RoutineExercise[];
}
