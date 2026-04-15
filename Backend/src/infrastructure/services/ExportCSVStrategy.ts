import type { Workout } from '../../domain/entities/Workout';
import type { IExportStrategy, ExportOptions } from '../../domain/interfaces/IExportStrategy';

/**
 * Strategy for exporting a workout to a CSV format.
 * Format:
 * RoutineName,Exercise,Set,Weight,Reps,PartialReps,RIR,Rest
 */
export class ExportCSVStrategy implements IExportStrategy {
  export(workout: Workout, options?: ExportOptions): string {
    const lines: string[] = [];

    // Header
    lines.push('Routine,Exercise,Set,Weight,Reps,PartialReps,RIR,RestSeconds');

    const routineName = options?.routineName || 'Sesión Vacía';

    const validExercises = workout.exercises.filter(ex => !ex.skipped && ex.sets.length > 0);

    for (const exercise of validExercises) {
      const exerciseName = exercise.nameEs || exercise.name || 'Unknown';
      // Escaping commas in names
      const safeRoutineName = `"${routineName.replace(/"/g, '""')}"`;
      const safeExerciseName = `"${exerciseName.replace(/"/g, '""')}"`;

      const completedSets = exercise.sets.filter(s => s.completed && !s.skipped);
      
      for (let i = 0; i < completedSets.length; i++) {
        const set = completedSets[i]!;
        const partials = set.partialReps ?? 0;
        const rir = set.rir !== null ? set.rir : '';
        const rest = set.restSeconds !== null ? set.restSeconds : '';

        lines.push(`${safeRoutineName},${safeExerciseName},${i + 1},${set.weight},${set.reps},${partials},${rir},${rest}`);
      }
    }

    return lines.join('\n');
  }
}
