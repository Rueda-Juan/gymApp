import React, { useMemo, useEffect, useState } from 'react';
import { YStack } from 'tamagui';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSharedValue, withRepeat, withTiming, useAnimatedStyle, cancelAnimation, Easing } from 'react-native-reanimated';

import { 
  useActiveWorkout, 
  useWorkoutTimer, 
  PlateCalculatorSheet,
  usePreviousSets 
} from '@/entities/workout';
import { 
  useActiveWorkoutController,
  useRestTimer,
  ActiveWorkoutOptionsSheet,
  ActiveWorkoutExercisePickerSheet,
  WorkoutSessionNoteSheet,
  PRCelebrationOverlay
} from '@/features/activeWorkout';
import { WorkoutHeader } from './WorkoutHeader';
import { ActiveWorkoutBottomBar } from './ActiveWorkoutBottomBar';
import { ActiveWorkoutExerciseDetail } from './ActiveWorkoutExerciseDetail';
import { ROUTES } from '@/shared/constants/routes';

export function ActiveWorkoutController() {
  const insets = useSafeAreaInsets();
  
  const isActive = useActiveWorkout(s => s.isActive);
  const routineId = useActiveWorkout(s => s.routineId);
  const routineName = useActiveWorkout(s => s.routineName);
  const exercises = useActiveWorkout(s => s.exercises);
  const currentExerciseIndex = useActiveWorkout(s => s.currentExerciseIndex);
  const sessionNote = useActiveWorkout(s => s.sessionNote || '');
  const setSessionNote = useActiveWorkout(s => s.setSessionNote);
  const finishWorkoutStore = useActiveWorkout(s => s.finishWorkout);
  const cancelWorkoutStore = useActiveWorkout(s => s.cancelWorkout);
  
  const restTimerIsActive = useRestTimer(s => s.isActive);
  const getRemainingSeconds = useRestTimer(s => s.getRemainingSeconds);
  const [restRemaining, setRestRemaining] = useState(0);

  const { formattedTime } = useWorkoutTimer();
  
  const currentExercise = useMemo(() => 
    exercises[currentExerciseIndex], 
    [exercises, currentExerciseIndex]
  );

  const { actions, state } = useActiveWorkoutController({
    activeExerciseId: currentExercise?.exerciseId
  });

  const { resolvePreviousWeight } = usePreviousSets(currentExercise?.exerciseId);

  // Timer update for rest remaining
  useEffect(() => {
    if (!restTimerIsActive) {
      setRestRemaining(0);
      return;
    }
    const update = () => setRestRemaining(getRemainingSeconds());
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [restTimerIsActive, getRemainingSeconds]);

  // Hourglass animation
  const rotation = useSharedValue(0);
  useEffect(() => {
    if (restTimerIsActive) {
      rotation.value = withRepeat(
        withTiming(180, { duration: 2000, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      cancelAnimation(rotation);
      rotation.value = 0;
    }
  }, [restTimerIsActive, rotation]);

  const hourglassAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const handleFinish = () => {
    Alert.alert(
      'Finalizar entrenamiento',
      '¿Estás seguro de que quieres terminar la sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Finalizar', 
          onPress: () => {
            useRestTimer.getState().stopTimer();
            finishWorkoutStore();
            router.replace(ROUTES.WORKOUT_SUMMARY);
          } 
        },
      ]
    );
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancelar entrenamiento',
      'Se perderá todo el progreso de esta sesión.',
      [
        { text: 'Seguir entrenando', style: 'cancel' },
        { 
          text: 'Cancelar sesión', 
          style: 'destructive',
          onPress: () => {
            useRestTimer.getState().stopTimer();
            cancelWorkoutStore();
            router.replace(ROUTES.TABS_HOME);
          } 
        },
      ]
    );
  };

  if (!isActive) {
    return null;
  }

  return (
    <>
      <YStack flex={1}>
        <WorkoutHeader
          formattedTime={formattedTime}
          routineName={routineName || 'Entrenamiento Libre'}
          currentExerciseIndex={currentExerciseIndex}
          totalExercises={exercises.length}
          isFocusMode={false}
          onToggleFocus={() => {}}
          onCancel={handleCancel}
          onFinish={handleFinish}
          onNotePress={() => state.noteSheetRef.current?.expand()}
          sessionNote={sessionNote}
        />

        <YStack flex={1}>
          {currentExercise && (
            <ActiveWorkoutExerciseDetail
              exercise={currentExercise}
              focusedSetId={state.focusedSetId}
              suggestedWeight={state.weightSuggestion?.weight?.toString() || null}
              suggestionMessage={state.weightSuggestion?.reason || null}
              onSkipExercise={actions.skipExercise}
              onOpenOptions={() => state.optionsSheetRef.current?.expand()}
              onUpdateSetValues={actions.updateSetValues}
              onToggleSet={actions.onSetToggle}
              onRemoveSet={(exId, setId) => actions.handleUndoSetDeletion(exId)}
              onAddSet={actions.addSet}
              resolvePreviousWeight={resolvePreviousWeight}
            />
          )}
        </YStack>

        <ActiveWorkoutBottomBar
          isFirst={state.isFirst}
          isLast={state.isLast}
          isFinishing={false}
          sessionNote={sessionNote}
          restTimerIsActive={restTimerIsActive}
          restDisplaySeconds={restRemaining}
          insetsBottom={insets.bottom}
          hourglassAnimatedStyle={hourglassAnimatedStyle}
          onPrev={actions.goToPrev}
          onOpenNote={() => state.noteSheetRef.current?.expand()}
          onOpenRestTimer={actions.handleOpenRestTimer}
          onNext={actions.goToNext}
          onFinish={handleFinish}
          onOpenPlateCalculator={() => actions.openPlateCalculator(currentExercise?.sets || [])}
          nextExerciseName={state.isLast ? null : (exercises[currentExerciseIndex + 1]?.name || null)}
        />
      </YStack>

      {/* Sheets & Overlays */}
      <ActiveWorkoutOptionsSheet
        sheetRef={state.optionsSheetRef}
        routineId={routineId}
        selectedExerciseId={currentExercise?.id || null}
        exercises={exercises}
        allExercises={state.allExercises}
        globalRestSeconds={90} // Mock or from settings
        onClose={() => state.optionsSheetRef.current?.close()}
        onOpenExercisePicker={() => {
          state.optionsSheetRef.current?.close();
          state.bottomSheetRef.current?.expand();
        }}
        onReplaceExercise={(params) => console.log('Replace', params)}
        onEditRoutine={(id) => router.push({ pathname: '/routine/[id]', params: { id } })}
        onMoveExerciseToEnd={(id) => actions.moveExerciseToEnd(id)}
        onRemoveExercise={(id) => actions.removeExercise(id)}
        onSetRestTimerSeconds={(s) => console.log('Set rest', s)}
      />

      <ActiveWorkoutExercisePickerSheet
        sheetRef={state.bottomSheetRef}
        search={state.search}
        filteredExercises={state.filteredExercises}
        onChangeSearch={actions.setSearch}
        onClose={() => state.bottomSheetRef.current?.close()}
        onSelectExercise={actions.handleAddExerciseSelection}
      />

      <WorkoutSessionNoteSheet
        sheetRef={state.noteSheetRef}
        value={sessionNote}
        onChangeText={setSessionNote}
        onClose={() => state.noteSheetRef.current?.close()}
      />

      <PlateCalculatorSheet
        ref={state.plateCalcSheetRef}
        value={currentExercise?.sets[state.plateCalcSetIndex]?.weight || 0}
        onChange={(w) => actions.updateSetValues(currentExercise.id, currentExercise.sets[state.plateCalcSetIndex].id, { weight: w })}
        barWeight={20}
        availablePlates={[25, 20, 15, 10, 5, 2.5, 1.25]}
        sets={currentExercise?.sets}
        selectedSetIndex={state.plateCalcSetIndex}
        onClose={() => state.plateCalcSheetRef.current?.dismiss()}
      />

      <PRCelebrationOverlay 
        visible={false} 
        onFinished={() => {}} 
      />
    </>
  );
}
