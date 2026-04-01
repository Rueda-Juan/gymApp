import { XStack, YStack } from 'tamagui';
import React, { useEffect, useCallback, useMemo, useRef, useState } from 'react';
import type { WeightSuggestion } from 'backend/shared/types';
import type { Exercise } from 'backend/domain/entities/Exercise';
import { Alert, BackHandler, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { router as expoRouter } from 'expo-router';
import BottomSheet from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInRight, FadeInLeft, FadeOutLeft, FadeOutRight, FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { ArrowRightLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useActiveWorkout } from '@/store/useActiveWorkout';
import { useRestTimer } from '@/store/useRestTimer';
import { useSettings } from '@/store/useSettings';
import { Screen } from '@/components/ui/Screen';
import { useWorkout } from '@/hooks/useWorkout';
import { useExercises } from '@/hooks/useExercises';
import { useSetCompletion } from '@/hooks/useSetCompletion';
import { useSupersetNavigation } from '@/hooks/useSupersetNavigation';
import { useWorkoutTimer } from '@/hooks/useWorkoutTimer';
import { useRestTimerAnimation } from '@/hooks/useRestTimerAnimation';
import { usePreviousSets } from '@/hooks/usePreviousSets';
import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { getExerciseName } from '@/utils/exercise';
import { WorkoutHeader } from '@/components/workout/WorkoutHeader';
import { ActiveWorkoutExerciseDetail } from '@/components/workout/ActiveWorkoutExerciseDetail';
import { ActiveWorkoutRestTimerChip } from '@/components/workout/ActiveWorkoutRestTimerChip';
import { ActiveWorkoutBottomBar } from '@/components/workout/ActiveWorkoutBottomBar';
import { ActiveWorkoutExercisePickerSheet } from '@/components/workout/ActiveWorkoutExercisePickerSheet';
import { ActiveWorkoutOptionsSheet } from '@/components/workout/ActiveWorkoutOptionsSheet';
import { WorkoutSessionNoteSheet } from '@/components/workout/WorkoutSessionNoteSheet';
import { createClientId } from '@/utils/clientId';
import { useWorkoutSummary } from '../../store/useWorkoutSummary';

export default function ActiveWorkoutScreen() {
  const workoutService = useWorkout();
  const exerciseService = useExercises();
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
  const sessionNote = useActiveWorkout(s => s.sessionNote);
  const setSessionNote = useActiveWorkout(s => s.setSessionNote);
  const setNewRecords = useWorkoutSummary(s => s.setNewRecords);

  const adjustTimer = useRestTimer(s => s.adjustTimer);

  //--------------estado------------
  const [search, setSearch] = React.useState('');
  const [allExercises, setAllExercises] = React.useState<Exercise[]>([]);
  const [isFocusMode, setIsFocusMode] = React.useState(false);
  const [focusedSetId, setFocusedSetId] = React.useState<string | null>(null);
  const [selectedExerciseId, setSelectedExerciseId] = React.useState<string | null>(null);
  const [navDirection, setNavDirection] = React.useState<'forward' | 'back'>('forward');
  const [weightSuggestion, setWeightSuggestion] = React.useState<WeightSuggestion | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const [supersetOrder, setSupersetOrder] = useState<string[]>([]);
  const [supersetCarouselIndex, setSupersetCarouselIndex] = useState(0);
  const [supersetTransitionName, setSupersetTransitionName] = useState<string | null>(null);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const supersetScrollRef = useRef<ScrollView>(null);
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  //--------------Hooks------------
  const { formattedTime } = useWorkoutTimer();
  const restTimerIsActive = useRestTimer(s => s.isActive);
  const { restDisplaySeconds, hourglassAnimatedStyle, restProgressStyle } = useRestTimerAnimation();
  const { completeSet } = useSetCompletion();
  const { moveToNextExercise } = useSupersetNavigation();
  const globalRestSeconds = useSettings(s => s.restTimerSeconds);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const optionsSheetRef = useRef<BottomSheet>(null);
  const noteSheetRef = useRef<BottomSheet>(null);

  //-------------Derivados del ejercicio actual
  const currentExercise = exercises[currentExerciseIndex];

  // Superset carousel: collect all exercises in the same supersetGroup
  const activeSupersetGroup = currentExercise?.supersetGroup ?? null;
  const supersetGroupExercises = useMemo(
    () => activeSupersetGroup != null
      ? exercises.filter(ex => ex.supersetGroup === activeSupersetGroup)
      : [],
    [activeSupersetGroup, exercises]
  );
  const isInSuperset = supersetGroupExercises.length > 1;

  // Sync supersetOrder when entering a new superset group
  const supersetIdsSignature = supersetGroupExercises.map(ex => ex.id).join('|');

  useEffect(() => {
    if (!isInSuperset) {
      setSupersetOrder(prev => prev.length === 0 ? prev : []);
      setSupersetCarouselIndex(prev => prev === 0 ? prev : 0);
      return;
    }
    const groupIds = supersetIdsSignature.split('|');
    setSupersetOrder(prev => {
      const hasChanged = groupIds.length !== prev.length ||
        groupIds.some((id, i) => id !== prev[i]);
      return hasChanged ? groupIds : prev;
    });
    setSupersetCarouselIndex(0);
  }, [isInSuperset, supersetIdsSignature]);

  // The exercise visible in the carousel (by supersetOrder)
  const visibleSupersetExercise = isInSuperset && supersetOrder.length > 0
    ? (exercises.find(ex => ex.id === supersetOrder[supersetCarouselIndex]) ?? currentExercise)
    : currentExercise;
  const isFirst = currentExerciseIndex === 0;
  const isLast = currentExerciseIndex === exercises.length - 1;
  const activeExercise = isInSuperset ? visibleSupersetExercise : currentExercise;

  const allSetsCompleted = exercises.length > 0 &&
    exercises.every(ex => ex.status === 'skipped' || ex.sets.every(s => s.isCompleted));

  const suggestedWeight = weightSuggestion?.suggestedWeight != null
    ? `${weightSuggestion.suggestedWeight} kg`
    : null;
  const suggestionMessage = weightSuggestion?.message ?? null;

  //--------------Effects------------

  // DEBUG — session overview on mount
  useEffect(() => {
    if (exercises.length === 0) return;

    const supersetGroups = new Map<number, string[]>();
    exercises.forEach(ex => {
      if (ex.supersetGroup != null) {
        const group = supersetGroups.get(ex.supersetGroup) ?? [];
        group.push(getExerciseName(ex));
        supersetGroups.set(ex.supersetGroup, group);
      }
    });

    console.debug('[Workout] Session started', {
      workoutId,
      routineName,
      totalExercises: exercises.length,
      exercises: exercises.map((ex, i) => ({
        index: i,
        name: getExerciseName(ex),
        exerciseId: ex.exerciseId,
        supersetGroup: ex.supersetGroup ?? 'none',
        sets: ex.sets.length,
      })),
      supersetGroups: Object.fromEntries(supersetGroups),
    });
  }, []);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const result = await exerciseService.getAll();
        setAllExercises(result ?? []);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    };
    fetchExercises();
  }, [exerciseService]);

  useEffect(() => {
    if (!activeExercise?.exerciseId) return;
    let cancelled = false;

    workoutService.suggestWeight(activeExercise.exerciseId)
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
  }, [activeExercise?.exerciseId, workoutService]);


  const { resolvePreviousWeight } = usePreviousSets(activeExercise?.exerciseId);

  const filteredExercises = useMemo(() =>
    allExercises.filter(e =>
      getExerciseName(e).toLowerCase().includes(search.toLowerCase())
    ),
    [allExercises, search]
  );

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
    if (!workoutId || isFinishing) return;
    setIsFinishing(true);
    try {
      const result = await workoutService.recordAllSets(workoutId, exercises);
      await workoutService.finishWorkout(workoutId);
      setNewRecords(result.newRecords);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show({ type: 'success', text1: '¡Entrenamiento Guardado!', text2: 'Felicidades por completar tu sesión.', position: 'top' });
      clearStore();
      expoRouter.replace({
        pathname: '/(workouts)/summary' as any,
        params: { id: workoutId },
      });
    } catch {
      setIsFinishing(false);
      Toast.show({ type: 'error', text1: 'Error', text2: 'No se pudo guardar. Inténtalo de nuevo.' });
    }
  }, [workoutId, isFinishing, exercises, clearStore, setNewRecords, workoutService]);

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

  const rotateSupersetCarousel = useCallback(() => {
    const nextId = supersetOrder.length > 1 ? supersetOrder[1] : null;
    const nextEx = nextId ? exercises.find(ex => ex.id === nextId) : null;

    setSupersetOrder(prev => {
      if (prev.length <= 1) return prev;
      return [...prev.slice(1), prev[0]];
    });
    setSupersetCarouselIndex(0);
    supersetScrollRef.current?.scrollTo({ x: 0, animated: true });

    if (nextEx) {
      setSupersetTransitionName(getExerciseName(nextEx));
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = setTimeout(() => setSupersetTransitionName(null), 1500);
    }
  }, [supersetOrder, exercises]);

  const onSetToggle = useCallback(async (exerciseId: string, setId: string, currentlyCompleted: boolean) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (!exercise) return;

    // In a superset, rest should only fire after the last exercise of a round completes,
    // not between exercises (A1→B1→C1 → REST, not A1→REST→B1→REST→C1→REST)
    const isLastInSupersetRound = isInSuperset
      && supersetOrder.length > 0
      && supersetOrder[0] === supersetGroupExercises[supersetGroupExercises.length - 1]?.id;
    const shouldStartRestTimer = !isInSuperset || isLastInSupersetRound;

    const completedSet = exercise.sets.find(s => s.id === setId);
    console.debug('[Workout] Set toggled', {
      exercise: getExerciseName(exercise),
      setId,
      wasCompleted: currentlyCompleted,
      setWeight: completedSet?.weight,
      setReps: completedSet?.reps,
      isSuperset: isInSuperset,
      supersetGroup: exercise.supersetGroup ?? 'none',
      shouldStartRestTimer,
    });

    await completeSet(exerciseId, setId, currentlyCompleted, exercise, shouldStartRestTimer);

    if (!currentlyCompleted) {
      setFocusedSetId(null);

      if (isInSuperset) {
        const nextExercise = supersetOrder.length > 1
          ? exercises.find(ex => ex.id === supersetOrder[1])
          : null;
        console.debug('[Workout] Superset rotation', {
          from: getExerciseName(exercise),
          to: nextExercise ? getExerciseName(nextExercise) : 'none',
          supersetOrder: supersetOrder.map(id => {
            const ex = exercises.find(e => e.id === id);
            return ex ? getExerciseName(ex) : id;
          }),
        });
        rotateSupersetCarousel();
      }

      if (shouldStartRestTimer) {
        console.debug('[Workout] Rest timer started', {
          afterExercise: getExerciseName(exercise),
          restSeconds: globalRestSeconds,
        });
      }

      // Read fresh state from the store — avoids the stale-closure bug where
      // exercises in this closure still reflect the pre-toggle snapshot
      const freshState = useActiveWorkout.getState();
      const freshCurrentEx = freshState.exercises[freshState.currentExerciseIndex];
      const isSupersetEx = freshCurrentEx?.supersetGroup != null;

      const isGroupCompleted = isSupersetEx
        ? freshState.exercises
          .filter(ex => ex.supersetGroup === freshCurrentEx.supersetGroup)
          .every(ex => ex.sets.every(s => s.isCompleted))
        : (freshCurrentEx?.sets.every(s => s.isCompleted) ?? false);

      if (isGroupCompleted) {
        console.debug('[Workout] All sets completed — auto-advancing in 1s', {
          exercise: getExerciseName(exercise),
          wasSuperset: isSupersetEx,
        });
        setTimeout(() => moveToNextExercise(), 1000);
      }
    }
  }, [completeSet, exercises, isInSuperset, rotateSupersetCarousel, moveToNextExercise, supersetOrder, supersetGroupExercises, globalRestSeconds]);

  const addSet = useCallback((exerciseId: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addSetStore(exerciseId);
  }, [addSetStore]);

  const handleSkipExercise = useCallback((exerciseId: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    skipExercise(exerciseId);
    if (!isLast) goToNext();
  }, [skipExercise, isLast, goToNext]);

  const handleAddExerciseSelection = useCallback((item: Exercise) => {
    addExercise({
      id: createClientId(),
      exerciseId: item.id,
      name: item.name,
      nameEs: item.nameEs,
      sets: [{ id: createClientId(), weight: 0, reps: 0, isCompleted: false, type: 'normal' }],
    });
    bottomSheetRef.current?.close();
    setSearch('');
  }, [addExercise]);

  const enterAnim = navDirection === 'forward' ? FadeInRight.duration(220) : FadeInLeft.duration(220);
  const exitAnim = navDirection === 'forward' ? FadeOutLeft.duration(180) : FadeOutRight.duration(180);

  const openOptionsForExercise = useCallback((exerciseId: string) => {
    setSelectedExerciseId(exerciseId);
    optionsSheetRef.current?.snapToIndex(0);
  }, []);

  const handleOpenExercisePickerFromOptions = useCallback(() => {
    optionsSheetRef.current?.close();
    setTimeout(() => bottomSheetRef.current?.snapToIndex(1), 300);
  }, []);

  const handleReplaceExercise = useCallback(({ targetId, filterMuscle, excludeEquipment }: { targetId: string; filterMuscle: string; excludeEquipment: string }) => {
    optionsSheetRef.current?.close();
    expoRouter.push({
      pathname: '/(workouts)/exercise-browser',
      params: { action: 'replace', targetId, filterMuscle, excludeEquipment },
    } as any);
  }, []);

  const handleEditRoutine = useCallback((nextRoutineId: string) => {
    optionsSheetRef.current?.close();
    expoRouter.push({ pathname: `/routine/${nextRoutineId}` } as any);
  }, []);

  const handleMoveExerciseToEnd = useCallback((exerciseId: string) => {
    moveExerciseToEnd(exerciseId);
    optionsSheetRef.current?.close();
    Toast.show({ type: 'success', text1: 'Movido al final', position: 'top' });
  }, [moveExerciseToEnd]);

  const handleRemoveExercise = useCallback((exerciseId: string) => {
    removeExercise(exerciseId);
    optionsSheetRef.current?.close();
  }, [removeExercise]);

  if (!currentExercise) return null;

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
        allSetsCompleted={allSetsCompleted}
        sessionNote={sessionNote}
        onNotePress={() => noteSheetRef.current?.expand()}
      />

      <ActiveWorkoutRestTimerChip
        isVisible={restTimerIsActive}
        restDisplaySeconds={restDisplaySeconds}
        restProgressStyle={restProgressStyle}
        onDecrease={() => adjustTimer(-15)}
        onIncrease={() => adjustTimer(15)}
      />

      {/* Exercise View — superset carousel OR single exercise */}
      {isInSuperset && supersetOrder.length > 0 ? (
        <YStack flex={1}>
          {/* Superset Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ height: 52, flexGrow: 0, flexShrink: 0 }}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              alignItems: 'center',
            }}
          >
            {supersetOrder.map((exId, tabIndex) => {
              const tabExercise = exercises.find(ex => ex.id === exId);
              if (!tabExercise) return null;
              const isActiveTab = tabIndex === supersetCarouselIndex;
              return (
                <Pressable
                  key={exId}
                  onPress={() => {
                    setSupersetCarouselIndex(tabIndex);
                    supersetScrollRef.current?.scrollTo({ x: tabIndex * (screenWidth - 32), animated: true });
                  }}
                  accessibilityLabel={`${getExerciseName(tabExercise)}, ejercicio ${tabIndex + 1} del superset`}
                >
                  <YStack
                    paddingHorizontal={12}
                    paddingVertical={6}
                    borderRadius={20}
                    borderWidth={1}
                    backgroundColor={isActiveTab ? '$primary' : '$surfaceSecondary'}
                    borderColor={isActiveTab ? '$primary' : '$borderColor'}
                  >
                    <AppText
                      variant="label"
                      color={isActiveTab ? 'background' : 'textSecondary'}
                      fontWeight={isActiveTab ? '700' : '500'}
                      numberOfLines={1}
                    >
                      {getExerciseName(tabExercise)}
                    </AppText>
                  </YStack>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Superset transition banner */}
          {supersetTransitionName && (
            <Animated.View
              entering={FadeInDown.duration(250)}
              exiting={FadeOutUp.duration(200)}
              key={supersetTransitionName}
            >
              <XStack
                alignSelf="center"
                alignItems="center"
                gap="$xs"
                backgroundColor="$primarySubtle"
                paddingHorizontal="$md"
                paddingVertical="$xs"
                borderRadius="$lg"
                marginBottom="$xs"
              >
                <AppIcon icon={ArrowRightLeft} size={14} color="primary" />
                <AppText variant="label" color="primary" fontWeight="700">
                  {supersetTransitionName}
                </AppText>
              </XStack>
            </Animated.View>
          )}

          {/* Horizontal paged carousel */}
          <ScrollView
            ref={supersetScrollRef}
            horizontal
            snapToInterval={screenWidth - 32}
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            scrollEnabled={true}
            style={{ flex: 1 }}
            onMomentumScrollEnd={(e) =>
              setSupersetCarouselIndex(Math.round(e.nativeEvent.contentOffset.x / (screenWidth - 32)))
            }
          >
            {supersetOrder.map((exId) => {
              const carouselExercise = exercises.find(ex => ex.id === exId);
              if (!carouselExercise) return null;
              return (
                <YStack key={exId} width={screenWidth - 32} style={{ flex: 1 }}>
                  <ActiveWorkoutExerciseDetail
                    exercise={carouselExercise}
                    focusedSetId={focusedSetId}
                    suggestedWeight={suggestedWeight}
                    suggestionMessage={suggestionMessage}
                    onSkipExercise={handleSkipExercise}
                    onOpenOptions={openOptionsForExercise}
                    onUpdateSetValues={updateSetValues}
                    onToggleSet={onSetToggle}
                    onRemoveSet={(exerciseId, setId) => useActiveWorkout.getState().removeSet(exerciseId, setId)}
                    onAddSet={addSet}
                    resolvePreviousWeight={resolvePreviousWeight}
                  />
                </YStack>
              );
            })}
          </ScrollView>
        </YStack>
      ) : (
        <Animated.View
          key={currentExercise.id}
          entering={enterAnim}
          exiting={exitAnim}
          style={{ flex: 1 }}
        >
          <ActiveWorkoutExerciseDetail
            exercise={currentExercise}
            focusedSetId={focusedSetId}
            suggestedWeight={suggestedWeight}
            suggestionMessage={suggestionMessage}
            onSkipExercise={handleSkipExercise}
            onOpenOptions={openOptionsForExercise}
            onUpdateSetValues={updateSetValues}
            onToggleSet={onSetToggle}
            onRemoveSet={(exerciseId, setId) => useActiveWorkout.getState().removeSet(exerciseId, setId)}
            onAddSet={addSet}
            resolvePreviousWeight={resolvePreviousWeight}
          />
        </Animated.View>
      )}

      <ActiveWorkoutBottomBar
        isFirst={isFirst}
        isLast={isLast}
        isFinishing={isFinishing}
        sessionNote={sessionNote}
        restTimerIsActive={restTimerIsActive}
        restDisplaySeconds={restDisplaySeconds}
        insetsBottom={insets.bottom}
        hourglassAnimatedStyle={hourglassAnimatedStyle}
        onPrev={goToPrev}
        onOpenNote={() => noteSheetRef.current?.expand()}
        onOpenRestTimer={() => expoRouter.push('/(workouts)/rest-timer')}
        onNext={goToNext}
      />

      <ActiveWorkoutExercisePickerSheet
        sheetRef={bottomSheetRef}
        search={search}
        filteredExercises={filteredExercises}
        onChangeSearch={setSearch}
        onClose={() => bottomSheetRef.current?.close()}
        onSelectExercise={handleAddExerciseSelection}
      />

      <ActiveWorkoutOptionsSheet
        sheetRef={optionsSheetRef}
        routineId={routineId}
        selectedExerciseId={selectedExerciseId}
        exercises={exercises}
        allExercises={allExercises}
        globalRestSeconds={globalRestSeconds}
        onClose={() => optionsSheetRef.current?.close()}
        onOpenExercisePicker={handleOpenExercisePickerFromOptions}
        onReplaceExercise={handleReplaceExercise}
        onEditRoutine={handleEditRoutine}
        onMoveExerciseToEnd={handleMoveExerciseToEnd}
        onRemoveExercise={handleRemoveExercise}
        onSetRestTimerSeconds={(seconds) => useSettings.getState().setRestTimerSeconds(seconds)}
      />

      <WorkoutSessionNoteSheet
        sheetRef={noteSheetRef}
        value={sessionNote ?? ''}
        onChangeText={setSessionNote}
        onClose={() => noteSheetRef.current?.close()}
      />
    </Screen>
  );
}