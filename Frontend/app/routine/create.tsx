import { XStack, YStack, useTheme } from 'tamagui';
import React, { useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { Plus, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { AppText } from '@/components/ui/AppText';
import { AppInput } from '@/components/ui/AppInput';
import { AppIcon } from '@/components/ui/AppIcon';
import { AppButton, IconButton } from '@/components/ui/AppButton';
import { useRoutineStore } from '@/store/routineStore';
import { RoutineEditorList } from '@/components/routine/RoutineEditorList';
import { useRoutines } from '@/hooks/useRoutines';
import { useSettings } from '@/store/useSettings';
import { createClientId } from '@/utils/clientId';
import { calculateEstimatedDurationMinutes, mapStoreExercisesToPayload } from '@/utils/routine';

export default function CreateRoutineScreen() {
  const theme = useTheme();
  
  const name = useRoutineStore(s => s.name);
  const notes = useRoutineStore(s => s.notes);
  const exercises = useRoutineStore(s => s.exercises);
  const setName = useRoutineStore(s => s.setName);
  const setNotes = useRoutineStore(s => s.setNotes);
  const removeExercise = useRoutineStore(s => s.removeExercise);
  const updateExercise = useRoutineStore(s => s.updateExercise);
  const reorderExercises = useRoutineStore(s => s.reorderExercises);
  const linkExerciseNext = useRoutineStore(s => s.linkExerciseNext);
  const unlinkExercise = useRoutineStore(s => s.unlinkExercise);
  const reset = useRoutineStore(s => s.reset);
  
  const routineService = useRoutines();
  const restTimerSeconds = useSettings(s => s.restTimerSeconds);

  useEffect(() => {
    reset();
    return () => reset();
  }, [reset]);

  const handleSave = useCallback(async () => {
    if (!name.trim()) { 
      Alert.alert('Error', 'Por favor ingresa un nombre para la rutina'); 
      return; 
    }
    if (exercises.length === 0) { 
      Alert.alert('Error', 'Debes agregar al menos un ejercicio'); 
      return; 
    }

    try {
      await routineService.createRoutine({
        name, 
        notes,
        exercises: mapStoreExercisesToPayload(exercises, createClientId),
      });
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch {
      Alert.alert('Error', 'No se pudo guardar la rutina');
    }
  }, [name, exercises, notes, routineService]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background?.val as string }} edges={['top', 'bottom']}>
      <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$lg" height={56}>
        <IconButton icon={<AppIcon icon={X} size={24} color="color" />} onPress={() => router.back()} />
        <AppText variant="titleSm">Nueva Rutina</AppText>
        <AppButton
          appVariant="primary"
          size="sm"
          label="Guardar"
          fullWidth={false}
          onPress={handleSave}
        />
      </XStack>

      <RoutineEditorList
        exercises={exercises}
        onReorder={reorderExercises}
        onRemove={removeExercise}
        onUpdate={updateExercise}
        onLinkNext={linkExerciseNext}
        onUnlink={unlinkExercise}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        listHeaderComponent={
          <YStack marginBottom="$lg">
            <YStack marginBottom="$xl">
              <AppText variant="label" color="textSecondary" marginBottom="$xs">NOMBRE DE LA RUTINA</AppText>
              <AppInput placeholder="Ej. Empuje (Push Day)" value={name} onChangeText={setName} />
              {exercises.length > 0 && (
                <AppText variant="label" color="textTertiary" marginTop="$xs">
                  {`~${calculateEstimatedDurationMinutes(exercises, restTimerSeconds)} min estimados · ${exercises.length} ejercicio${exercises.length !== 1 ? 's' : ''}`}
                </AppText>
              )}
            </YStack>

            <YStack marginBottom="$2xl">
              <AppText variant="label" color="textSecondary" marginBottom="$xs">NOTAS (OPCIONAL)</AppText>
              <AppInput
                placeholder="Descripción breve..."
                multiline
                minHeight={100}
                textAlignVertical="top"
                value={notes}
                onChangeText={setNotes}
              />
            </YStack>

            <AppText variant="titleSm" marginBottom="$md">Ejercicios</AppText>
          </YStack>
        }
        listFooterComponent={
          <YStack marginTop="$lg">
            <AppButton
              appVariant="outline"
              size="md"
              label="Agregar ejercicio"
              icon={<AppIcon icon={Plus} size={18} color="primary" />}
              onPress={() => router.push('/(workouts)/exercise-browser?target=routine')}
            />
          </YStack>
        }
      />
    </SafeAreaView>
  );
}