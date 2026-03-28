import { useCallback, useMemo } from 'react';
import { useActiveWorkout } from '@/store/useActiveWorkout';

/**
 * useSupersetNavigation — Maneja la navegación inteligente en supersets
 *
 * Responsabilidades:
 * - Detectar si un ejercicio pertenece a un superset
 * - Calcular el siguiente ejercicio (respetando orden de superset)
 * - Determinar si se completó el superset (todos los ejercicios con sets completos)
 * - Autoavanzar al siguiente ejercicio cuando se completa el superset
 */
export function useSupersetNavigation() {
  const exercises = useActiveWorkout(s => s.exercises);
  const currentExerciseIndex = useActiveWorkout(s => s.currentExerciseIndex);
  const setCurrentExercise = useActiveWorkout(s => s.setCurrentExercise);

  /**
   * Obtiene el índice del próximo ejercicio en el orden de superset,
   * o el siguiente ejercicio global si no hay superset.
   */
  const getNextExerciseIndex = useCallback((fromIndex: number): number | null => {
    if (fromIndex >= exercises.length - 1) return null;

    const currentEx = exercises[fromIndex];
    const isSupersetEx = currentEx.supersetGroup != null;

    if (!isSupersetEx) {
      // No superset: siguiente ejercicio simple
      return fromIndex + 1;
    }

    // En superset: encontrar el siguiente en el grupo
    const supersetIndices = exercises
      .map((ex, i) => (ex.supersetGroup === currentEx.supersetGroup ? i : -1))
      .filter(i => i !== -1)
      .sort((a, b) => a - b);

    const currentPos = supersetIndices.indexOf(fromIndex);
    if (currentPos === -1) return fromIndex + 1;

    const nextPosInGroup = currentPos + 1;
    if (nextPosInGroup < supersetIndices.length) {
      // Próximo en el grupo
      return supersetIndices[nextPosInGroup];
    }

    // Fin del grupo: siguiente ejercicio global
    const lastIndexInGroup = supersetIndices[supersetIndices.length - 1];
    return lastIndexInGroup < exercises.length - 1 ? lastIndexInGroup + 1 : null;
  }, [exercises]);

  /**
   * Verifica si todos los ejercicios en el superset (o grupo actual)
   * tienen todos sus sets completados.
   */
  const isCurrentGroupCompleted = useCallback((): boolean => {
    const currentEx = exercises[currentExerciseIndex];
    if (!currentEx) return false;

    const isSupersetEx = currentEx.supersetGroup != null;

    if (!isSupersetEx) {
      // No superset: verificar solo este ejercicio
      return currentEx.sets.every(s => s.isCompleted);
    }

    // En superset: verificar todos los ejercicios del grupo
    const groupExercises = exercises.filter(
      ex => ex.supersetGroup === currentEx.supersetGroup
    );

    return groupExercises.every(ex => ex.sets.every(s => s.isCompleted));
  }, [exercises, currentExerciseIndex]);

  /**
   * Calcula los ejercicios que deben destacarse (pertenecen al superset actual).
   */
  const supersetGroupExercises = useMemo(() => {
    const currentEx = exercises[currentExerciseIndex];
    if (!currentEx || currentEx.supersetGroup == null) {
      return [currentExerciseIndex];
    }

    return exercises
      .map((ex, i) => (ex.supersetGroup === currentEx.supersetGroup ? i : -1))
      .filter(i => i !== -1);
  }, [exercises, currentExerciseIndex]);

  /**
   * Avanza al siguiente ejercicio si es posible.
   */
  const moveToNextExercise = useCallback(() => {
    const nextIndex = getNextExerciseIndex(currentExerciseIndex);
    if (nextIndex !== null) {
      setCurrentExercise(nextIndex);
    }
  }, [currentExerciseIndex, getNextExerciseIndex, setCurrentExercise]);

  return {
    getNextExerciseIndex,
    isCurrentGroupCompleted,
    supersetGroupExercises,
    moveToNextExercise,
  };
}
