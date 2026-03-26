import { XStack, YStack } from 'tamagui';
import React, { useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '@tamagui/core';
import { router } from 'expo-router';
import { Save, Plus, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/ui/AppText';
import { AppInput } from '@/components/ui/AppInput';
import { IconButton } from '@/components/ui/AppButton';
import { useRoutineStore } from '@/store/routineStore';
import { RoutineExerciseRow } from '@/components/cards/routine-exercise-row';
import { useRoutines } from '@/hooks/useRoutines';
import * as Haptics from 'expo-haptics';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import { getExerciseName } from '@/utils/exercise';

export default function CreateRoutineScreen() {
  const theme = useTheme();
  const { name, notes, exercises, setName, setNotes, removeExercise, updateExercise, reorderExercises, linkExerciseNext, unlinkExercise, reset } = useRoutineStore();
  const routineService = useRoutines();

  useEffect(() => { return () => reset(); }, []);

  const handleSave = async () => {
    if (!name.trim()) { Alert.alert('Error', 'Por favor ingresa un nombre para la rutina'); return; }
    if (exercises.length === 0) { Alert.alert('Error', 'Debes agregar al menos un ejercicio'); return; }

    try {
      await routineService.createRoutine({
        name, notes,
        exercises: exercises.map((e, index) => {
          let minReps = 10, maxReps = 10;
          if (e.reps) {
            const parts = String(e.reps).split('-');
            if (parts.length === 2 && !isNaN(Number(parts[0])) && !isNaN(Number(parts[1]))) {
              minReps = Number(parts[0].trim()); maxReps = Number(parts[1].trim());
            } else if (!isNaN(Number(e.reps))) {
              minReps = Number(String(e.reps).trim()); maxReps = minReps;
            }
          }
          return { exerciseId: e.id, orderIndex: index, targetSets: e.sets, minReps, maxReps, restSeconds: null, supersetGroup: e.supersetGroup || null };
        }),
      } as any);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la rutina');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background?.val }} edges={['top', 'bottom']}>
      <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$lg" style={{ height: 56 }}>
        <IconButton icon={<X size={24} color={theme.color?.val} />} onPress={() => router.back()} />
        <AppText variant="titleSm">Nueva Rutina</AppText>
        <IconButton icon={<Save size={20} color="#000" />} backgroundColor={theme.primary?.val} onPress={handleSave} />
      </XStack>

      <DraggableFlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        onDragEnd={({ data }) => { reorderExercises(data); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
        ListHeaderComponent={
          <YStack marginBottom="$lg">
            <YStack marginBottom="$xl">
              <AppText variant="label" color="textSecondary" style={{ marginBottom: 8 }}>NOMBRE DE LA RUTINA</AppText>
              <AppInput placeholder="Ej. Empuje (Push Day)" value={name} onChangeText={setName} />
            </YStack>

            <YStack marginBottom="$2xl">
              <AppText variant="label" color="textSecondary" style={{ marginBottom: 8 }}>NOTAS (OPCIONAL)</AppText>
              <TextInput
                style={{
                  height: 100, borderRadius: 8, paddingHorizontal: 12, paddingTop: 12,
                  backgroundColor: theme.surfaceSecondary?.val, borderWidth: 1, borderColor: theme.borderColor?.val,
                  color: theme.color?.val, fontSize: 14, textAlignVertical: 'top',
                }}
                placeholder="DescripciÃ³n breve..."
                placeholderTextColor={theme.textTertiary?.val}
                multiline
                value={notes}
                onChangeText={setNotes}
              />
            </YStack>

            <XStack justifyContent="space-between" alignItems="center" marginBottom="$sm">
              <AppText variant="titleSm">Ejercicios</AppText>
              <TouchableOpacity
                style={{ flexDirection: 'row', padding: 4 }}
                onPress={() => router.push('/(workouts)/exercise-browser?target=routine')}
              >
                <Plus size={18} color={theme.primary?.val} />
                <AppText variant="bodyMd" color="primary" style={{ marginLeft: 4, fontWeight: '600' }}>Agregar</AppText>
              </TouchableOpacity>
            </XStack>
          </YStack>
        }
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
        ListEmptyComponent={
          <View style={{ padding: 40, alignItems: 'center' }}>
            <AppText variant="bodyMd" color="textSecondary" style={{ textAlign: 'center' }}>
              AÃºn no has agregado ejercicios a esta rutina.
            </AppText>
          </View>
        }
      />
    </SafeAreaView>
  );
}
