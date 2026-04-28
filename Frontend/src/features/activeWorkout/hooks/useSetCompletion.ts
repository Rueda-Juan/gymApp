import { useCallback } from "react";
import { router } from "expo-router";
import { useActiveWorkout } from "@/entities/workout";
import { useRestTimer } from "../model/useRestTimer";
import { useSettings } from "@/entities/settings";
import { triggerMediumHaptic } from "@/shared/lib/haptics";
import Toast from "react-native-toast-message";
import { useAchievementEvaluator } from "@/entities/stats";

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
  const toggleSetComplete = useActiveWorkout((s) => s.toggleSetComplete);
  const updateSetValues = useActiveWorkout((s) => s.updateSetValues);
  const { startTimer } = useRestTimer();
  const restTimerSeconds = useSettings((s) => s.restTimerSeconds);
  const { evaluateSet } = useAchievementEvaluator();

  const completeSet = useCallback(
    (
      exerciseId: string,
      setId: string,
      currentlyCompleted: boolean,
      exercise: ExerciseForCompletion,
      shouldStartRestTimer = true,
    ): void => {
      toggleSetComplete(exerciseId, setId);

      if (currentlyCompleted) return;

      const setIndex = exercise.sets.findIndex((s) => s.id === setId);
      const set = exercise.sets[setIndex];
      if (!set) return;

      const hasManualValues = set.weight > 0 || set.reps > 0;
      if (!hasManualValues && setIndex > 0) {
        const previousSet = exercise.sets[setIndex - 1];
        if (previousSet && (previousSet.weight > 0 || previousSet.reps > 0)) {
          updateSetValues(exerciseId, setId, {
            weight: previousSet.weight,
            reps: previousSet.reps,
          });
        }
      }

      triggerMediumHaptic();

      const finalWeight =
        !hasManualValues &&
        setIndex > 0 &&
        exercise.sets[setIndex - 1].weight > 0
          ? exercise.sets[setIndex - 1].weight
          : set.weight;
      const finalReps =
        !hasManualValues && setIndex > 0 && exercise.sets[setIndex - 1].reps > 0
          ? exercise.sets[setIndex - 1].reps
          : set.reps;

      // Trigger asíncrono para evaluar Récord Personal en caliente (PLAN-C)
      if (finalWeight > 0 && finalReps > 0) {
        evaluateSet(exerciseId, {
          id: set.id,
          weight: finalWeight,
          reps: finalReps,
          completed: true,
          createdAt: new Date(),
        } as any).then((brokenRecords: any[]) => {
          if (brokenRecords && brokenRecords.length > 0) {
            const typesMap: Record<string, string> = {
              max_weight: "¡Nuevo Récord de Peso!",
              max_reps: "¡Nuevo Récord de Reps!",
              max_volume: "¡Nuevo Récord de Volumen!",
              estimated_1rm: "¡Nuevo 1RM Estimado!",
            };
            const bestRecord =
              brokenRecords.find((r: any) => r.recordType === "max_weight") ||
              brokenRecords[0];
            Toast.show({
              type: "success",
              text1: typesMap[bestRecord.recordType],
              text2: `Alcanzaste ${bestRecord.value} en la última serie.`,
              position: "top",
              visibilityTime: 4000,
            });
          }
        });
      }

      if (shouldStartRestTimer) {
        startTimer(restTimerSeconds);
        router.push("/(workouts)/rest-timer");
      }
    },
    [
      toggleSetComplete,
      updateSetValues,
      startTimer,
      restTimerSeconds,
      evaluateSet,
    ],
  );

  return { completeSet };
}
