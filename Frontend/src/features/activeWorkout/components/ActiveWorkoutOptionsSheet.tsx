import React, { useCallback, useMemo } from 'react';
import { Alert, Pressable } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Minus, Plus, X, ChevronRight } from 'lucide-react-native';
import { XStack, YStack } from 'tamagui';
import { AppText } from '@/shared/ui/AppText';
import { AppIcon } from '@/shared/ui/AppIcon';
import { useBottomSheetStyles } from '@/ui/hooks/useBottomSheetStyles';
import { BodyAnatomySvg } from '@/shared/ui/BodyAnatomySvg';
import { Collapsible } from '@/shared/ui/Collapsible';
import type { MuscleGroup, ExerciseDTO } from '@shared';
import type { WorkoutExerciseState } from '@/store/useActiveWorkout';

const SHEET_PADDING = 12;
const REST_TIMER_STEP = 15;
const MIN_REST_SECONDS = 15;
const MAX_REST_SECONDS = 300;
const TIMER_CONTROL_SIZE = 44;
const TIMER_LABEL_WIDTH = 52;

interface ReplaceExerciseParams {
  targetId: string;
  filterMuscle: string;
  excludeEquipment: string;
}

interface ActiveWorkoutOptionsSheetProps {
  sheetRef: React.RefObject<BottomSheet | null>;
  routineId: string | null;
  selectedExerciseId: string | null;
  exercises: WorkoutExerciseState[];
  allExercises: ExerciseDTO[];
  globalRestSeconds: number;
  onClose: () => void;
  onOpenExercisePicker: () => void;
  onReplaceExercise: (params: ReplaceExerciseParams) => void;
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
  const { backgroundStyle, handleIndicatorStyle } = useBottomSheetStyles();

  const handleReplaceExercise = useCallback(() => {
    if (!selectedExerciseId) return;
    const selectedExercise = exercises.find((ex: any) => ex.id === selectedExerciseId);
    const exerciseDetails = allExercises.find(ex => ex.id === selectedExercise?.exerciseId);
    onReplaceExercise({
      targetId: selectedExerciseId,
      filterMuscle: exerciseDetails?.primaryMuscles?.[0] ?? '',
      excludeEquipment: exerciseDetails?.equipment ?? '',
    });
  }, [selectedExerciseId, exercises, allExercises, onReplaceExercise]);

  const handleMoveToEnd = useCallback(() => {
    if (selectedExerciseId) onMoveExerciseToEnd(selectedExerciseId);
  }, [selectedExerciseId, onMoveExerciseToEnd]);

  const handleEditRoutine = useCallback(() => {
    if (routineId) onEditRoutine(routineId);
  }, [routineId, onEditRoutine]);

  const handleRemoveExercise = useCallback(() => {
    if (!selectedExerciseId) return;
    Alert.alert(
      '¿Eliminar Ejercicio?',
      'Se borrará permanentemente de este entrenamiento.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => onRemoveExercise(selectedExerciseId) },
      ]
    );
  }, [selectedExerciseId, onRemoveExercise]);

  const handleDecreaseRest = useCallback(() => {
    onSetRestTimerSeconds(Math.max(MIN_REST_SECONDS, globalRestSeconds - REST_TIMER_STEP));
  }, [globalRestSeconds, onSetRestTimerSeconds]);

  const handleIncreaseRest = useCallback(() => {
     onSetRestTimerSeconds(Math.min(MAX_REST_SECONDS, globalRestSeconds + REST_TIMER_STEP));
   }, [globalRestSeconds, onSetRestTimerSeconds]);
 
   const sessionMuscles = useMemo(() => {
     const musclesSet = new Set<MuscleGroup>();
     exercises.forEach(ex => {
       const detail = allExercises.find(a => a.id === ex.exerciseId);
      detail?.primaryMuscles?.forEach((m: any) => musclesSet.add(m));
      detail?.secondaryMuscles?.forEach((m: any) => musclesSet.add(m));
     });
     return Array.from(musclesSet);
   }, [exercises, allExercises]);

   return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={['50%']}
      enablePanDownToClose
      backgroundStyle={backgroundStyle}
      handleIndicatorStyle={handleIndicatorStyle}
    >
      <BottomSheetScrollView contentContainerStyle={{ padding: SHEET_PADDING }}>
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$lg">
          <AppText variant="titleSm">Opciones de Ejercicio</AppText>
          <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Cerrar">
            <AppIcon icon={X} color="textSecondary" size={24} />
          </Pressable>
        </XStack>

        <Pressable onPress={onOpenExercisePicker} accessibilityRole="button" accessibilityLabel="Añadir ejercicio">
          <XStack alignItems="center" borderBottomColor="$borderColor" borderBottomWidth={1} paddingVertical="$md">
            <AppText variant="bodyMd" flex={1}>Añadir ejercicio</AppText>
            <AppIcon icon={ChevronRight} color="textTertiary" size={20} />
          </XStack>
        </Pressable>

        <Pressable onPress={handleReplaceExercise} accessibilityRole="button" accessibilityLabel="Sustituir ejercicio">
          <XStack alignItems="center" borderBottomColor="$borderColor" borderBottomWidth={1} paddingVertical="$md">
            <AppText variant="bodyMd" flex={1}>Sustituir Ejercicio</AppText>
            <AppIcon icon={ChevronRight} color="textTertiary" size={20} />
          </XStack>
        </Pressable>

        <Pressable onPress={handleEditRoutine} accessibilityRole="button" accessibilityLabel="Editar rutina">
          <XStack alignItems="center" borderBottomColor="$borderColor" borderBottomWidth={1} paddingVertical="$md">
            <AppText variant="bodyMd">Editar Rutina</AppText>
          </XStack>
        </Pressable>

        <Pressable onPress={handleMoveToEnd} accessibilityRole="button" accessibilityLabel="Mover al final">
          <XStack alignItems="center" borderBottomColor="$borderColor" borderBottomWidth={1} paddingVertical="$md">
            <AppText variant="bodyMd">Mover al final</AppText>
          </XStack>
        </Pressable>

        <Pressable onPress={handleRemoveExercise} accessibilityRole="button" accessibilityLabel="Eliminar ejercicio">
          <XStack alignItems="center" borderBottomColor="$borderColor" borderBottomWidth={1} paddingVertical="$md">
            <AppText variant="bodyMd" color="danger" fontWeight="700">Eliminar Ejercicio</AppText>
          </XStack>
        </Pressable>

        <XStack alignItems="center" paddingVertical="$md">
          <AppText variant="bodyMd" flex={1}>Timer de descanso</AppText>
          <XStack alignItems="center" gap="$sm">
            <Pressable onPress={handleDecreaseRest} accessibilityRole="button" accessibilityLabel="Reducir timer de descanso">
              <YStack width={TIMER_CONTROL_SIZE} height={TIMER_CONTROL_SIZE} borderRadius={TIMER_CONTROL_SIZE / 2} backgroundColor="$surfaceSecondary" alignItems="center" justifyContent="center">
                <AppIcon icon={Minus} size={14} color="color" />
              </YStack>
            </Pressable>
            <AppText variant="bodyMd" fontWeight="700" width={TIMER_LABEL_WIDTH} textAlign="center">{globalRestSeconds}s</AppText>
            <Pressable onPress={handleIncreaseRest} accessibilityRole="button" accessibilityLabel="Aumentar timer de descanso">
              <YStack width={TIMER_CONTROL_SIZE} height={TIMER_CONTROL_SIZE} borderRadius={TIMER_CONTROL_SIZE / 2} backgroundColor="$surfaceSecondary" alignItems="center" justifyContent="center">
                <AppIcon icon={Plus} size={14} color="color" />
              </YStack>
            </Pressable>
          </XStack>
        </XStack>

        {sessionMuscles.length > 0 && (
          <YStack marginTop="$lg" borderTopWidth={1} borderTopColor="$borderColor" paddingTop="$lg">
            <Collapsible title="Músculos Objetivo de la Sesión">
              <YStack height={200} width="100%" alignItems="center" justifyContent="center">
                <BodyAnatomySvg activeMuscles={sessionMuscles} />
              </YStack>
            </Collapsible>
          </YStack>
        )}
      </BottomSheetScrollView>
    </BottomSheet>
  );
}