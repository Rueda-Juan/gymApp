import { XStack, YStack, View } from 'tamagui';
import React, { useMemo } from 'react';
import { Pressable, ScrollView } from 'react-native';
import Animated, { FadeInRight, FadeInLeft, FadeOutLeft, FadeOutRight, FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { ArrowRightLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomBarProvider, useBottomBarHeightContext } from '@/context/BottomBarHeightContext';

import { useActiveWorkout } from '@/store/useActiveWorkout';
import { useRestTimer } from '@/store/useRestTimer';
import { useSettings } from '@/store/useSettings';
import { Screen } from '@/components/ui/Screen';
import { useSupersetCarousel } from '@/hooks/useSupersetCarousel';
import { useSupersetFlow } from '@/hooks/useSupersetFlow';
import { useWorkoutTimer } from '@/hooks/useWorkoutTimer';
import { useRestTimerAnimation } from '@/hooks/useRestTimerAnimation';
import { usePreviousSets } from '@/hooks/usePreviousSets';
import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { getExerciseName } from '@/utils/exercise';
import { WorkoutHeader } from '@/components/workout/WorkoutHeader';
import { ActiveWorkoutExerciseDetail } from '@/components/workout/ActiveWorkoutExerciseDetail';
import { PlateCalculatorSheet } from '@/components/workout/PlateCalculatorModal';
import { ActiveWorkoutRestTimerChip } from '@/components/workout/ActiveWorkoutRestTimerChip';
import { ActiveWorkoutBottomBar } from '@/components/workout/ActiveWorkoutBottomBar';
import { ActiveWorkoutExercisePickerSheet } from '@/components/workout/ActiveWorkoutExercisePickerSheet';
import { ActiveWorkoutOptionsSheet } from '@/components/workout/ActiveWorkoutOptionsSheet';
import { WorkoutSessionNoteSheet } from '@/components/workout/WorkoutSessionNoteSheet';
import { motion } from '@/constants/motion';
import { useMotion } from '@/hooks/useMotion';
import { useActiveWorkoutController } from '@/hooks/useActiveWorkoutController';
import { UndoToast } from '@/components/ui/UndoToast';
import { PRCelebrationOverlay } from '@/components/workout/PRCelebrationOverlay';

const SUPERSET_TAB_HEIGHT = 52;
const SUPERSET_TAB_BORDER_RADIUS = 20;

export default function ActiveWorkoutScreen() {
  const m = useMotion();
  const routineId = useActiveWorkout(s => s.routineId);
  const routineName = useActiveWorkout(s => s.routineName);
  const exercises = useActiveWorkout(s => s.exercises);
  const currentExerciseIndex = useActiveWorkout(s => s.currentExerciseIndex);
  const updateSetValues = useActiveWorkout(s => s.updateSetValues);
  const sessionNote = useActiveWorkout(s => s.sessionNote);
  const setSessionNote = useActiveWorkout(s => s.setSessionNote);
  const pendingDeletions = useActiveWorkout(s => s.pendingDeletionsByExercise);

  const globalRestSeconds = useSettings(s => s.restTimerSeconds);
  const insets = useSafeAreaInsets();

  const { formattedTime } = useWorkoutTimer();
  const restTimerIsActive = useRestTimer(s => s.isActive);
  const { restDisplaySeconds, hourglassAnimatedStyle, restProgressStyle } = useRestTimerAnimation();

  const currentExercise = exercises[currentExerciseIndex];

  const {
    isInSuperset,
    supersetOrder,
    supersetCarouselIndex,
    supersetTransitionName,
    setSupersetCarouselIndex,
    supersetGroupExercises,
  } = useSupersetCarousel(exercises, currentExerciseIndex);

  const { scrollRef, registerLayout, scrollToExercise } = useSupersetFlow();

  const { bottomBarHeight } = useBottomBarHeightContext ? useBottomBarHeightContext() : { bottomBarHeight: 0 };

  const handleSupersetSetComplete = () => {
    if (!isInSuperset) return;
    const nextIdx = (supersetCarouselIndex + 1) % supersetOrder.length;
    setSupersetCarouselIndex(nextIdx);
    const nextId = supersetOrder[nextIdx];
    if (nextId) setTimeout(() => scrollToExercise(nextId, bottomBarHeight), 100);
  };

  const activeExercise = isInSuperset ? exercises.find(ex => ex.id === supersetOrder[supersetCarouselIndex]) : currentExercise;

  const { state, actions } = useActiveWorkoutController({
    activeExerciseId: activeExercise?.exerciseId,
    isInSuperset,
    onSupersetSetComplete: handleSupersetSetComplete,
    supersetOrder,
    supersetCarouselIndex,
    supersetGroupExercises
  });

  const { resolvePreviousWeight } = usePreviousSets(activeExercise?.exerciseId);
  
  const showUndoToast = !!activeExercise && pendingDeletions[activeExercise.id]?.length > 0;

  const nextExercise = exercises[currentExerciseIndex + 1];
  const nextExerciseName = nextExercise ? getExerciseName(nextExercise) : null;

  const allSetsCompleted = exercises.length > 0 &&
    exercises.every(ex => ex.status === 'skipped' || ex.sets.every(s => s.isCompleted));

  const suggestedWeight = state.weightSuggestion?.suggestedWeight != null
    ? `${state.weightSuggestion.suggestedWeight} kg`
    : null;
  const suggestionMessage = state.weightSuggestion?.message ?? null;

  const enterAnim = useMemo(
    () => m.entering(state.navDirection === 'forward' ? FadeInRight.duration(motion.duration.normal) : FadeInLeft.duration(motion.duration.normal)),
    [state.navDirection, m.isReduced, m.entering],
  );
  const exitAnim = useMemo(
    () => m.exiting(state.navDirection === 'forward' ? FadeOutLeft.duration(motion.duration.fast) : FadeOutRight.duration(motion.duration.fast)),
    [state.navDirection, m.isReduced, m.exiting],
  );

  if (!currentExercise) return null;

  function RenderContents() {
    const { bottomBarHeight } = useBottomBarHeightContext();

    const handleSupersetSetComplete = () => {
      if (!isInSuperset) return;
      const nextIdx = (supersetCarouselIndex + 1) % supersetOrder.length;
      setSupersetCarouselIndex(nextIdx);
      const nextId = supersetOrder[nextIdx];
      if (nextId) setTimeout(() => scrollToExercise(nextId, bottomBarHeight), 100);
    };

    return (
      <Screen scroll={false} safeAreaEdges={['top', 'left', 'right']}>
      <WorkoutHeader
        formattedTime={formattedTime}
        routineName={routineName ?? ''}
        currentExerciseIndex={currentExerciseIndex}
        totalExercises={exercises.length}
        isFocusMode={state.isFocusMode}
        onToggleFocus={actions.setIsFocusMode}
        onCancel={actions.handleCancel}
        onFinish={actions.handleFinish}
        allSetsCompleted={allSetsCompleted}
        sessionNote={sessionNote}
        onNotePress={() => state.noteSheetRef.current?.expand()}
      />

      <ActiveWorkoutRestTimerChip
        isVisible={restTimerIsActive}
        restDisplaySeconds={restDisplaySeconds}
        restProgressStyle={restProgressStyle}
        onDecrease={actions.handleDecreaseTimer}
        onIncrease={actions.handleIncreaseTimer}
      />

      {isInSuperset && supersetOrder.length > 0 ? (
        <YStack flex={1}>
          <Animated.ScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            style={{ flex: 1, paddingBottom: bottomBarHeight }}
          >
            {/* Mechanical Connector Line */}
            <View 
              position="absolute"
              left={20}
              top={80}
              bottom={120}
              width={2}
              backgroundColor="$primary"
              opacity={0.3}
              borderRadius={1}
            />

            {supersetOrder.map((exId, idx) => {
              const carouselExercise = exercises.find(ex => ex.id === exId);
              if (!carouselExercise) return null;
              const isActive = idx === supersetCarouselIndex;

              return (
                <YStack 
                  key={exId} 
                  onLayout={(e) => registerLayout(exId, e.nativeEvent.layout.y, e.nativeEvent.layout.height)}
                  opacity={isActive ? 1 : 0.4}
                  scale={isActive ? 1 : 0.98}
                >
                  <ActiveWorkoutExerciseDetail
                    exercise={carouselExercise}
                    focusedSetId={state.focusedSetId}
                    suggestedWeight={suggestedWeight}
                    suggestionMessage={suggestionMessage}
                    onSkipExercise={actions.handleSkipExercise}
                    onOpenOptions={actions.openOptionsForExercise}
                    onUpdateSetValues={updateSetValues}
                    onToggleSet={actions.onSetToggle}
                    onRemoveSet={actions.handleRemoveSet}
                    onAddSet={actions.addSet}
                    resolvePreviousWeight={resolvePreviousWeight}
                    scrollEnabled={false}
                    isSupersetMember={true}
                  />
                </YStack>
              );
            })}
          </Animated.ScrollView>
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
            focusedSetId={state.focusedSetId}
            suggestedWeight={suggestedWeight}
            suggestionMessage={suggestionMessage}
            onSkipExercise={actions.handleSkipExercise}
            onOpenOptions={actions.openOptionsForExercise}
            onUpdateSetValues={updateSetValues}
            onToggleSet={actions.onSetToggle}
            onRemoveSet={actions.handleRemoveSet}
            onAddSet={actions.addSet}
            resolvePreviousWeight={resolvePreviousWeight}
          />
        </Animated.View>
      )}

      <ActiveWorkoutBottomBar
        isFirst={state.isFirst}
        isLast={state.isLast}
        isFinishing={state.isFinishing}
        sessionNote={sessionNote}
        restTimerIsActive={restTimerIsActive}
        restDisplaySeconds={restDisplaySeconds}
        insetsBottom={insets.bottom}
        hourglassAnimatedStyle={hourglassAnimatedStyle}
        onPrev={actions.goToPrev}
        onOpenNote={() => state.noteSheetRef.current?.expand()}
        onOpenRestTimer={actions.handleOpenRestTimer}
        onNext={actions.goToNext}
        onOpenPlateCalculator={() => actions.openPlateCalculator(activeExercise?.sets ?? [])}
        nextExerciseName={nextExerciseName}
      />

      <UndoToast
        visible={showUndoToast}
        message="Set eliminado"
        onUndo={() => actions.handleUndoSetDeletion(activeExercise?.id || '')}
        bottomOffset={insets.bottom + 100}
      />
      
      <PRCelebrationOverlay 
        visible={state.showPRCelebration} 
        onFinished={() => {}}
      />

      <PlateCalculatorSheet
        ref={state.plateCalcSheetRef}
        onClose={() => actions.setShowPlateCalculator(false)}
        sets={activeExercise?.sets ?? []}
        selectedSetIndex={state.plateCalcSetIndex}
        onSelectSet={actions.setPlateCalcSetIndex}
      />

      <ActiveWorkoutExercisePickerSheet
        sheetRef={state.bottomSheetRef}
        search={state.search}
        filteredExercises={state.filteredExercises}
        onChangeSearch={actions.setSearch}
        onClose={() => state.bottomSheetRef.current?.close()}
        onSelectExercise={actions.handleAddExerciseSelection}
      />

      <ActiveWorkoutOptionsSheet
        sheetRef={state.optionsSheetRef}
        routineId={routineId}
        selectedExerciseId={state.selectedExerciseId}
        exercises={exercises}
        allExercises={state.allExercises}
        globalRestSeconds={globalRestSeconds}
        onClose={() => state.optionsSheetRef.current?.close()}
        onOpenExercisePicker={actions.handleOpenExercisePickerFromOptions}
        onReplaceExercise={actions.handleReplaceExercise}
        onEditRoutine={actions.handleEditRoutine}
        onMoveExerciseToEnd={actions.handleMoveExerciseToEnd}
        onRemoveExercise={actions.handleRemoveExercise}
        onSetRestTimerSeconds={actions.handleSetRestTimerSeconds}
      />

      <WorkoutSessionNoteSheet
        sheetRef={state.noteSheetRef}
        value={sessionNote ?? ''}
        onChangeText={setSessionNote}
        onClose={() => state.noteSheetRef.current?.close()}
      />
    </Screen>
    );
  }

  return (
    <BottomBarProvider initialSafeAreaBottom={insets.bottom}>
      <RenderContents />
    </BottomBarProvider>
  );
}