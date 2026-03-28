import { XStack, YStack, useTheme } from 'tamagui';
import React, { useEffect, useCallback, useRef } from 'react';
import type { WeightSuggestion } from 'backend/shared/types';
import { Alert, BackHandler, Pressable, ScrollView } from 'react-native';
import { router as expoRouter } from 'expo-router';
import BottomSheet, { BottomSheetView, BottomSheetTextInput, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';
import { X, Search, Check, SkipForward, MoreVertical, ChevronRight, ChevronLeft, Plus, Square } from 'lucide-react-native';
import Animated, { FadeInRight, FadeInLeft, FadeOutLeft, FadeOutRight } from 'react-native-reanimated';

import { useActiveWorkout } from '@/store/useActiveWorkout';
import { useRestTimer } from '@/store/useRestTimer';
import { Screen } from '@/components/ui/Screen';
import { useWorkout } from '@/hooks/useWorkout';
import { useSetCompletion } from '@/hooks/useSetCompletion';
import { useSupersetNavigation } from '@/hooks/useSupersetNavigation';
import { useWorkoutTimer } from '@/hooks/useWorkoutTimer';
import { SetRow } from '@/components/cards/set-row';
import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { Badge } from '@/components/ui/badge';
import { getExerciseName } from '@/utils/exercise';
import { WorkoutHeader } from '@/components/workout/WorkoutHeader';

export default function ActiveWorkoutScreen() {
  const theme = useTheme();
  const workoutService = useWorkout();

  const workoutId = useActiveWorkout(s => s.workoutId);
  const routineId = useActiveWorkout(s => s.routineId);
  const routineName = useActiveWorkout(s => s.routineName);
  const exercises = useActiveWorkout(s => s.exercises);
  const currentExerciseIndex = useActiveWorkout(s => s.currentExerciseIndex);
  const cancelWorkout = useActiveWorkout(s => s.cancelWorkout);
  const clearStore = useActiveWorkout(s => s.finishWorkout);
  const addSetStore = useActiveWorkout(s => s.addSet);
  const addExercise = useActiveWorkout(s => s.addExercise);
  const updateSetValues = useActiveWorkout(s => s.updateSetValues);
  const skipExercise = useActiveWorkout(s => s.skipExercise);
  const setCurrentExercise = useActiveWorkout(s => s.setCurrentExercise);
  const removeExercise = useActiveWorkout(s => s.removeExercise);
  const moveExerciseToEnd = useActiveWorkout(s => s.moveExerciseToEnd);

  //--------------estado------------
  const [search, setSearch] = React.useState('');
  const [allExercises, setAllExercises] = React.useState<any[]>([]);
  const [isFocusMode, setIsFocusMode] = React.useState(false);
  const [focusedSetId, setFocusedSetId] = React.useState<string | null>(null);
  const [selectedExerciseId, setSelectedExerciseId] = React.useState<string | null>(null);
  const [navDirection, setNavDirection] = React.useState<'forward' | 'back'>('forward');
  const [weightSuggestion, setWeightSuggestion] = React.useState<WeightSuggestion | null>(null); 

  //--------------Hooks------------
  const { formattedTime } = useWorkoutTimer();
  const restTimerIsActive = useRestTimer(s => s.isActive);
  const restRemainingSeconds = useRestTimer(s => s.getRemainingSeconds());
  const { completeSet } = useSetCompletion();
  const { isCurrentGroupCompleted, moveToNextExercise } = useSupersetNavigation();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const optionsSheetRef = useRef<BottomSheet>(null);

  //-------------Derivados del ejercicio actual
  const currentExercise = exercises[currentExerciseIndex];
  const isFirst = currentExerciseIndex === 0;
  const isLast = currentExerciseIndex === exercises.length - 1;
  const completedSets = currentExercise?.sets.filter(s => s.isCompleted).length ?? 0;
  const totalSets = currentExercise?.sets.length ?? 0;

  const previousWeight = weightSuggestion?.lastWeight != null && weightSuggestion?.lastReps != null
    ? `${weightSuggestion.lastWeight} kg × ${weightSuggestion.lastReps}`
    : null;
  const suggestedWeight = weightSuggestion?.suggestedWeight != null
    ? `${weightSuggestion.suggestedWeight} kg`
    : null;
  const suggestionBasis = weightSuggestion?.basis ?? null;
  const suggestionMessage = weightSuggestion?.message ?? null;

  //--------------Effects------------
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setAllExercises([]); // Placeholder
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    };
    fetchExercises();
  }, []);

  useEffect(() => {
    if (!currentExercise?.exerciseId) return;
    let cancelled = false;

    workoutService.suggestWeight(currentExercise.exerciseId)
      .then((suggestion) => {
        if (!cancelled) {
          console.debug('suggestWeight', suggestion);
          setWeightSuggestion(suggestion);
        }
      })
      .catch((err) => {
        console.warn('suggestWeight error', err);
        if (!cancelled) setWeightSuggestion(null);
      });

    return () => { cancelled = true; };
  }, [currentExercise?.exerciseId, workoutService]);

  const filteredExercises = allExercises.filter(e =>
    getExerciseName(e).toLowerCase().includes(search.toLowerCase())
  );

  const handleSupersetCompletion = useCallback(() => {
    if (isCurrentGroupCompleted()) {
      setTimeout(() => moveToNextExercise(), 1000);
    }
  }, [isCurrentGroupCompleted, moveToNextExercise]);

  const handleCancel = useCallback(() => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      '¿Cancelar entrenamiento?',
      'Se perderá todo el progreso no guardado.',
      [
        { text: 'No, continuar', style: 'cancel' },
        { text: 'Sí, salir', style: 'destructive', onPress: () => { cancelWorkout(); expoRouter.back(); } },
      ],
      { cancelable: false }
    );
  }, [cancelWorkout]);

  useEffect(() => {
    const backAction = () => { handleCancel(); return true; };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [handleCancel]);

  const handleFinish = useCallback(async () => {
    if (!workoutId) return;
    try {
      await workoutService.finishWorkout(workoutId);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show({ type: 'success', text1: '¡Entrenamiento Guardado!', text2: 'Felicidades por completar tu sesión.', position: 'top' });
      clearStore();
      expoRouter.replace({ pathname: '/(workouts)/summary' as any, params: { id: workoutId } });
    } catch {
      Toast.show({ type: 'error', text1: 'Error', text2: 'No se pudo guardar el entrenamiento' });
    }
  }, [workoutId, clearStore, workoutService]);

  const goToNext = useCallback(() => {
    if (isLast) { handleFinish(); return; }
    setNavDirection('forward');
    setCurrentExercise(currentExerciseIndex + 1);
    setFocusedSetId(null);
  }, [isLast, currentExerciseIndex, setCurrentExercise, handleFinish]);

  const goToPrev = useCallback(() => {
    if (isFirst) return;
    setNavDirection('back');
    setCurrentExercise(currentExerciseIndex - 1);
    setFocusedSetId(null);
  }, [isFirst, currentExerciseIndex, setCurrentExercise]);

  const onSetToggle = useCallback(async (exerciseId: string, setId: string, currentlyCompleted: boolean) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);

    if (exercise && !currentlyCompleted) {
      const setIndex = exercise.sets.findIndex(s => s.id === setId);
      const currentSet = exercise.sets[setIndex];
      const previousSet = setIndex > 0 ? exercise.sets[setIndex - 1] : null;

      if (currentSet && previousSet && currentSet.weight <= 0 && previousSet.weight > 0) {
        updateSetValues(exerciseId, setId, { weight: previousSet.weight });
      }
    }

    await completeSet(exerciseId, setId, currentlyCompleted);

    if (exercise && !currentlyCompleted) {
      const setIndex = exercise.sets.findIndex(s => s.id === setId);
      if (setIndex < exercise.sets.length - 1) {
        setFocusedSetId(exercise.sets[setIndex + 1].id);
      } else {
        setFocusedSetId(null);
      }
    }

    handleSupersetCompletion();
  }, [completeSet, exercises, handleSupersetCompletion, updateSetValues]);

  const addSet = useCallback((exerciseId: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addSetStore(exerciseId);
  }, [addSetStore]);

  const handleSkipExercise = useCallback((exerciseId: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    skipExercise(exerciseId);
    if (!isLast) goToNext();
  }, [skipExercise, isLast, goToNext]);

  const handleAddExerciseSelection = useCallback((item: any) => {
    addExercise({
      id: Math.random().toString(36).substring(2, 9),
      exerciseId: item.exerciseId,
      name: item.name,
      nameEs: item.nameEs,
      sets: [{ id: Math.random().toString(36).substring(2, 9), weight: 0, reps: 0, isCompleted: false, type: 'normal' }],
    });
    bottomSheetRef.current?.close();
    setSearch('');
  }, [addExercise]);

  if (!currentExercise) return null;

  const isSkipped = currentExercise.status === 'skipped';
  const enterAnim = navDirection === 'forward' ? FadeInRight.duration(220) : FadeInLeft.duration(220);
  const exitAnim = navDirection === 'forward' ? FadeOutLeft.duration(180) : FadeOutRight.duration(180);

  return (
    <Screen scroll={false} safeAreaEdges={['top', 'left', 'right']}>
      {/* Header */}
      <WorkoutHeader
        formattedTime={formattedTime}
        routineName={routineName}
        currentExerciseIndex={currentExerciseIndex}
        totalExercises={exercises.length}
        isFocusMode={isFocusMode}
        onToggleFocus={() => setIsFocusMode(!isFocusMode)}
        onCancel={handleCancel}
        onFinish={handleFinish}
      />

      {/* Progress Bar */}
      <YStack height={3} backgroundColor="$borderColor" width="100%">
        <YStack
          height="100%"
          backgroundColor="$primary"
          width={`${((currentExerciseIndex + 1) / exercises.length) * 100}%`}
        />
      </YStack>

      {/* Rest Timer chip */}
      {restTimerIsActive && (
        <YStack
          borderRadius="$xl"
          backgroundColor="$primarySubtle"
          borderColor="$primary"
          borderWidth={1}
          paddingHorizontal="$sm"
          paddingVertical="$xs"
          alignSelf="center"
          marginTop="$sm"
        >
          <AppText variant="label" color="primary" fontWeight="700">
            DESCANSO: {Math.max(0, restRemainingSeconds)}s
          </AppText>
        </YStack>
      )}

      {/* Exercise View — single exercise at a time */}
      <Animated.View
        key={currentExercise.id}
        entering={enterAnim}
        exiting={exitAnim}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 140, flexGrow: 1, justifyContent: 'center' }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Exercise Title + Actions */}
          <XStack
            justifyContent="space-between"
            alignItems="center"
            paddingHorizontal="$xl"
            paddingTop="$lg"
            paddingBottom="$sm"
          >
            <YStack flex={1} marginRight="$md">
              <AppText variant="titleMd" numberOfLines={2}>
                {getExerciseName(currentExercise)}
              </AppText>
              <AppText variant="bodySm" color="textSecondary" marginTop="$xs">
                {completedSets}/{totalSets} sets completados
              </AppText>
            </YStack>

            <XStack alignItems="center" gap="$sm">
              {!isSkipped && (
                <Pressable onPress={() => handleSkipExercise(currentExercise.id)} accessibilityLabel="Saltar ejercicio">
                  <XStack
                    alignItems="center"
                    gap="$xs"
                    backgroundColor="$surfaceSecondary"
                    paddingHorizontal="$sm"
                    paddingVertical="$xs"
                    borderRadius="$md"
                  >
                    <AppIcon icon={SkipForward} color="textTertiary" size={14} />
                    <AppText variant="label" color="textTertiary">Saltar</AppText>
                  </XStack>
                </Pressable>
              )}
              {isSkipped && <Badge label="OMITIDO" variant="danger" size="sm" />}
              <Pressable
                onPress={() => { setSelectedExerciseId(currentExercise.id); optionsSheetRef.current?.snapToIndex(0); }}
                accessibilityLabel="Opciones del ejercicio"
              >
                <YStack padding="$xs">
                  <AppIcon icon={MoreVertical} color="textTertiary" size={20} />
                </YStack>
              </Pressable>
            </XStack>
          </XStack>

          {/* Previous & Suggested Weight Cards */}
          {(previousWeight || suggestedWeight) && (
            <XStack gap="$sm" paddingHorizontal="$xl" marginBottom="$lg">
              {previousWeight && (
                <YStack
                  flex={1}
                  backgroundColor="$surface"
                  borderRadius="$lg"
                  borderCurve="continuous"
                  borderWidth={1}
                  borderColor="$borderColor"
                  padding="$md"
                >
                  <AppText variant="label" color="textTertiary" marginBottom="$xs">
                    PESO ANTERIOR
                  </AppText>
                  <AppText variant="titleSm" tabularNums>
                    {previousWeight}
                  </AppText>
                </YStack>
              )}
              {suggestedWeight && (
                <YStack
                  flex={1}
                  backgroundColor="$primarySubtle"
                  borderRadius="$lg"
                  borderCurve="continuous"
                  borderWidth={1}
                  borderColor="$primary"
                  padding="$md"
                >
                  <AppText variant="label" color="primary" marginBottom="$xs">
                    SUGERIDO
                  </AppText>
                  <AppText variant="titleSm" color="primary" tabularNums>
                    {suggestedWeight}
                  </AppText>
                  {(suggestionBasis === 'deload' || suggestionBasis === 'failure_recovery') && suggestionMessage && (
                    <AppText variant="label" color="warning" marginTop="$xs" numberOfLines={2}>
                      {suggestionMessage}
                    </AppText>
                  )}
                </YStack>
              )}
            </XStack>
          )}

          {/* Sets Table */}
          {!isSkipped && (
            <YStack paddingHorizontal="$xl">
              {/* Column headers */}
              <XStack marginBottom="$xs" paddingHorizontal={4} alignItems="center">
                <AppText variant="label" color="textTertiary" width={32} textAlign="center">SET</AppText>
                <AppText variant="label" color="textTertiary" flex={1.2} textAlign="center">KG</AppText>
                <AppText variant="label" color="textTertiary" flex={1} textAlign="center">REPS</AppText>
                <YStack width={44} />
              </XStack>

              {/* Set Rows */}
              <YStack gap="$xs">
                {currentExercise.sets.map((set, setIndex) => {
                  const previousWeight = setIndex > 0 ? currentExercise.sets[setIndex - 1].weight : 0;
                  return (
                    <SetRow
                      key={set.id}
                      index={setIndex}
                      setRef={set}
                      previousWeight={previousWeight}
                      autoFocus={set.id === focusedSetId}
                      onUpdate={(values) => updateSetValues(currentExercise.id, set.id, values)}
                      onToggleComplete={() => onSetToggle(currentExercise.id, set.id, set.isCompleted)}
                      onRemove={() => useActiveWorkout.getState().removeSet(currentExercise.id, set.id)}
                    />
                  );
                })}
              </YStack>

              {/* Add Set */}
              <Pressable onPress={() => addSet(currentExercise.id)} accessibilityLabel="Añadir nuevo set">
                <XStack
                  alignItems="center"
                  justifyContent="center"
                  borderWidth={1.5}
                  borderStyle="dashed"
                  borderColor="$borderColor"
                  borderRadius="$lg"
                  borderCurve="continuous"
                  paddingVertical="$md"
                  marginTop="$md"
                  gap="$xs"
                >
                  <AppIcon icon={Plus} color="textTertiary" size={16} />
                  <AppText variant="bodyMd" color="textTertiary" fontWeight="600">
                    Añadir set
                  </AppText>
                </XStack>
              </Pressable>
            </YStack>
          )}
        </ScrollView>
      </Animated.View>

      {/* Bottom Navigation Bar */}
      <YStack
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        backgroundColor="$surface"
        borderTopWidth={1}
        borderTopColor="$borderColor"
        paddingBottom="$xl"
        paddingTop="$md"
        paddingHorizontal="$xl"
      >
        <XStack alignItems="center" gap="$sm">
          {/* Prev button */}
          <Pressable onPress={goToPrev} disabled={isFirst} accessibilityLabel="Ejercicio anterior">
            <YStack
              width={52}
              height={52}
              borderRadius="$lg"
              borderCurve="continuous"
              alignItems="center"
              justifyContent="center"
              backgroundColor="$surfaceSecondary"
              opacity={isFirst ? 0.3 : 1}
            >
              <AppIcon icon={ChevronLeft} color="color" size={22} />
            </YStack>
          </Pressable>

          {/* Add exercise button */}
          <Pressable onPress={() => bottomSheetRef.current?.snapToIndex(1)} accessibilityLabel="Añadir ejercicio">
            <YStack
              width={52}
              height={52}
              borderRadius="$lg"
              borderCurve="continuous"
              alignItems="center"
              justifyContent="center"
              backgroundColor="$surfaceSecondary"
            >
              <AppIcon icon={Plus} color="color" size={22} />
            </YStack>
          </Pressable>

          {/* Rest timer button (manual) */}
          <Pressable onPress={() => expoRouter.push('/(workouts)/rest-timer')} accessibilityLabel="Abrir timer de descanso">
            <YStack
              width={52}
              height={52}
              borderRadius="$lg"
              borderCurve="continuous"
              alignItems="center"
              justifyContent="center"
              backgroundColor={restTimerIsActive ? '$successSubtle' : '$surfaceSecondary'}
              borderWidth={1}
              borderColor={restTimerIsActive ? '$success' : '$borderColor'}
            >
              <AppIcon icon={Square} color={restTimerIsActive ? 'success' : 'color'} size={22} />
            </YStack>
          </Pressable>

          {/* Next / Finish button */}
          <Pressable onPress={goToNext} style={{ flex: 1 }} accessibilityLabel={isLast ? 'Finalizar entrenamiento' : 'Siguiente ejercicio'}>
            <XStack
              flex={1}
              height={52}
              borderRadius="$lg"
              borderCurve="continuous"
              alignItems="center"
              justifyContent="center"
              backgroundColor="$primary"
              gap="$sm"
            >
              <AppText variant="bodyMd" color="background" fontWeight="700">
                {isLast ? 'Finalizar' : 'Siguiente ejercicio'}
              </AppText>
              <AppIcon icon={ChevronRight} color="background" size={20} />
            </XStack>
          </Pressable>
        </XStack>
      </YStack>

      {/* Exercise Picker Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['50%', '90%']}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: theme.surfaceSecondary?.val as string }}
        handleIndicatorStyle={{ backgroundColor: theme.textTertiary?.val as string }}
      >
        <BottomSheetView style={{ flex: 1, padding: 12 }}>
          <XStack justifyContent="space-between" alignItems="center" marginBottom="$md">
            <AppText variant="titleSm">Añadir Ejercicio</AppText>
            <Pressable onPress={() => bottomSheetRef.current?.close()} accessibilityLabel="Cerrar">
              <AppIcon icon={X} color="textSecondary" size={24} />
            </Pressable>
          </XStack>

          <XStack
            alignItems="center"
            gap="$sm"
            height={48}
            borderRadius="$lg"
            paddingHorizontal="$md"
            backgroundColor="$surface"
            marginBottom="$md"
          >
            <AppIcon icon={Search} color="textTertiary" size={20} />
            <BottomSheetTextInput
              style={{ flex: 1, color: theme.color?.val as string, fontSize: 16 }}
              placeholder="Ej. Press de banca..."
              placeholderTextColor={theme.textTertiary?.val as string}
              value={search}
              onChangeText={setSearch}
            />
          </XStack>

          <BottomSheetFlatList
            data={filteredExercises}
            keyExtractor={(item: any) => item.id}
            renderItem={({ item }: any) => (
              <Pressable onPress={() => handleAddExerciseSelection(item)}>
                <XStack alignItems="center" borderBottomColor="$borderColor" borderBottomWidth={1} paddingVertical="$md">
                  <YStack flex={1}>
                    <AppText variant="subtitle">{getExerciseName(item)}</AppText>
                    <AppText variant="label" color="textSecondary">
                      {item.primaryMuscles?.join(', ') || 'other'} · {item.equipment}
                    </AppText>
                  </YStack>
                  <AppIcon icon={Check} color="primary" size={20} />
                </XStack>
              </Pressable>
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
        backgroundStyle={{ backgroundColor: theme.surfaceSecondary?.val as string }}
        handleIndicatorStyle={{ backgroundColor: theme.textTertiary?.val as string }}
      >
        <BottomSheetView style={{ flex: 1, padding: 12 }}>
          <XStack justifyContent="space-between" alignItems="center" marginBottom="$lg">
            <AppText variant="titleSm">Opciones de Ejercicio</AppText>
            <Pressable onPress={() => optionsSheetRef.current?.close()} accessibilityLabel="Cerrar">
              <AppIcon icon={X} color="textSecondary" size={24} />
            </Pressable>
          </XStack>

          <Pressable
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
            <XStack alignItems="center" borderBottomColor="$borderColor" borderBottomWidth={1} paddingVertical="$md">
              <AppText variant="bodyMd" flex={1}>Sustituir Ejercicio</AppText>
              <AppIcon icon={ChevronRight} color="textTertiary" size={20} />
            </XStack>
          </Pressable>

          <Pressable
            onPress={() => {
              if (routineId) {
                optionsSheetRef.current?.close();
                expoRouter.push({ pathname: `/routine/${routineId}` } as any);
              }
            }}
          >
            <XStack alignItems="center" borderBottomColor="$borderColor" borderBottomWidth={1} paddingVertical="$md">
              <AppText variant="bodyMd">Editar Rutina</AppText>
            </XStack>
          </Pressable>

          <Pressable
            onPress={() => {
              if (selectedExerciseId) {
                moveExerciseToEnd(selectedExerciseId);
                optionsSheetRef.current?.close();
                Toast.show({ type: 'success', text1: 'Movido al final', position: 'top' });
              }
            }}
          >
            <XStack alignItems="center" borderBottomColor="$borderColor" borderBottomWidth={1} paddingVertical="$md">
              <AppText variant="bodyMd">Mover al final</AppText>
            </XStack>
          </Pressable>

          <Pressable
            onPress={() => {
              if (selectedExerciseId) {
                Alert.alert('¿Eliminar Ejercicio?', 'Se borrará permanentemente de este entrenamiento.', [
                  { text: 'Cancelar', style: 'cancel' },
                  {
                    text: 'Eliminar', style: 'destructive', onPress: () => {
                      removeExercise(selectedExerciseId);
                      optionsSheetRef.current?.close();
                    }
                  },
                ]);
              }
            }}
          >
            <XStack alignItems="center" paddingVertical="$md">
              <AppText variant="bodyMd" color="danger" fontWeight="700">Eliminar Ejercicio</AppText>
            </XStack>
          </Pressable>
        </BottomSheetView>
      </BottomSheet>
    </Screen>
  );
}