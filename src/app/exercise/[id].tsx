import React, { useState, useEffect } from 'react';
import { YStack, ScrollView } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';

import { CreateExerciseHeader, CreateExerciseForm } from '@/features/exercise';
import { useExerciseDb } from '@/entities/exercise';
import { LoadingSkeleton } from '@/shared/ui';
import type { MuscleGroup, Equipment, ExerciseType, LoadType } from '@kernel';

export default function ExerciseDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getExerciseById, updateExercise } = useExerciseDb();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [primaryMuscles, setPrimaryMuscles] = useState<MuscleGroup[]>([]);
  const [secondaryMuscles, setSecondaryMuscles] = useState<MuscleGroup[]>([]);
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [exerciseType, setExerciseType] = useState<ExerciseType>('compound');
  const [loadType, setLoadType] = useState<LoadType>('weighted');
  const [description, setDescription] = useState('');

  useEffect(() => {
    async function loadExercise() {
      if (!id) return;
      try {
        setLoading(true);
        const exercise = await getExerciseById(id);
        if (exercise) {
          setName(exercise.name);
          setPrimaryMuscles(exercise.primaryMuscles || []);
          setSecondaryMuscles(exercise.secondaryMuscles || []);
          setEquipment(exercise.equipment || null);
          setExerciseType(exercise.type || 'compound');
          setLoadType(exercise.loadType || 'weighted');
          setDescription('');
        } else {
          Toast.show({ type: 'error', text1: 'Ejercicio no encontrado' });
          router.back();
        }
      } catch (error) {
        console.error('Failed to load exercise:', error);
        Toast.show({ type: 'error', text1: 'Error al cargar el ejercicio' });
        router.back();
      } finally {
        setLoading(false);
      }
    }
    loadExercise();
  }, [id, getExerciseById]);

  const handleSave = async () => {
    if (!id) return;
    if (!name.trim()) {
      Toast.show({ type: 'error', text1: 'El nombre es obligatorio' });
      return;
    }
    if (primaryMuscles.length === 0) {
      Toast.show({ type: 'error', text1: 'Seleccioná al menos un músculo primario' });
      return;
    }
    if (!equipment) {
      Toast.show({ type: 'error', text1: 'Seleccioná el equipamiento' });
      return;
    }

    try {
      setIsSaving(true);
      await updateExercise(id, {
        name,
        primaryMuscles,
        secondaryMuscles,
        equipment,
        type: exerciseType,
        loadType,
      });
      Toast.show({ type: 'success', text1: 'Ejercicio actualizado con éxito' });
      router.back();
    } catch (error) {
      console.error('Failed to update exercise:', error);
      Toast.show({ type: 'error', text1: 'Error al actualizar el ejercicio' });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      <SafeAreaView style={{ flex: 1 }}>
        <CreateExerciseHeader 
          isSaving={isSaving} 
          onSave={handleSave} 
          onClose={() => router.back()} 
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack paddingHorizontal="$xl" paddingTop="$md" paddingBottom="$xl">
            <CreateExerciseForm 
              name={name}
              setName={setName}
              primaryMuscles={primaryMuscles}
              setPrimaryMuscles={setPrimaryMuscles}
              togglePrimaryMuscle={(m) => setPrimaryMuscles(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])}
              secondaryMuscles={secondaryMuscles}
              setSecondaryMuscles={setSecondaryMuscles}
              toggleSecondaryMuscle={(m) => setSecondaryMuscles(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])}
              equipment={equipment}
              handleSetEquipment={(e) => setEquipment(e as Equipment)}
              exerciseType={exerciseType}
              handleSetExerciseType={setExerciseType}
              loadType={loadType}
              handleSetLoadType={setLoadType}
              description={description}
              setDescription={setDescription}
              isSaving={isSaving}
            />
          </YStack>
        </ScrollView>
      </SafeAreaView>
    </YStack>
  );
}
