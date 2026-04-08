import { YStack, useTheme } from 'tamagui';
import React, { useEffect, useState, useCallback } from 'react';
import { Alert, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { Screen } from '@/components/ui/Screen';
import { RoutineFormTemplate } from '@/components/routine/RoutineFormTemplate';
import { useRoutineEditor } from '@/hooks/useRoutineEditor';
import { useRoutines } from '@/hooks/useRoutines';
import { mapStoreExercisesToPayload } from '@/utils/routine';

export default function EditRoutineScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();

  const { name, notes, exercises, loadRoutine } = useRoutineEditor();
  const routineService = useRoutines();
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchRoutine = useCallback(async () => {
    if (!id) return;
    try {
      const routine = await routineService.getRoutineById(id);
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
    fetchRoutine();
  }, [fetchRoutine]);

  const handleUpdate = useCallback(async () => {
    if (!id || !name.trim()) {
      Alert.alert('Error', 'El nombre no puede estar vacío');
      return;
    }
    if (isSaving) return;
    setIsSaving(true);
    try {
      await routineService.updateRoutine(id, {
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
    if (!id || loading) return;
    Alert.alert('Eliminar Rutina', '¿Estás seguro de que quieres eliminar esta rutina?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await routineService.deleteRoutine(id);
            router.back();
          } catch {
            Alert.alert('Error', 'No se pudo eliminar');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <Screen>
        <YStack flex={1} alignItems="center" justifyContent="center">
          <ActivityIndicator size="large" color={theme.primary?.val} />
        </YStack>
      </Screen>
    );
  }

  return (
    <RoutineFormTemplate
      title={name || "Editar Rutina"}
      routineId={id}
      isSaving={isSaving}
      onSave={handleUpdate}
      onDelete={handleDelete}
    />
  );
}