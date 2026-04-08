import React, { useEffect, useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { RoutineFormTemplate } from '@/components/routine/RoutineFormTemplate';
import { useRoutineEditor } from '@/hooks/useRoutineEditor';
import { useRoutines } from '@/hooks/useRoutines';
import { createClientId } from '@/utils/clientId';
import { mapStoreExercisesToPayload } from '@/utils/routine';

export default function CreateRoutineScreen() {
  const { name, notes, exercises, reset } = useRoutineEditor();
  const routineService = useRoutines();
  const [isSaving, setIsSaving] = useState(false);

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
      setIsSaving(true);
      await routineService.createRoutine({
        name,
        notes,
        exercises: mapStoreExercisesToPayload(exercises, createClientId),
      });
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch {
      Alert.alert('Error', 'No se pudo guardar la rutina');
    } finally {
      setIsSaving(false);
    }
  }, [name, exercises, notes, routineService]);

  return (
    <RoutineFormTemplate
      title="Nueva Rutina"
      isSaving={isSaving}
      onSave={handleSave}
    />
  );
}