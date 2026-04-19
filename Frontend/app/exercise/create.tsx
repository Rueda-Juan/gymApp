import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, View, StyleSheet, Alert } from 'react-native';

import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';

import { Screen } from '@/components/ui/Screen';
// Importar useTheme de Tamagui para acceder a los colores del theme
import { useTheme, YStack } from 'tamagui';
import { useExercises } from '@/hooks/domain/useExercises';
import { getErrorMessage } from '@/utils/errorHelpers';
import CreateExerciseHeader from './CreateExerciseHeader';
import CreateExerciseForm from './CreateExerciseForm';

import type { MuscleGroup } from 'backend/domain/valueObjects/MuscleGroup';
import type { Equipment } from 'backend/domain/valueObjects/Equipment';
import type { ExerciseType, LoadType } from 'backend/domain/entities/Exercise';

export default function CreateExerciseScreen() {
  const exerciseService = useExercises();

  const [name, setName] = useState('');
  const [primaryMuscles, setPrimaryMuscles] = useState<MuscleGroup[]>([]);
  const [secondaryMuscles, setSecondaryMuscles] = useState<MuscleGroup[]>([]);
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [exerciseType, setExerciseType] = useState<ExerciseType>('compound');
  const [loadType, setLoadType] = useState<LoadType>('weighted');
  const [description, setDescription] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const savingRef = useRef(false);

  const togglePrimaryMuscle = useCallback((muscle: MuscleGroup) => {
    setPrimaryMuscles((prev) => (prev.includes(muscle) ? prev.filter((m) => m !== muscle) : [...prev, muscle]));
  }, []);

  const toggleSecondaryMuscle = useCallback((muscle: MuscleGroup) => {
    setSecondaryMuscles((prev) => (prev.includes(muscle) ? prev.filter((m) => m !== muscle) : [...prev, muscle]));
  }, []);

  const handleSetEquipment = useCallback((eq: string) => {
    setEquipment((prev) => (prev === (eq as Equipment) ? null : (eq as Equipment)));
  }, []);
  const handleSetExerciseType = useCallback((v: ExerciseType) => setExerciseType(v), []);
  const handleSetLoadType = useCallback((v: LoadType) => setLoadType(v), []);

  const handleSave = useCallback(async () => {
    if (savingRef.current) return;
    if (!name.trim()) {
      Alert.alert('Error', 'Ingresá un nombre para el ejercicio');
      return;
    }
    if (primaryMuscles.length === 0) {
      Alert.alert('Error', 'Seleccioná al menos un músculo primario');
      return;
    }
    if (!equipment) {
      Alert.alert('Error', 'Seleccioná el equipamiento');
      return;
    }

    try {
      savingRef.current = true;
      setIsSaving(true);
      await exerciseService.createCustomExercise({
        name: name.trim(),
        nameEs: null,
        primaryMuscles,
        secondaryMuscles,
        equipment,
        exerciseType,
        weightIncrement: 2.5,
        animationPath: null,
        description: description.trim() || null,
        anatomicalRepresentationSvg: null,
        exerciseKey: '',
        isCustom: true,
        createdBy: null,
        loadType,
        isArchived: false,
      });
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show({ type: 'success', text1: 'Ejercicio creado', position: 'top' });
      router.back();
    } catch (error: unknown) {
      console.error('createCustomExercise error:', error);
      const message = getErrorMessage(error);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Toast.show({ type: 'error', text1: message, position: 'top' });
      Alert.alert('Error', message);
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  }, [name, primaryMuscles, secondaryMuscles, equipment, exerciseType, loadType, description, exerciseService]);

  // Handler para selección directa en el SVG (deshabilitado)
  // const handleSvgSelectMuscle = useCallback((muscle: string | null) => {
  //   if (!muscle) return;
  //   setPrimaryMuscles((prev) =>
  //     prev.includes(muscle as MuscleGroup)
  //       ? prev.filter((m) => m !== muscle)
  //       : [...prev, muscle as MuscleGroup]
  //   );
  // }, []);

  const theme = useTheme();


  // Overlay y ejemplo de uso de tokens para layout
  const styles = StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.25)', // Usar tokens si se requiere más adelante
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
    },
  });

  return (
    <Screen safeAreaEdges={['top', 'bottom', 'left', 'right']}>
      <YStack flex={1}>
        <CreateExerciseHeader isSaving={isSaving} onSave={handleSave} onClose={() => router.back()} />

        {/* Overlay global de loading durante guardado */}
        {isSaving && (
          <View style={styles.overlay} accessibilityLabel="Guardando ejercicio" accessible>
            <ActivityIndicator size="large" color={theme.primary?.val ?? '#B5530A'} />
          </View>
        )}

        <CreateExerciseForm
          name={name}
          setName={setName}
          primaryMuscles={primaryMuscles}
          setPrimaryMuscles={setPrimaryMuscles}
          togglePrimaryMuscle={togglePrimaryMuscle}
          secondaryMuscles={secondaryMuscles}
          setSecondaryMuscles={setSecondaryMuscles}
          toggleSecondaryMuscle={toggleSecondaryMuscle}
          equipment={equipment}
          handleSetEquipment={handleSetEquipment}
          exerciseType={exerciseType}
          handleSetExerciseType={handleSetExerciseType}
          loadType={loadType}
          handleSetLoadType={handleSetLoadType}
          description={description}
          setDescription={setDescription}
          isSaving={isSaving}
          svgInteractive={false}
          onSvgSelectMuscle={undefined}
        // TODO: Refactorizar CreateExerciseForm para usar tokens en padding, borderRadius, etc.
        />
      </YStack>
    </Screen>
  );
  // Overlay y ejemplo de uso de tokens para layout
}
