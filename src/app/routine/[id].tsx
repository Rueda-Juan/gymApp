import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import Toast from 'react-native-toast-message';

import { RoutineFormTemplate, useRoutineEditor } from '@/features/editRoutine';
import { useRoutineDb, LoadableRoutine } from '@/entities/routine';
import { LoadingSkeleton } from '@/shared/ui';

export default function RoutineDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { name, notes, exercises, loadRoutine, reset } = useRoutineEditor();
  const { getRoutineById, updateRoutine, deleteRoutine } = useRoutineDb();
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchRoutine = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getRoutineById(id);
        if (data) {
          loadRoutine(data as LoadableRoutine);
        } else {
          Toast.show({ type: 'error', text1: 'Rutina no encontrada' });
          router.back();
        }
      } catch (error) {
        console.error('Failed to fetch routine:', error);
        Toast.show({ type: 'error', text1: 'Error al cargar la rutina' });
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchRoutine();
    return () => reset();
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    if (!name.trim()) {
      Toast.show({ type: 'error', text1: 'El nombre es obligatorio' });
      return;
    }

    try {
      setIsSaving(true);
      await updateRoutine(id, {
        name,
        notes,
        exercises: exercises.map((ex, index) => ({
          exerciseId: ex.id,
          orderIndex: index,
          targetSets: ex.sets,
          targetReps: parseInt(ex.reps) || 10,
          supersetGroup: ex.supersetGroup ? String(ex.supersetGroup) : null,
        })),
      });
      
      Toast.show({ type: 'success', text1: 'Rutina actualizada' });
      router.back();
    } catch (error) {
      console.error('Failed to update routine:', error);
      Toast.show({ type: 'error', text1: 'Error al actualizar la rutina' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteRoutine(id);
      Toast.show({ type: 'success', text1: 'Rutina eliminada' });
      router.back();
    } catch (error) {
      console.error('Failed to delete routine:', error);
      Toast.show({ type: 'error', text1: 'Error al eliminar la rutina' });
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <RoutineFormTemplate 
      title={name}
      routineId={id}
      isSaving={isSaving}
      onSave={handleSave}
      onDelete={handleDelete}
    />
  );
}
