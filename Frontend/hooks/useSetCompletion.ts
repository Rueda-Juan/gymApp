import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';
import { useActiveWorkout } from '@/store/useActiveWorkout';
import { useRestTimer } from '@/store/useRestTimer';
import { useSettings } from '@/store/useSettings';
import { useWorkout } from './useWorkout';

interface SetCompletionResult {
  isPR?: boolean;
  exerciseName?: string;
}

/**
 * useSetCompletion — Encapsula la lógica de completar un set
 *
 * Responsabilidades:
 * - Registrar el set en el backend
 * - Trigger haptic feedback
 * - Iniciar timer de descanso
 * - Detectar personal records
 * - Manejar errores y feedback al usuario
 */
export function useSetCompletion() {
  const workoutId = useActiveWorkout(s => s.workoutId);
  const exercises = useActiveWorkout(s => s.exercises);
  const toggleSetComplete = useActiveWorkout(s => s.toggleSetComplete);
  const updateSetValues = useActiveWorkout(s => s.updateSetValues);
  const workoutService = useWorkout();
  const { startTimer } = useRestTimer();
  const restTimerSeconds = useSettings(s => s.restTimerSeconds);

  const completeSet = useCallback(
    async (
      exerciseId: string,
      setId: string,
      currentlyCompleted: boolean
    ): Promise<SetCompletionResult> => {
      // UI: marca el set como completado (optimistic update)
      toggleSetComplete(exerciseId, setId);

      if (currentlyCompleted) {
        return {};
      }

      // Obtener datos del set para registro
      const exercise = exercises.find(ex => ex.id === exerciseId);
      if (!exercise || !workoutId) return {};

      const setIndex = exercise.sets.findIndex(s => s.id === setId);
      const set = exercise.sets[setIndex];

      if (!set) return {};

      // Auto-fill weight from previous set if current weight is empty/0
      if (set.weight <= 0 && setIndex > 0) {
        const previousSet = exercise.sets[setIndex - 1];
        if (previousSet && previousSet.weight > 0) {
          updateSetValues(exerciseId, setId, { weight: previousSet.weight });
        }
      }

      const finalWeight = set.weight > 0 ? set.weight : (exercise.sets[setIndex - 1]?.weight ?? 0);

      try {
        // Backend: registrar el set
        const workoutSet = {
          id: set.id,
          exerciseId: exercise.exerciseId,
          setNumber: setIndex + 1,
          weight: finalWeight,
          reps: set.reps,
          setType: (set as any).type || 'normal',
          rir: set.rir ?? null,
          restSeconds: null,
          durationSeconds: 0,
          completed: true,
          skipped: false,
          createdAt: new Date(),
        };

        const result = await workoutService.recordSet(workoutId, workoutSet);

        // Haptic feedback
        if (process.env.EXPO_OS === 'ios') {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }

        // Iniciar timer de descanso automáticamente con duración configurada
        startTimer(restTimerSeconds);
        router.push('/(workouts)/rest-timer');

        // Detectar personal records
        const isPR = (result?.newRecords ?? []).length > 0;
        if (isPR) {
          if (process.env.EXPO_OS === 'ios') {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          }
          Toast.show({
            type: 'success',
            text1: '🏆 ¡Nuevo PR!',
            text2: `${exercise.name} · ${finalWeight}kg x${set.reps}`,
            position: 'top',
          });
        }

        return { isPR, exerciseName: exercise.name };
      } catch (error) {
        // Rollback: marcar el set como no completado si falla
        toggleSetComplete(exerciseId, setId);

        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'No se pudo registrar el set',
          position: 'top',
        });

        console.error('[useSetCompletion] Error recording set:', error);
        return {};
      }
    },
    [workoutId, exercises, toggleSetComplete, workoutService, startTimer, restTimerSeconds]
  );

  return { completeSet };
}
