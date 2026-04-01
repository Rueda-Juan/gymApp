import { useCallback } from 'react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useActiveWorkout } from '@/store/useActiveWorkout';
import { useRestTimer } from '@/store/useRestTimer';
import { useSettings } from '@/store/useSettings';

/**
 * useSetCompletion — Encapsula la lógica de completar un set.
 *
 * Persistencia diferida: los sets NO se guardan en backend al completarse.
 * Todo el estado vive en Zustand hasta que el usuario finaliza el workout,
 * momento en que RecordAllSetsUseCase hace el batch insert en una transacción.
 *
 * Responsabilidades:
 * - Toggle optimista en Zustand
 * - Haptic feedback
 * - Iniciar rest timer automático
 * - Auto-fill de peso desde set anterior (si el campo está vacío)
 */
interface ExerciseForCompletion {
  sets: { id: string; weight: number; reps: number; isCompleted: boolean }[];
}

export function useSetCompletion() {
  const toggleSetComplete = useActiveWorkout(s => s.toggleSetComplete);
  const updateSetValues = useActiveWorkout(s => s.updateSetValues);
  const { startTimer } = useRestTimer();
  const restTimerSeconds = useSettings(s => s.restTimerSeconds);

  const completeSet = useCallback(
    async (
      exerciseId: string,
      setId: string,
      currentlyCompleted: boolean,
      exercise: ExerciseForCompletion,
      shouldStartRestTimer: boolean = true,
    ): Promise<void> => {
      toggleSetComplete(exerciseId, setId);

      if (currentlyCompleted) return;

      const setIndex = exercise.sets.findIndex(s => s.id === setId);
      const set = exercise.sets[setIndex];
      if (!set) return;

      const hasManualValues = set.weight > 0 || set.reps > 0;
      if (!hasManualValues && setIndex > 0) {
        const previousSet = exercise.sets[setIndex - 1];
        if (previousSet && (previousSet.weight > 0 || previousSet.reps > 0)) {
          updateSetValues(exerciseId, setId, { weight: previousSet.weight, reps: previousSet.reps });
        }
      }

      if (Platform.OS !== 'web') {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      if (shouldStartRestTimer) {
        startTimer(restTimerSeconds);
        router.push('/(workouts)/rest-timer');
      }
    },
    [toggleSetComplete, updateSetValues, startTimer, restTimerSeconds],
  );

  return { completeSet };
}

