import { XStack, YStack, useTheme } from 'tamagui';
import React, { useEffect, useCallback } from 'react';
import { TextInput, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import { Save, Plus, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';

import { AppText } from '@/components/ui/AppText';
import { AppInput } from '@/components/ui/AppInput';
import { AppIcon } from '@/components/ui/AppIcon';
import { IconButton } from '@/components/ui/AppButton';
import { useRoutineStore } from '@/store/routineStore';
import { RoutineExerciseRow } from '@/components/cards/routine-exercise-row';
import { useRoutines } from '@/hooks/useRoutines';
import { getExerciseName } from '@/utils/exercise';

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

  useEffect(() => { 
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
        exercises: exercises.map((e, index) => {
          let minReps = 10, maxReps = 10;
          if (e.reps) {
            const parts = String(e.reps).split('-');
            if (parts.length === 2 && !isNaN(Number(parts[0])) && !isNaN(Number(parts[1]))) {
              minReps = Number(parts[0].trim()); 
              maxReps = Number(parts[1].trim());
            } else if (!isNaN(Number(e.reps))) {
              minReps = Number(String(e.reps).trim()); 
              maxReps = minReps;
            }
          }
          return { 
            exerciseId: e.id, 
            orderIndex: index, 
            targetSets: e.sets, 
            minReps, 
            maxReps, 
            restSeconds: null, 
            supersetGroup: e.supersetGroup || null 
          };
        }),
      } as any);
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
        <IconButton 
          icon={<AppIcon icon={Save} size={20} color="background" />} 
          backgroundColor="$primary" 
          onPress={handleSave} 
        />
      </XStack>

      <DraggableFlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        onDragEnd={({ data }) => { 
          reorderExercises(data); 
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); 
        }}
        ListHeaderComponent={
          <YStack marginBottom="$lg">
            <YStack marginBottom="$xl">
              <AppText variant="label" color="textSecondary" marginBottom="$xs">NOMBRE DE LA RUTINA</AppText>
              <AppInput placeholder="Ej. Empuje (Push Day)" value={name} onChangeText={setName} />
            </YStack>

            <YStack marginBottom="$2xl">
              <AppText variant="label" color="textSecondary" marginBottom="$xs">NOTAS (OPCIONAL)</AppText>
              <TextInput
                style={{
                  height: 100, 
                  borderRadius: 12, 
                  paddingHorizontal: 12, 
                  paddingTop: 12,
                  backgroundColor: theme.surfaceSecondary?.val as string, 
                  borderWidth: 1, 
                  borderColor: theme.borderColor?.val as string,
                  color: theme.color?.val as string, 
                  fontSize: 16, 
                  textAlignVertical: 'top',
                }}
                placeholder="Descripción breve..."
                placeholderTextColor={theme.textTertiary?.val as string}
                multiline
                value={notes}
                onChangeText={setNotes}
              />
            </YStack>

            <XStack justifyContent="space-between" alignItems="center" marginBottom="$md">
              <AppText variant="titleSm">Ejercicios</AppText>
              <Pressable onPress={() => router.push('/(workouts)/exercise-browser?target=routine')}>
                <XStack alignItems="center" gap="$xs" padding="$xs">
                  <AppIcon icon={Plus} size={18} color="primary" />
                  <AppText variant="bodyMd" color="primary" fontWeight="600">Agregar</AppText>
                </XStack>
              </Pressable>
            </XStack>
          </YStack>
        }
        renderItem={({ item, getIndex, drag, isActive }) => {
          const index = getIndex() ?? 0;
          const isLinkedNext = index < exercises.length - 1 && exercises[index]?.supersetGroup != null && exercises[index].supersetGroup === exercises[index + 1]?.supersetGroup;
          const isLinkedPrev = index > 0 && exercises[index]?.supersetGroup != null && exercises[index].supersetGroup === exercises[index - 1]?.supersetGroup;

          return (
            <ScaleDecorator>
              <RoutineExerciseRow
                exerciseName={getExerciseName(item)}
                muscleGroup={item.muscle}
                sets={item.sets}
                reps={item.reps}
                onRemove={() => removeExercise(item.id)}
                onUpdateSets={(s) => updateExercise(item.id, s, item.reps)}
                onUpdateReps={(r) => updateExercise(item.id, item.sets, r)}
                drag={drag}
                isActive={isActive}
                isLinkedNext={isLinkedNext}
                isLinkedPrev={isLinkedPrev}
                onLinkNext={() => linkExerciseNext(index)}
                onUnlink={() => unlinkExercise(index)}
              />
            </ScaleDecorator>
          );
        }}
        ListEmptyComponent={
          <YStack padding="$4xl" alignItems="center">
            <AppText variant="bodyMd" color="textSecondary" textAlign="center">
              Aún no has agregado ejercicios a esta rutina.
            </AppText>
          </YStack>
        }
      />
    </SafeAreaView>
  );
}