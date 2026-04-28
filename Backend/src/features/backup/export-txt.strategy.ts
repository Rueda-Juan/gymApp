import type { Workout } from '@entities/workout';
import type { IExportStrategy, ExportOptions } from '@core/contracts/export-strategy.interface';

/**
 * Strategy for exporting a workout to a structured TXT format.
 * Format:
 * (Name_routine)
 * (Name_exercise)
 * (Set_No)(Reps)(Kg)
 */
export class ExportTXTStrategy implements IExportStrategy {
  export(workout: Workout, options?: ExportOptions): string {
    const lines: string[] = [];

    // Header
    const routineName = options?.routineName || 'Sesión Vacía';
    lines.push(`(${routineName})`);

    // Grouping valid, non-skipped exercises
    const validExercises = workout.exercises.filter(ex => !ex.skipped && ex.sets.length > 0);

    for (const exercise of validExercises) {
      const exerciseName = exercise.nameEs || exercise.name || 'Ejercicio Desconocido';
      lines.push(`(${exerciseName})`);

      // Sets
      const completedSets = exercise.sets.filter(s => s.completed && !s.skipped);
      
      for (let i = 0; i < completedSets.length; i++) {
        const set = completedSets[i]!;
        // Assuming user input "10" reps, "50" kg
        lines.push(`(${i + 1})(${set.reps})(${set.weight})`);
      }
    }

    return lines.join('\n');
  }
}
