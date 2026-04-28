import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

import { RoutineFormTemplate } from '@/widgets/routineEditor';
import { useRoutineEditor } from '@/features/editRoutine';
import { useRoutineApi } from '@/entities/routine';

export default function RoutineCreatePage() {
  const { name, notes, exercises, reset } = useRoutineEditor();
  const { createRoutine } = useRoutineApi();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    reset();
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      Toast.show({ type: 'error', text1: 'El nombre es obligatorio' });
      return;
    }

    if (exercises.length === 0) {
      Toast.show({ type: 'error', text1: 'Agrega al menos un ejercicio' });
      return;
    }

    try {
      setIsSaving(true);
      await createRoutine({
        name,
        notes,
        exercises: exercises.map((ex, index) => ({
          exerciseId: ex.id,
          order: index + 1,
          targetSets: ex.sets,
          maxReps: ex.reps,
          supersetGroup: ex.supersetGroup,
        })),
      });
      
      Toast.show({ type: 'success', text1: 'Rutina creada con éxito' });
      router.back();
    } catch (error) {
      console.error('Failed to save routine:', error);
      Toast.show({ type: 'error', text1: 'Error al guardar la rutina' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <RoutineFormTemplate 
      title="Nueva Rutina"
      isSaving={isSaving}
      onSave={handleSave}
    />
  );
}
