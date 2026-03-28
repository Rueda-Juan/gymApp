import { XStack, YStack, useTheme } from 'tamagui';
import React, { useEffect, useState, useCallback } from 'react';
import { Pressable, Alert, ActivityIndicator, Share } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Save, Plus, X, Trash2, Share2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { NestableScrollContainer, NestableDraggableFlatList, ScaleDecorator } from 'react-native-draggable-flatlist';

import { AppText } from '@/components/ui/AppText';
import { AppInput } from '@/components/ui/AppInput';
import { AppIcon } from '@/components/ui/AppIcon';
import { IconButton } from '@/components/ui/AppButton';
import { Screen } from '@/components/ui/Screen';
import { useRoutineStore } from '@/store/routineStore';
import { RoutineExerciseRow } from '@/components/cards/routine-exercise-row';
import { useRoutines } from '@/hooks/useRoutines';
import { getExerciseName } from '@/utils/exercise';

export default function EditRoutineScreen() {
  const { id, payload } = useLocalSearchParams<{ id: string; payload?: string }>();
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
  const [loading, setLoading] = useState(true);

  const fetchRoutine = useCallback(async () => {
    if (payload) {
      try {
        const decoded = JSON.parse(decodeURIComponent(payload));
        loadRoutine(decoded);
        Alert.alert('Importada', 'Rutina compartida importada correctamente');
      } catch (error) {
        console.error('[EditRoutineScreen] parse payload failed', error);
        Alert.alert('Error', 'No se pudo importar la rutina compartida');
        router.back();
      } finally {
        setLoading(false);
      }
      return;
    }

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
  }, [id, payload, routineService, loadRoutine]);

  useEffect(() => { 
    if (id) fetchRoutine(); 
  }, [id, fetchRoutine]);

  const handleUpdate = useCallback(async () => {
    if (!name.trim()) { 
      Alert.alert('Error', 'El nombre no puede estar vacío'); 
      return; 
    }
    try {
      await routineService.updateRoutine(id as string, {
        name, 
        notes,
        exercises: exercises.map((e, index) => ({
          exerciseId: e.id, 
          orderIndex: index, 
          targetSets: e.sets,
          maxReps: parseInt(e.reps) || 0, 
          minReps: parseInt(e.reps) || 0,
        })),
      } as any);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch { 
      Alert.alert('Error', 'No se pudo actualizar la rutina'); 
    }
  }, [name, exercises, id, routineService, notes]);

  const handleShare = useCallback(async () => {
    if (!id) {
      Alert.alert('Error', 'ID de rutina inválido');
      return;
    }

    const textExercise = exercises
      .map((ex, ix) => `- ${getExerciseName(ex)}: ${ex.sets} sets x ${ex.reps} reps`)
      .join('\n');

    const payloadObject = {
      name,
      notes,
      exercises: exercises.map((ex) => ({
        exerciseId: ex.id,
        exercise: { name: ex.name, nameEs: ex.nameEs || null, primaryMuscles: [ex.muscle] },
        targetSets: ex.sets,
        maxReps: Number(ex.reps.split('-')[1] ?? ex.reps) || 0,
        supersetGroup: ex.supersetGroup || null,
      })),
    };

    const payload = encodeURIComponent(JSON.stringify(payloadObject));
    const link = `gymapp://routine/${id}?payload=${payload}`;
    const message = `Rutina: ${name}\n\n${notes ? `${notes}\n\n` : ''}Ejercicios:\n${textExercise}\n\nAbre la rutina: ${link}`;

    try {
      await Share.share({
        title: `Rutina: ${name}`,
        message,
        url: link,
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo compartir la rutina');
      console.error('[EditRoutineScreen] share error:', error);
    }
  }, [id, name, notes, exercises]);

  const handleDelete = () => {
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
        <XStack alignItems="center" gap="$xs">
          <IconButton
            icon={<AppIcon icon={Share2} size={20} color="background" />}
            backgroundColor="$secondary"
            onPress={handleShare}
          />
          <IconButton 
            icon={<AppIcon icon={Save} size={20} color="background" />} 
            backgroundColor="$primary" 
            onPress={handleUpdate} 
          />
        </XStack>
      </XStack>

      <NestableScrollContainer contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}>
        <YStack marginBottom="$xl" marginTop="$md">
          <AppText variant="label" color="textSecondary" marginBottom="$xs">Nombre</AppText>
          <AppInput value={name} onChangeText={setName} />
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

        <XStack justifyContent="space-between" alignItems="center" marginBottom="$md">
          <AppText variant="titleSm">Ejercicios</AppText>
          <Pressable onPress={() => router.push('/(workouts)/exercise-browser?target=routine')}>
            <XStack alignItems="center" gap="$xs">
              <AppIcon icon={Plus} size={18} color="primary" />
              <AppText variant="bodyMd" color="primary" fontWeight="600">Agregar</AppText>
            </XStack>
          </Pressable>
        </XStack>

        <NestableDraggableFlatList
          data={exercises}
          keyExtractor={(item) => item.id}
          onDragEnd={({ data, from, to }) => {
            reorderExercises(data);

            if (typeof from === 'number' && typeof to === 'number' && from !== to) {
              const movedIndex = to;
              const moved = data[movedIndex];
              if (!moved) return;

              const prev = data[movedIndex - 1];
              const next = data[movedIndex + 1];

              const isLinkedWithPrev = prev && prev.supersetGroup != null && prev.supersetGroup === moved.supersetGroup;
              const isLinkedWithNext = next && next.supersetGroup != null && next.supersetGroup === moved.supersetGroup;

              // Si se suelta junto a un ejercicio, converte en superset del vecino si no estaba
              if (prev && !isLinkedWithPrev) {
                linkExerciseNext(movedIndex - 1);
              } else if (next && !isLinkedWithNext && movedIndex < data.length - 1) {
                linkExerciseNext(movedIndex);
              }
            }

            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
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

        <Pressable onPress={handleDelete}>
          <XStack alignItems="center" justifyContent="center" marginTop="$xl" padding="$md" gap="$sm">
            <AppIcon icon={Trash2} size={18} color="danger" />
            <AppText variant="bodyMd" color="danger" fontWeight="600">Eliminar Rutina</AppText>
          </XStack>
        </Pressable>
      </NestableScrollContainer>
    </Screen>
  );
}