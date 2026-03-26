import { XStack, YStack } from 'tamagui';
import React, { useEffect } from 'react';
import { View, TouchableOpacity, Alert, BackHandler } from 'react-native';
import { useTheme } from '@tamagui/core';

import { useActiveWorkout, WorkoutExerciseState } from '@/store/useActiveWorkout';
import { Screen } from '@/components/ui/Screen';
import { useRestTimer } from '@/store/useRestTimer';
import { useWorkout } from '@/hooks/useWorkout';
import { useExercises } from '@/hooks/useExercises';
import { router as expoRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { X, Search, Check, SkipForward, Eye, EyeOff, MoreVertical, ChevronRight, Link2 } from 'lucide-react-native';
import BottomSheet, { BottomSheetView, BottomSheetTextInput, BottomSheetFlashList } from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';
import { CardBase } from '@/components/ui/card';
import { SetRow } from '@/components/cards/set-row';
import { AppText } from '@/components/ui/AppText';
import { IconButton } from '@/components/ui/AppButton';
import { Badge } from '@/components/ui/badge';
import { getExerciseName } from '@/utils/exercise';

export default function ActiveWorkoutScreen() {
  const theme = useTheme();

  const {
    isActive, workoutId, startTime, routineName, exercises,
    currentExerciseIndex, cancelWorkout, finishWorkout: clearStore,
    addSet: addSetStore, addExercise, updateSetValues,
    toggleSetComplete, skipExercise, setCurrentExercise,
    removeExercise, moveExerciseToEnd,
  } = useActiveWorkout();

  const [elapsedSeconds, setElapsedSeconds] = React.useState(0);
  const [search, setSearch] = React.useState('');
  const [allExercises, setAllExercises] = React.useState<any[]>([]);
  const [isFocusMode, setIsFocusMode] = React.useState(false);

  const workoutService = useWorkout();
  const exerciseService = useExercises();
  const { startTimer } = useRestTimer();

  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const optionsSheetRef = React.useRef<BottomSheet>(null);
  const [selectedExerciseId, setSelectedExerciseId] = React.useState<string | null>(null);

  useEffect(() => { exerciseService.getAll().then(setAllExercises); }, []);

  const filteredExercises = allExercises.filter(e =>
    getExerciseName(e).toLowerCase().includes(search.toLowerCase())
  );

  const flashListRef = React.useRef<any>(null);

  useEffect(() => {
    if (startTime) {
      const interval = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime]);

  useEffect(() => {
    if (flashListRef.current && !isFocusMode) {
      flashListRef.current.scrollToIndex({ index: currentExerciseIndex, animated: true, viewPosition: 0.2 });
    }
  }, [currentExerciseIndex, isFocusMode]);

  const checkExerciseCompletion = () => {
    const activeGroup = exercises[currentExerciseIndex]?.supersetGroup;
    const activeIndices = exercises
      .map((ex, i) => (activeGroup != null && ex.supersetGroup === activeGroup) || i === currentExerciseIndex ? i : -1)
      .filter(i => i !== -1);

    const allCompleted = activeIndices.length > 0 && activeIndices.every(idx =>
      exercises[idx].sets.every(s => s.isCompleted)
    );

    if (allCompleted) {
      const lastIndexInGroup = Math.max(...activeIndices);
      if (lastIndexInGroup < exercises.length - 1) {
        setTimeout(() => setCurrentExercise(lastIndexInGroup + 1), 1000);
      }
    }
  };

  const formatElapsedTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? hrs + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const backAction = () => { handleCancel(); return true; };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  const handleCancel = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert("¿Cancelar entrenamiento?", "Se perderá todo el progreso no guardado.", [
      { text: "No, continuar", style: "cancel" },
      { text: "Sí, salir", style: "destructive", onPress: () => { cancelWorkout(); expoRouter.back(); } },
    ]);
  };

  const handleFinish = async () => {
    if (!workoutId) return;
    try {
      await workoutService.finishWorkout(workoutId);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show({ type: 'success', text1: '¡Entrenamiento Guardado!', text2: 'Felicidades por completar tu sesión.', position: 'top' });
      clearStore();
      expoRouter.replace({ pathname: '/(workouts)/summary' as any, params: { id: workoutId } });
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'No se pudo guardar el entrenamiento' });
    }
  };

  const [focusedSetId, setFocusedSetId] = React.useState<string | null>(null);

  const onSetToggle = async (exerciseId: string, setId: string, currentlyCompleted: boolean) => {
    toggleSetComplete(exerciseId, setId);

    if (!currentlyCompleted && workoutId) {
      const exercise = exercises.find(ex => ex.id === exerciseId);
      if (!exercise) return;

      const setIndex = exercise.sets.findIndex(s => s.id === setId);
      const set = exercise.sets[setIndex];

      if (set) {
        try {
          const result = await workoutService.recordSet(workoutId, {
            exerciseId: exercise.exerciseId,
            setNumber: setIndex + 1,
            weight: set.weight,
            reps: set.reps,
            setType: set.type,
            completed: true,
          });

          if (result.newRecords && result.newRecords.length > 0) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            result.newRecords.forEach((record: any) => {
              Toast.show({
                type: 'success', text1: '¡NUEVO RÉCORD! 🏆',
                text2: `Has superado tu mejor ${record.recordType.replace('_', ' ')}: ${record.value}`,
                position: 'top', visibilityTime: 4000,
              });
            });
          }

          if (setIndex < exercise.sets.length - 1) {
            setFocusedSetId(exercise.sets[setIndex + 1].id);
          } else {
            setFocusedSetId(null);
          }

          Toast.show({ type: 'success', text1: `Set ${setIndex + 1} registrado`, position: 'bottom', bottomOffset: 120, visibilityTime: 1500 });
          startTimer(90);
          checkExerciseCompletion();
        } catch (e) {
          console.error('Failed to record set', e);
        }
      }
    }
  };

  const addSet = (exerciseId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addSetStore(exerciseId);
  };

  const handleSkipExercise = (exerciseId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    skipExercise(exerciseId);
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExercise(currentExerciseIndex + 1);
    }
  };

  const renderExercise = ({ item, index }: { item: WorkoutExerciseState; index: number }) => {
    const activeGroup = exercises[currentExerciseIndex]?.supersetGroup;
    const isCurrent = index === currentExerciseIndex || (activeGroup != null && item.supersetGroup === activeGroup);
    const isSkipped = item.status === 'skipped';
    const isGroupedWithPrev = index > 0 && item.supersetGroup != null && item.supersetGroup === exercises[index - 1].supersetGroup;

    if (isFocusMode && !isCurrent) return null;

    return (
      <YStack key={item.id}>
        {isGroupedWithPrev && (
          <YStack alignItems="center" height={16} zIndex={-1}>
            <YStack width={2} height={32} position="absolute" top={-16} backgroundColor="$primary" />
            <Link2 size={16} color={theme.primary?.val} style={{ backgroundColor: theme.background?.val, zIndex: 2 }} />
          </YStack>
        )}
        <CardBase
          style={[
            { marginBottom: isGroupedWithPrev ? 8 : 16, padding: 16 },
            isCurrent && { borderColor: theme.primary?.val, borderWidth: 2, shadowColor: theme.primary?.val, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4 },
            isSkipped && { opacity: 0.5 },
          ]}
        >
          <XStack justifyContent="space-between" alignItems="center" marginBottom="$lg">
            <XStack alignItems="center" gap="$md" flex={1}>
              <AppText variant="titleSm" style={{ flex: 1 }}>{getExerciseName(item)}</AppText>
            </XStack>

            <XStack alignItems="center" gap="$md">
              {!isSkipped && (
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }} onPress={() => handleSkipExercise(item.id)}>
                  <SkipForward size={16} color={theme.textTertiary?.val} />
                  <AppText variant="label" color="textTertiary">Saltar</AppText>
                </TouchableOpacity>
              )}
              {isSkipped && <Badge label="OMITIDO" variant="danger" size="sm" />}
              <TouchableOpacity
                onPress={() => { setSelectedExerciseId(item.id); optionsSheetRef.current?.snapToIndex(0); }}
                style={{ padding: 4 }}
              >
                <MoreVertical size={20} color={theme.textTertiary?.val} />
              </TouchableOpacity>
            </XStack>
          </XStack>

          {!isSkipped && (
            <>
              <XStack marginBottom="$xs" paddingRight="$sm">
                <AppText variant="label" color="textTertiary" style={{ flex: 1, textAlign: 'center' }}>SET</AppText>
                <AppText variant="label" color="textTertiary" style={{ flex: 2, textAlign: 'center' }}>PREVIO</AppText>
                <AppText variant="label" color="textTertiary" style={{ flex: 2, textAlign: 'center' }}>KG</AppText>
                <AppText variant="label" color="textTertiary" style={{ flex: 2, textAlign: 'center' }}>REPS</AppText>
                <View style={{ width: 44 }} />
              </XStack>

              <YStack gap="$xs">
                {item.sets.map((set, setIndex) => (
                  <SetRow
                    key={set.id}
                    index={setIndex}
                    setRef={set}
                    autoFocus={set.id === focusedSetId}
                    onUpdate={(values) => updateSetValues(item.id, set.id, values)}
                    onToggleComplete={() => onSetToggle(item.id, set.id, set.isCompleted)}
                    onRemove={() => useActiveWorkout.getState().removeSet(item.id, set.id)}
                  />
                ))}
              </YStack>

              <TouchableOpacity
                style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 12, marginTop: 8 }}
                onPress={() => addSet(item.id)}
              >
                <AppText variant="bodyMd" color="primary" style={{ fontWeight: '600' }}>+ Añadir set</AppText>
              </TouchableOpacity>
            </>
          )}
        </CardBase>
      </YStack>
    );
  };

  const handleAddExerciseSelection = (item: any) => {
    addExercise({
      id: Math.random().toString(36).substr(2, 9),
      exerciseId: item.exerciseId,
      name: item.name,
      nameEs: item.nameEs,
      sets: [{ id: Math.random().toString(36).substr(2, 9), weight: 0, reps: 0, isCompleted: false, type: 'normal' }],
    });
    bottomSheetRef.current?.close();
    setSearch('');
  };

  return (
    <Screen scroll={false}>
      {/* Header */}
      <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$xl" paddingVertical="$sm">
        <IconButton icon={<X size={24} color={theme.color?.val} />} onPress={handleCancel} />

        <YStack alignItems="center">
          <AppText variant="bodySm" color="textTertiary" tabularNums style={{ fontWeight: '600' }}>
            {formatElapsedTime(elapsedSeconds)}
          </AppText>
          <AppText variant="titleSm" style={{ maxWidth: 180 }} numberOfLines={1}>
            {routineName}
          </AppText>
          <AppText variant="label" color="primary" style={{ marginTop: 2 }}>
            EJERCICIO {currentExerciseIndex + 1} DE {exercises.length}
          </AppText>
        </YStack>

        <XStack alignItems="center">
          <IconButton
            icon={isFocusMode ? <Eye color={theme.primary?.val} size={22} /> : <EyeOff color={theme.textTertiary?.val} size={22} />}
            backgroundColor={isFocusMode ? theme.primarySubtle?.val : 'transparent'}
            onPress={() => setIsFocusMode(!isFocusMode)}
            style={{ marginRight: 8 }}
          />
          <TouchableOpacity
            onPress={handleFinish}
            style={{
              paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12,
              backgroundColor: theme.primarySubtle?.val,
            }}
          >
            <AppText variant="bodySm" color="primary" style={{ fontWeight: '700' }}>Finalizar</AppText>
          </TouchableOpacity>
        </XStack>
      </XStack>

      {/* Progress Bar */}
      <YStack height={4} backgroundColor="$borderColor" width="100%">
        <YStack
          height="100%"
          backgroundColor="$primary"
          width={`${((currentExerciseIndex + 1) / exercises.length) * 100}%`}
        />
      </YStack>

      {/* Main Content */}
      <YStack flex={1}>
        <FlashList
          ref={flashListRef}
          data={exercises}
          renderItem={renderExercise}
          // @ts-ignore
          estimatedItemSize={250}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 150 }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <TouchableOpacity
              style={{
                alignItems: 'center', justifyContent: 'center',
                borderWidth: 1, borderStyle: 'dashed', borderRadius: 12,
                padding: 20, marginVertical: 12,
                borderColor: theme.borderColor?.val,
              }}
              onPress={() => bottomSheetRef.current?.snapToIndex(1)}
            >
              <AppText variant="bodyMd" color="primary" style={{ fontWeight: '700' }}>+ Añadir Ejercicio</AppText>
            </TouchableOpacity>
          }
        />
      </YStack>

      {/* Exercise Picker Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['50%', '90%']}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: theme.surfaceSecondary?.val }}
        handleIndicatorStyle={{ backgroundColor: theme.textTertiary?.val }}
      >
        <BottomSheetView style={{ flex: 1, padding: 12 }}>
          <XStack justifyContent="space-between" alignItems="center" marginBottom="$md">
            <AppText variant="titleSm">Añadir Ejercicio</AppText>
            <TouchableOpacity onPress={() => bottomSheetRef.current?.close()}>
              <X size={24} color={theme.textSecondary?.val} />
            </TouchableOpacity>
          </XStack>

          <XStack
            alignItems="center"
            gap="$sm"
            style={{
              height: 48, borderRadius: 12, paddingHorizontal: 12,
              backgroundColor: theme.surface?.val, marginBottom: 12,
            }}
          >
            <Search size={20} color={theme.textTertiary?.val} />
            <BottomSheetTextInput
              style={{ flex: 1, marginLeft: 8, color: theme.color?.val, fontSize: 14 }}
              placeholder="Ej. Press de banca..."
              placeholderTextColor={theme.textTertiary?.val}
              value={search}
              onChangeText={setSearch}
            />
          </XStack>

          <BottomSheetFlashList
            data={filteredExercises}
            keyExtractor={(item: any) => item.id}
            estimatedItemSize={70}
            renderItem={({ item }: any) => (
              <TouchableOpacity
                style={{
                  flexDirection: 'row', alignItems: 'center',
                  borderBottomColor: theme.borderColor?.val, borderBottomWidth: 1, paddingVertical: 12,
                }}
                onPress={() => handleAddExerciseSelection(item)}
              >
                <View style={{ flex: 1 }}>
                  <AppText variant="subtitle">{getExerciseName(item)}</AppText>
                  <AppText variant="label" color="textSecondary">
                    {item.primaryMuscles?.join(', ') || 'other'} · {item.equipment}
                  </AppText>
                </View>
                <Check size={20} color={theme.primary?.val} />
              </TouchableOpacity>
            )}
          />
        </BottomSheetView>
      </BottomSheet>

      {/* Exercise Options Bottom Sheet */}
      <BottomSheet
        ref={optionsSheetRef}
        index={-1}
        snapPoints={[300]}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: theme.surfaceSecondary?.val }}
        handleIndicatorStyle={{ backgroundColor: theme.textTertiary?.val }}
      >
        <BottomSheetView style={{ flex: 1, padding: 12 }}>
          <XStack justifyContent="space-between" alignItems="center" marginBottom="$lg">
            <AppText variant="titleSm">Opciones de Ejercicio</AppText>
            <TouchableOpacity onPress={() => optionsSheetRef.current?.close()}>
              <X size={24} color={theme.textSecondary?.val} />
            </TouchableOpacity>
          </XStack>

          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', borderBottomColor: theme.borderColor?.val, borderBottomWidth: 1, paddingVertical: 12 }}
            onPress={() => {
              if (selectedExerciseId) {
                const selectedEx = exercises.find(e => e.id === selectedExerciseId);
                const exDetails = allExercises.find(e => e.id === selectedEx?.exerciseId);
                expoRouter.push({
                  pathname: '/(workouts)/exercise-browser',
                  params: {
                    action: 'replace', targetId: selectedExerciseId,
                    filterMuscle: exDetails?.primaryMuscles?.[0] || '',
                    excludeEquipment: exDetails?.equipment || '',
                  },
                } as any);
                optionsSheetRef.current?.close();
              }
            }}
          >
            <View style={{ flex: 1 }}>
              <AppText variant="bodyMd">Sustituir Ejercicio</AppText>
            </View>
            <ChevronRight size={20} color={theme.textTertiary?.val} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', borderBottomColor: theme.borderColor?.val, borderBottomWidth: 1, paddingVertical: 12 }}
            onPress={() => {
              if (selectedExerciseId) {
                moveExerciseToEnd(selectedExerciseId);
                optionsSheetRef.current?.close();
                Toast.show({ type: 'success', text1: 'Movido al final', position: 'top' });
              }
            }}
          >
            <AppText variant="bodyMd">Mover al final</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}
            onPress={() => {
              if (selectedExerciseId) {
                Alert.alert("¿Eliminar Ejercicio?", "Se borrará permanentemente de este entrenamiento.", [
                  { text: "Cancelar", style: "cancel" },
                  { text: "Eliminar", style: "destructive", onPress: () => { removeExercise(selectedExerciseId); optionsSheetRef.current?.close(); } },
                ]);
              }
            }}
          >
            <AppText variant="bodyMd" color="error" style={{ fontWeight: '700' }}>Eliminar Ejercicio</AppText>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </Screen>
  );
}
