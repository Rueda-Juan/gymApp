import React, { useEffect, useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';

import { RoutineFormTemplate } from '../../features/routines/components/RoutineFormTemplate';
import { useRoutineEditor } from '../../features/routines/hooks/useRoutineEditor';
import { useRoutines } from '../../features/routines/hooks/useRoutines';
import { createClientId } from '../../utils/clientId';
import { mapStoreExercisesToPayload } from '../../features/routines/utils/routine';
import { Screen } from '@/shared/ui/Screen';

export default function CreateRoutineScreen() {
  const { name, notes, exercises, reset } = useRoutineEditor();
  const routineService = useRoutines();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    reset();
    return () => reset();
  }, [reset]);

  const handleSave = useCallback(async () => {
    if (isSaving) return;
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
      Toast.show({ type: 'success', text1: 'Rutina guardada', position: 'top' });
      router.back();
    } catch (err) {
      console.error('createRoutine error:', err);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Toast.show({ type: 'error', text1: 'No se pudo guardar la rutina', position: 'top' });
    } finally {
      setIsSaving(false);
    }
  }, [name, exercises, notes, routineService, isSaving]);

  return (
    <Screen
      keyboardAvoiding
      keyboardVerticalOffset={0}
      safeAreaEdges={['top','bottom','left','right']}
    >
      <RoutineFormTemplate
        title="Nueva Rutina"
        isSaving={isSaving}
        onSave={handleSave}
      />
    </Screen>
  );
}