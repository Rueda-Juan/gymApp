import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

import { RoutineFormTemplate, useRoutineEditor } from '@/features/editRoutine';
import { useRoutineDb } from '@/entities/routine';

export default function RoutineCreatePage() {
  const { name, notes, exercises, reset } = useRoutineEditor();
  const { createRoutine } = useRoutineDb();
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
          orderIndex: index,
          targetSets: ex.sets,
          targetReps: parseInt(ex.reps) || 10, // Converting string range to single number for integer column
          supersetGroup: ex.supersetGroup ? String(ex.supersetGroup) : null,
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
