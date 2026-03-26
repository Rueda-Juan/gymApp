import { XStack, YStack } from 'tamagui';
import React, { useEffect, useState } from 'react';
import { TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '@tamagui/core';

import { router, useLocalSearchParams } from 'expo-router';
import { Save, Plus, X, Trash2 } from 'lucide-react-native';
import { AppText } from '@/components/ui/AppText';
import { AppInput } from '@/components/ui/AppInput';
import { IconButton } from '@/components/ui/AppButton';
import { Screen } from '@/components/ui/Screen';
import { useRoutineStore } from '@/store/routineStore';
import { RoutineExerciseRow } from '@/components/cards/routine-exercise-row';
import { useRoutines } from '@/hooks/useRoutines';
import * as Haptics from 'expo-haptics';
import { NestableScrollContainer, NestableDraggableFlatList, ScaleDecorator } from 'react-native-draggable-flatlist';
import { getExerciseName } from '@/utils/exercise';

export default function EditRoutineScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { name, notes, exercises, setName, setNotes, removeExercise, updateExercise, reorderExercises, linkExerciseNext, unlinkExercise, loadRoutine, reset } = useRoutineStore();
  const routineService = useRoutines();
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (id) fetchRoutine(); }, [id]);

  const fetchRoutine = async () => {
    try {
      const routine = await routineService.getById(id as string);
      if (routine) loadRoutine(routine);
      else { Alert.alert('Error', 'No se encontró la rutina'); router.back(); }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la rutina');
    } finally { setLoading(false); }
  };

  const handleUpdate = async () => {
    if (!name.trim()) { Alert.alert('Error', 'El nombre no puede estar vacío'); return; }
    try {
      await routineService.updateRoutine(id as string, {
        name, notes,
        exercises: exercises.map((e, index) => ({
          exerciseId: e.id, orderIndex: index, targetSets: e.sets,
          maxReps: parseInt(e.reps) || 0, minReps: parseInt(e.reps) || 0,
        })),
      } as any);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (error) { Alert.alert('Error', 'No se pudo actualizar la rutina'); }
  };

  const handleDelete = () => {
    Alert.alert('Eliminar Rutina', '¿Estás seguro de que quieres eliminar esta rutina?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => {
        try { await routineService.deleteRoutine(id as string); router.back(); }
        catch (e) { Alert.alert('Error', 'No se pudo eliminar'); }
      }},
    ]);
  };

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator size="large" color={theme.primary?.val} />
      </Screen>
    );
  }

  return (
    <Screen>
      <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$lg" height={56}>
        <IconButton icon={<X size={24} color={theme.color?.val} />} onPress={() => router.back()} />
        <AppText variant="titleSm" numberOfLines={1}>{name}</AppText>
        <IconButton icon={<Save size={20} color="#000" />} backgroundColor={theme.primary?.val} onPress={handleUpdate} />
      </XStack>

      <NestableScrollContainer style={{ flex: 1, padding: 16 }}>
        <YStack marginBottom="$xl">
          <AppText variant="label" color="textSecondary" style={{ marginBottom: 8 }}>Nombre</AppText>
          <AppInput value={name} onChangeText={setName} />
        </YStack>

        <YStack marginBottom="$2xl">
          <AppText variant="label" color="textSecondary" marginBottom="$xs">Notas</AppText>
          <AppInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Escribe alguna nota…"
            multiline
            minHeight={80}
            maxHeight={160}
            textAlignVertical="top"
          />
        </YStack>

        <XStack justifyContent="space-between" alignItems="center" marginBottom="$lg">
          <AppText variant="titleSm">Ejercicios</AppText>
          <TouchableOpacity
            style={{ flexDirection: 'row' }}
            onPress={() => router.push('/(workouts)/exercise-browser?target=routine')}
          >
            <Plus size={18} color={theme.primary?.val} />
            <AppText variant="bodyMd" color="primary" style={{ marginLeft: 4 }}>Agregar</AppText>
          </TouchableOpacity>
        </XStack>

        <NestableDraggableFlatList
          data={exercises}
          keyExtractor={(item) => item.id}
          onDragEnd={({ data }) => { reorderExercises(data); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
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
        />

        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, justifyContent: 'center', padding: 16 }}
          onPress={handleDelete}
        >
          <Trash2 size={18} color={theme.error?.val} />
          <AppText variant="bodyMd" color="error" style={{ marginLeft: 8 }}>Eliminar Rutina</AppText>
        </TouchableOpacity>

        <YStack height={100} />
      </NestableScrollContainer>
    </Screen>
  );
}
