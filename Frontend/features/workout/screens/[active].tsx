import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { YStack, XStack, Button as TamaguiButton } from 'tamagui';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';

import { BottomBarProvider, useBottomBarHeightContext } from '@/context/BottomBarHeightContext';
import { useActiveWorkout } from '@/store/useActiveWorkout';
import { useRestTimer } from '@/store/useRestTimer';

import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';

import { WorkoutHeader } from '@/components/workout/activeWorkout/WorkoutHeader';
import { ActiveWorkoutExerciseDetail } from '@/components/workout/activeWorkout/ActiveWorkoutExerciseDetail';
import { ActiveWorkoutBottomBar } from '@/features/workout/components/activeWorkout/ActiveWorkoutBottomBar';
import { ActiveWorkoutRestTimerChip } from '@/components/workout/activeWorkout/ActiveWorkoutRestTimerChip';
import { PRCelebrationOverlay } from '@/components/workout/activeWorkout/PRCelebrationOverlay';
import { PlateCalculatorSheet } from '@/components/workout/plateSelector/PlateCalculatorModal';
import { createWeightEngine, WeightEngine } from '@/domain/weight/weightEngine';

import { useWorkoutTimer } from '@/hooks/application/useWorkoutTimer';
import { useRestTimerAnimation } from '@/hooks/ui/useRestTimerAnimation';
import { useActiveWorkoutController } from '@/hooks/domain/useActiveWorkoutController';
import { Plus } from 'lucide-react-native';


function EmptyStateView({ onAdd }: { onAdd: () => void }) {
  return (
    <YStack flex={1} alignItems="center" justifyContent="center" padding="$2xl" gap="$lg">
      <AppText variant="bodyLg" color="textSecondary" textAlign="center">
        Comienza agregando tu primer ejercicio
      </AppText>
      <AppButton label="Agregar ejercicio" onPress={onAdd} />
    </YStack>
  );
}

function Content() {
  const insets = useSafeAreaInsets();
  const { bottomBarHeight } = useBottomBarHeightContext();
  const currentExerciseIndex = useActiveWorkout(s => s.currentExerciseIndex);
  const updateSetValues = useActiveWorkout(s => s.updateSetValues);
  const sessionNote = useActiveWorkout(s => s.sessionNote);
  const cancelWorkout = useActiveWorkout(s => s.cancelWorkout);
  const finishWorkout = useActiveWorkout(s => s.finishWorkout);
  const exercises = useActiveWorkout(s => s.exercises);

  const restTimerIsActive = useRestTimer(s => s.isActive);

  const { formattedTime } = useWorkoutTimer();
  const { restDisplaySeconds, restProgressStyle, hourglassAnimatedStyle } =
    useRestTimerAnimation();

  const { state, actions } = useActiveWorkoutController();
  const plateCalcSheetRef = state.plateCalcSheetRef;

  // Estado para mostrar modales/bottomsheets
  const [showAddExercise, setShowAddExercise] = React.useState(false);
  const [showOptions, setShowOptions] = React.useState(false);
  const [optionsExerciseId, setOptionsExerciseId] = React.useState<string | null>(null);

  const currentExercise = exercises[currentExerciseIndex];
  const router = useRouter();

  // Cancelar sesión vacía automáticamente al montar
  React.useEffect(() => {
    if (exercises.length === 0) {
      cancelWorkout();
      router.replace('/');
    }
  }, [exercises.length, cancelWorkout, router]);

  // Handler para cancelar sesión
  const handleCancel = React.useCallback(() => {
    cancelWorkout();
    router.replace('/');
  }, [cancelWorkout, router]);

  // Handler para finalizar sesión
  const handleFinish = React.useCallback(() => {
    finishWorkout();
    router.replace('/');
  }, [finishWorkout, router]);

  // Handler para abrir bottomSheet de nota
  const handleOpenNote = React.useCallback(() => {
    if (state.noteSheetRef.current) {
      state.noteSheetRef.current.expand();
    }
  }, [state.noteSheetRef]);

  // Handler para abrir bottomSheet de plateCalculator
  const handleOpenPlateCalculator = React.useCallback(() => {
    if (plateCalcSheetRef.current) {
      plateCalcSheetRef.current.present();
    }
  }, [plateCalcSheetRef]);

  // Handler para abrir opciones del ejercicio
  const handleOpenOptions = React.useCallback((exerciseId: string) => {
    setOptionsExerciseId(exerciseId);
    setShowOptions(true);
    if (state.optionsSheetRef.current) {
      state.optionsSheetRef.current.expand();
    }
  }, [state.optionsSheetRef]);

  return (
    <Screen safeAreaEdges={['top','bottom','left','right']}>
      <YStack flex={1}>
        {/* HEADER */}
        <WorkoutHeader
          formattedTime={formattedTime}
          routineName="Entrenamiento"
          currentExerciseIndex={currentExerciseIndex}
          totalExercises={exercises.length}
          isFocusMode={false}
          onToggleFocus={() => {}}
          onCancel={handleCancel}
          onFinish={handleFinish}
          sessionNote={sessionNote}
          onNotePress={handleOpenNote}
        />

        {/* CONTENT */}
        {exercises.length === 0 ? (
          <EmptyStateView
            onAdd={() => {
              setShowAddExercise(true);
            }}
          />
        ) : currentExercise ? (
          <Animated.View entering={FadeInDown} style={{ flex: 1 }}>
            <ActiveWorkoutExerciseDetail
              exercise={currentExercise}
              focusedSetId={state.focusedSetId}
              suggestedWeight={
                typeof state.weightSuggestion?.suggestedWeight === 'number'
                  ? String(state.weightSuggestion.suggestedWeight)
                  : ''
              }
              suggestionMessage={state.weightSuggestion?.message ?? ''}
              resolvePreviousWeight={() => 0}
              onUpdateSetValues={updateSetValues}
              onToggleSet={actions.onSetToggle}
              onRemoveSet={() => {}}
              onAddSet={actions.addSet}
              onSkipExercise={() => {}}
              onOpenOptions={handleOpenOptions}
            />
          </Animated.View>
        ) : null}

        {/* REST TIMER */}
        <ActiveWorkoutRestTimerChip
          isVisible={restTimerIsActive}
          restDisplaySeconds={restDisplaySeconds}
          restProgressStyle={restProgressStyle}
          onDecrease={actions.handleDecreaseTimer}
          onIncrease={actions.handleIncreaseTimer}
        />

        {/* BOTTOM BAR */}
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
          onNext={state.isLast ? handleFinish : actions.goToNext}
          onOpenNote={handleOpenNote}
          onOpenRestTimer={actions.handleOpenRestTimer}
          onOpenPlateCalculator={handleOpenPlateCalculator}
        />

        {/* Plate Calculator BottomSheetModal */}
        <React.Suspense fallback={null}>
          {plateCalcSheetRef && (() => {
            const engine = createWeightEngine('barbell', { barWeight: 20, availablePlates: [25,20,15,10,5,2.5,1.25] });
            const result = engine.compute({ targetWeight: currentExercise?.sets?.[0]?.weight ?? 0 });
            return (
              <PlateCalculatorSheet
                ref={plateCalcSheetRef}
                value={currentExercise?.sets?.[0]?.weight ?? 0}
                onChange={() => {}}
                sets={currentExercise?.sets || []}
                selectedSetIndex={0}
                onSelectSet={() => {}}
                barWeight={20}
                availablePlates={[25,20,15,10,5,2.5,1.25]}
                onClose={() => plateCalcSheetRef.current?.dismiss()}
                bottomInset={bottomBarHeight}
              />
            );
          })()}
        </React.Suspense>

        {/* OVERLAY */}
        <PRCelebrationOverlay
          visible={state.showPRCelebration}
          onFinished={() => {}}
        />

        {/* TODO: Implementar los modales/bottomSheets reales para agregar ejercicio y opciones */}
        {/* Ejemplo: showAddExercise && <AddExerciseModal onClose={() => setShowAddExercise(false)} onAdd={actions.handleAddExerciseSelection} /> */}
        {/* showOptions && <OptionsBottomSheet exerciseId={optionsExerciseId} onClose={() => setShowOptions(false)} /> */}
      </YStack>
      {/* Botón flotante para agregar ejercicio SIEMPRE visible, grande y sobre el bottomBar */}
      <TamaguiButton
        position="absolute"
        right={32}
        bottom={96}
        size="$7"
        circular
        icon={<Plus size={36} />}
        backgroundColor="$primary"
        onPress={() => setShowAddExercise(true)}
        zIndex={200}
        elevation={4}
        accessibilityLabel="Agregar ejercicio"
        shadowColor="#000"
        shadowOffset={{ width: 0, height: 4 }}
        shadowOpacity={0.18}
        shadowRadius={8}
      />
    </Screen>
  );
}

// Exportar el componente principal como default
export default function ActiveWorkoutScreen() {
  return (
    <BottomBarProvider>
      <Content />
    </BottomBarProvider>
  );
}