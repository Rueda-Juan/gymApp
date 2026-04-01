import React from 'react';
import { Alert, Pressable } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Minus, Plus, X, ChevronRight } from 'lucide-react-native';
import { XStack, YStack, useTheme } from 'tamagui';
import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import type { Exercise } from 'backend/shared/types';
import type { WorkoutExerciseState } from '@/store/useActiveWorkout';

interface ActiveWorkoutOptionsSheetProps {
  sheetRef: React.RefObject<BottomSheet | null>;
  routineId: string | null;
  selectedExerciseId: string | null;
  exercises: WorkoutExerciseState[];
  allExercises: Exercise[];
  globalRestSeconds: number;
  onClose: () => void;
  onOpenExercisePicker: () => void;
  onReplaceExercise: (params: { targetId: string; filterMuscle: string; excludeEquipment: string }) => void;
  onEditRoutine: (routineId: string) => void;
  onMoveExerciseToEnd: (exerciseId: string) => void;
  onRemoveExercise: (exerciseId: string) => void;
  onSetRestTimerSeconds: (seconds: number) => void;
}

export function ActiveWorkoutOptionsSheet({
  sheetRef,
  routineId,
  selectedExerciseId,
  exercises,
  allExercises,
  globalRestSeconds,
  onClose,
  onOpenExercisePicker,
  onReplaceExercise,
  onEditRoutine,
  onMoveExerciseToEnd,
  onRemoveExercise,
  onSetRestTimerSeconds,
}: ActiveWorkoutOptionsSheetProps) {
  const theme = useTheme();

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={['50%']}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: theme.surfaceSecondary?.val as string }}
      handleIndicatorStyle={{ backgroundColor: theme.textTertiary?.val as string }}
    >
      <BottomSheetScrollView contentContainerStyle={{ padding: 12 }}>
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$lg">
          <AppText variant="titleSm">Opciones de Ejercicio</AppText>
          <Pressable onPress={onClose} accessibilityLabel="Cerrar">
            <AppIcon icon={X} color="textSecondary" size={24} />
          </Pressable>
        </XStack>

        <Pressable onPress={onOpenExercisePicker}>
          <XStack alignItems="center" borderBottomColor="$borderColor" borderBottomWidth={1} paddingVertical="$md">
            <AppText variant="bodyMd" flex={1}>Añadir ejercicio</AppText>
            <AppIcon icon={ChevronRight} color="textTertiary" size={20} />
          </XStack>
        </Pressable>

        <Pressable
          onPress={() => {
            if (!selectedExerciseId) return;
            const selectedExercise = exercises.find((exercise) => exercise.id === selectedExerciseId);
            const exerciseDetails = allExercises.find((exercise) => exercise.id === selectedExercise?.exerciseId);
            onReplaceExercise({
              targetId: selectedExerciseId,
              filterMuscle: exerciseDetails?.primaryMuscles?.[0] || '',
              excludeEquipment: exerciseDetails?.equipment || '',
            });
          }}
        >
          <XStack alignItems="center" borderBottomColor="$borderColor" borderBottomWidth={1} paddingVertical="$md">
            <AppText variant="bodyMd" flex={1}>Sustituir Ejercicio</AppText>
            <AppIcon icon={ChevronRight} color="textTertiary" size={20} />
          </XStack>
        </Pressable>

        <Pressable
          onPress={() => {
            if (routineId) onEditRoutine(routineId);
          }}
        >
          <XStack alignItems="center" borderBottomColor="$borderColor" borderBottomWidth={1} paddingVertical="$md">
            <AppText variant="bodyMd">Editar Rutina</AppText>
          </XStack>
        </Pressable>

        <Pressable
          onPress={() => {
            if (selectedExerciseId) onMoveExerciseToEnd(selectedExerciseId);
          }}
        >
          <XStack alignItems="center" borderBottomColor="$borderColor" borderBottomWidth={1} paddingVertical="$md">
            <AppText variant="bodyMd">Mover al final</AppText>
          </XStack>
        </Pressable>

        <Pressable
          onPress={() => {
            if (!selectedExerciseId) return;
            Alert.alert('¿Eliminar Ejercicio?', 'Se borrará permanentemente de este entrenamiento.', [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Eliminar', style: 'destructive', onPress: () => onRemoveExercise(selectedExerciseId) },
            ]);
          }}
        >
          <XStack alignItems="center" borderBottomColor="$borderColor" borderBottomWidth={1} paddingVertical="$md">
            <AppText variant="bodyMd" color="danger" fontWeight="700">Eliminar Ejercicio</AppText>
          </XStack>
        </Pressable>

        <XStack alignItems="center" paddingVertical="$md">
          <AppText variant="bodyMd" flex={1}>Timer de descanso</AppText>
          <XStack alignItems="center" gap="$sm">
            <Pressable
              onPress={() => onSetRestTimerSeconds(Math.max(15, globalRestSeconds - 15))}
              accessibilityLabel="Reducir timer de descanso"
            >
              <YStack width={32} height={32} borderRadius={16} backgroundColor="$surfaceSecondary" alignItems="center" justifyContent="center">
                <AppIcon icon={Minus} size={14} color="color" />
              </YStack>
            </Pressable>
            <AppText variant="bodyMd" fontWeight="700" width={52} textAlign="center">{globalRestSeconds}s</AppText>
            <Pressable
              onPress={() => onSetRestTimerSeconds(Math.min(300, globalRestSeconds + 15))}
              accessibilityLabel="Aumentar timer de descanso"
            >
              <YStack width={32} height={32} borderRadius={16} backgroundColor="$surfaceSecondary" alignItems="center" justifyContent="center">
                <AppIcon icon={Plus} size={14} color="color" />
              </YStack>
            </Pressable>
          </XStack>
        </XStack>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}