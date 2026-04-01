import { XStack, YStack, useTheme } from 'tamagui';
import React, { useEffect, useState, useCallback } from 'react';
import { Pressable, Alert, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Plus, X, Trash2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { AppText } from '@/components/ui/AppText';
import { AppInput } from '@/components/ui/AppInput';
import { AppIcon } from '@/components/ui/AppIcon';
import { AppButton, IconButton } from '@/components/ui/AppButton';
import { Screen } from '@/components/ui/Screen';
import { useRoutineStore } from '@/store/routineStore';
import { RoutineEditorList } from '@/components/routine/RoutineEditorList';
import { useRoutines } from '@/hooks/useRoutines';
import { useSettings } from '@/store/useSettings';
import { calculateEstimatedDurationMinutes, mapStoreExercisesToPayload } from '@/utils/routine';

export default function EditRoutineScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
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
  const loadRoutine = useRoutineStore(s => s.loadRoutine);
  
  const routineService = useRoutines();
  const restTimerSeconds = useSettings(s => s.restTimerSeconds);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchRoutine = useCallback(async () => {
    try {
      const routine = await routineService.getRoutineById(id as string);
      if (routine) {
        loadRoutine(routine);
      } else { 
        Alert.alert('Error', 'No se encontró la rutina'); 
        router.back(); 
      }
    } catch {
      Alert.alert('Error', 'No se pudo cargar la rutina');
    } finally { 
      setLoading(false); 
    }
  }, [id, routineService, loadRoutine]);

  useEffect(() => { 
    if (id) fetchRoutine(); 
  }, [id, fetchRoutine]);

  const handleUpdate = useCallback(async () => {
    if (!name.trim()) { 
      Alert.alert('Error', 'El nombre no puede estar vacío'); 
      return; 
    }
    if (isSaving) return;
    setIsSaving(true);
    try {
      await routineService.updateRoutine(id as string, {
        name,
        notes,
        exercises: mapStoreExercisesToPayload(exercises),
      });
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch { 
      Alert.alert('Error', 'No se pudo actualizar la rutina'); 
    } finally {
      setIsSaving(false);
    }
  }, [name, exercises, id, routineService, notes, isSaving]);

  const handleDelete = () => {
    if (loading) return;
    Alert.alert('Eliminar Rutina', '¿Estás seguro de que quieres eliminar esta rutina?', [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Eliminar', 
        style: 'destructive', 
        onPress: async () => {
          try { 
            await routineService.deleteRoutine(id as string); 
            router.back(); 
          } catch { 
            Alert.alert('Error', 'No se pudo eliminar'); 
          }
        }
      },
    ]);
  };

  if (loading) {
    return (
      <Screen>
        <YStack flex={1} alignItems="center" justifyContent="center">
          <ActivityIndicator size="large" color={theme.primary?.val as string} />
        </YStack>
      </Screen>
    );
  }

  return (
    <Screen safeAreaEdges={['top', 'left', 'right']}>
      <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$lg" height={56}>
        <IconButton icon={<AppIcon icon={X} size={24} color="color" />} onPress={() => router.back()} />
        <AppText variant="titleSm" numberOfLines={1} flex={1} textAlign="center" paddingHorizontal="$md">
          {name}
        </AppText>
        <AppButton
          appVariant="primary"
          size="sm"
          label="Guardar"
          fullWidth={false}
          onPress={handleUpdate}
        />
      </XStack>

      <RoutineEditorList
        exercises={exercises}
        onReorder={reorderExercises}
        onRemove={removeExercise}
        onUpdate={updateExercise}
        onLinkNext={linkExerciseNext}
        onUnlink={unlinkExercise}
        listHeaderComponent={
          <YStack>
            <YStack marginBottom="$xl" marginTop="$md">
              <AppText variant="label" color="textSecondary" marginBottom="$xs">Nombre</AppText>
              <AppInput value={name} onChangeText={setName} />
              {exercises.length > 0 && (
                <AppText variant="label" color="textTertiary" marginTop="$xs">
                  {`~${calculateEstimatedDurationMinutes(exercises, restTimerSeconds)} min estimados · ${exercises.length} ejercicio${exercises.length !== 1 ? 's' : ''}`}
                </AppText>
              )}
            </YStack>

            <YStack marginBottom="$2xl">
              <AppText variant="label" color="textSecondary" marginBottom="$xs">Notas</AppText>
              <AppInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Escribe alguna nota..."
                multiline
                minHeight={80}
                maxHeight={160}
                textAlignVertical="top"
              />
            </YStack>

            <AppText variant="titleSm" marginBottom="$md">Ejercicios</AppText>
          </YStack>
        }
        listFooterComponent={
          <YStack>
            <YStack marginTop="$lg" marginBottom="$md">
              <AppButton
                appVariant="outline"
                size="md"
                label="Agregar ejercicio"
                icon={<AppIcon icon={Plus} size={18} color="primary" />}
                onPress={() => router.push('/(workouts)/exercise-browser?target=routine')}
              />
            </YStack>

            <Pressable onPress={handleDelete}>
              <XStack alignItems="center" justifyContent="center" marginTop="$xl" padding="$md" gap="$sm">
                <AppIcon icon={Trash2} size={18} color="danger" />
                <AppText variant="bodyMd" color="danger" fontWeight="600">Eliminar Rutina</AppText>
              </XStack>
            </Pressable>
          </YStack>
        }
      />
    </Screen>
  );
}