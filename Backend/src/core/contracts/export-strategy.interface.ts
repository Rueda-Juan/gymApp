import type { Workout } from '@entities/workout';

export interface ExportOptions {
  routineName?: string;
}

/**
 * Interface for strategies that export a workout into a specific string format.
 */
export interface IExportStrategy {
  /**
   * Generates the exported representation of a Workout.
   */
  export(workout: Workout, options?: ExportOptions): string;
}
