import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useDeletionTimeouts } from './useDeletionTimeouts';
import { Alert, BackHandler } from 'react-native';
import { router as expoRouter } from 'expo-router';
import BottomSheet, { BottomSheetModal } from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';

import { useActiveWorkout } from '@/store/useActiveWorkout';
import { useRestTimer } from '@/store/useRestTimer';
import { useSettings } from '@/store/useSettings';
import { useWorkout } from '@/hooks/domain/useWorkout';
import { useExercises } from '@/hooks/domain/useExercises';
import { useSetCompletion } from '@/hooks/domain/useSetCompletion';
import { useSupersetNavigation } from '@/hooks/ui/useSupersetNavigation';
import { createClientId } from '@/utils/clientId';
import { useWorkoutSummary } from '@/store/useWorkoutSummary';
import { getExerciseName } from '@/utils/exercise';
import { ROUTES } from '@/constants/routes';

import type { WeightSuggestion } from 'backend/shared/types';
import type { Exercise } from 'backend/domain/entities/Exercise';

const AUTO_ADVANCE_DELAY_MS = 1000;
const SHEET_OPEN_DELAY_MS = 300;

export function isCurrentExerciseGroupCompleted(): boolean {
  const { exercises, currentExerciseIndex } = useActiveWorkout.getState();
  const currentEx = exercises[currentExerciseIndex];
  if (!currentEx) return false;

  const isSuperset = currentEx.supersetGroup != null;
  if (!isSuperset) return currentEx.sets.every(s => s.isCompleted);

  return exercises
    .filter(ex => ex.supersetGroup === currentEx.supersetGroup)
    .every(ex => ex.sets.every(s => s.isCompleted));
}

// Additional interface so callers don't need to specify everything.
export interface UseActiveWorkoutControllerProps {
  activeExerciseId?: string;
  isInSuperset: boolean;
  onSupersetSetComplete: () => void;
  supersetOrder: string[];
  supersetCarouselIndex: number;
  supersetGroupExercises: any[];
}

export function useActiveWorkoutController({
  activeExerciseId,
  isInSuperset,
  onSupersetSetComplete,
  supersetOrder,
  supersetCarouselIndex,
  supersetGroupExercises
}: UseActiveWorkoutControllerProps) {
  const workoutService = useWorkout();
  const exerciseService = useExercises();
  
  const workoutId = useActiveWorkout(s => s.workoutId);
  const exercises = useActiveWorkout(s => s.exercises);
  const currentExerciseIndex = useActiveWorkout(s => s.currentExerciseIndex);
  
  const cancelWorkout = useActiveWorkout(s => s.cancelWorkout);
  const clearStore = useActiveWorkout(s => s.finishWorkout);
  const addSetStore = useActiveWorkout(s => s.addSet);
  const addExercise = useActiveWorkout(s => s.addExercise);
  const skipExercise = useActiveWorkout(s => s.skipExercise);
  const setCurrentExercise = useActiveWorkout(s => s.setCurrentExercise);
  const removeExercise = useActiveWorkout(s => s.removeExercise);
  const moveExerciseToEnd = useActiveWorkout(s => s.moveExerciseToEnd);
  const setNewRecords = useWorkoutSummary(s => s.setNewRecords);

  const adjustTimer = useRestTimer(s => s.adjustTimer);

  const [search, setSearch] = useState('');
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [focusedSetId, setFocusedSetId] = useState<string | null>(null);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [navDirection, setNavDirection] = useState<'forward' | 'back'>('forward');
  const [weightSuggestion, setWeightSuggestion] = useState<WeightSuggestion | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const [showPRCelebration, setShowPRCelebration] = useState(false);
  const [plateCalcSetIndex, setPlateCalcSetIndex] = useState(0);
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { deletionTimeouts, setTimeoutFor, clearTimeoutFor, undoTimeoutFor } = useDeletionTimeouts();

  const { completeSet } = useSetCompletion();
  const { moveToNextExercise } = useSupersetNavigation();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const optionsSheetRef = useRef<BottomSheet>(null);
  const noteSheetRef = useRef<BottomSheet>(null);
  const plateCalcSheetRef = useRef<BottomSheetModal>(null);

  const isFirst = currentExerciseIndex === 0;
  const isLast = currentExerciseIndex === exercises.length - 1;

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const result = await exerciseService.getAll();
        setAllExercises(result ?? []);
      } catch {
        Toast.show({ type: 'error', text1: 'Error al cargar ejercicios', position: 'top' });
      }
    };
    fetchExercises();
  }, [exerciseService]);

  useEffect(() => {
    if (!activeExerciseId) return;
    let cancelled = false;

    workoutService.suggestWeight(activeExerciseId)
      .then((suggestion) => {
        if (!cancelled) setWeightSuggestion(suggestion);
      })
      .catch(() => {
        if (!cancelled) setWeightSuggestion(null);
      });

    return () => { cancelled = true; };
  }, [activeExerciseId, workoutService]);

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

    const hasAnyCompletedSets = exercises.some(ex => ex.sets.some(s => s.isCompleted));
    if (!hasAnyCompletedSets) {
      cancelWorkout();
      expoRouter.replace(ROUTES.TABS_HOME);
      Toast.show({ type: 'info', text1: 'Sesión descartada', text2: 'No se guardó el entrenamiento porque estaba vacío.' });
      setIsFinishing(false);
      return;
    }

    try {
      const result = await workoutService.recordAllSets(workoutId, exercises);
      await workoutService.finishWorkout(workoutId);
      
      setNewRecords(result.newRecords);
      clearStore(); // Clear immediately for consistency

      if (result.newRecords.length > 0) {
        setShowPRCelebration(true);
        // Wait for the animation to be seen
        await new Promise(resolve => setTimeout(resolve, 3500));
      }

      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show({ type: 'success', text1: '¡Entrenamiento Guardado!', text2: 'Felicidades por completar tu sesión.', position: 'top' });
      expoRouter.replace(`/(workouts)/summary?id=${workoutId}`);
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

  const shouldStartRestTimerAfterSet = useMemo(() => {
    if (!isInSuperset) return true;
    const isLastInRound = supersetOrder.length > 0
      && supersetOrder[supersetCarouselIndex] === supersetGroupExercises[supersetGroupExercises.length - 1]?.id;
    return isLastInRound;
  }, [isInSuperset, supersetOrder, supersetCarouselIndex, supersetGroupExercises]);

  const onSetToggle = useCallback(async (exerciseId: string, setId: string, currentlyCompleted: boolean) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (!exercise) return;

    await completeSet(exerciseId, setId, currentlyCompleted, exercise, shouldStartRestTimerAfterSet);

    if (!currentlyCompleted) {
      setFocusedSetId(null);

      if (isInSuperset && onSupersetSetComplete) {
        onSupersetSetComplete();
      }

      if (isCurrentExerciseGroupCompleted()) {
        if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
        autoAdvanceRef.current = setTimeout(() => moveToNextExercise(), AUTO_ADVANCE_DELAY_MS);
      }
    }
  }, [completeSet, exercises, isInSuperset, onSupersetSetComplete, moveToNextExercise, shouldStartRestTimerAfterSet]);

  const addSet = useCallback((exerciseId: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newId = addSetStore(exerciseId);
    setFocusedSetId(newId);
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

  useEffect(() => {
    return () => {
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    };
  }, []);

  const openOptionsForExercise = useCallback((exerciseId: string) => {
    setSelectedExerciseId(exerciseId);
    optionsSheetRef.current?.snapToIndex(0);
  }, []);

  const handleOpenExercisePickerFromOptions = useCallback(() => {
    optionsSheetRef.current?.close();
    setTimeout(() => bottomSheetRef.current?.snapToIndex(1), SHEET_OPEN_DELAY_MS);
  }, []);

  const handleReplaceExercise = useCallback(({ targetId, filterMuscle, excludeEquipment }: { targetId: string; filterMuscle: string; excludeEquipment: string }) => {
    optionsSheetRef.current?.close();
    expoRouter.push(`${ROUTES.EXERCISE_BROWSER}?action=replace&targetId=${targetId}&filterMuscle=${filterMuscle}&excludeEquipment=${excludeEquipment}`);
  }, []);

  const handleEditRoutine = useCallback((nextRoutineId: string) => {
    optionsSheetRef.current?.close();
    expoRouter.push(`/routine/${nextRoutineId}`);
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

  const openPlateCalculator = useCallback((sets: any[]) => {
    const firstIncompleteWithWeight = sets.findIndex(s => !s.isCompleted && s.weight > 0);
    const firstWithWeight = sets.findIndex(s => s.weight > 0);
    const defaultIdx = firstIncompleteWithWeight !== -1
      ? firstIncompleteWithWeight
      : firstWithWeight !== -1 ? firstWithWeight : 0;
    setPlateCalcSetIndex(defaultIdx);
    plateCalcSheetRef.current?.expand();
  }, []);

  return {
    state: {
      search,
      allExercises,
      filteredExercises,
      isFocusMode,
      focusedSetId,
      selectedExerciseId,
      navDirection,
      weightSuggestion,
      isFinishing,
      showPRCelebration,
      plateCalcSetIndex,
      bottomSheetRef,
      optionsSheetRef,
      noteSheetRef,
      plateCalcSheetRef,
      isFirst,
      isLast,
    },
    actions: {
      setSearch,
      setIsFocusMode: () => setIsFocusMode(prev => !prev),
      setFocusedSetId,
      setPlateCalcSetIndex,
      handleCancel,
      handleFinish,
      goToNext,
      goToPrev,
      onSetToggle,
      addSet,
      handleSkipExercise,
      handleAddExerciseSelection,
      openOptionsForExercise,
      handleOpenExercisePickerFromOptions,
      handleReplaceExercise,
      handleEditRoutine,
      handleMoveExerciseToEnd,
      handleRemoveExercise,
      openPlateCalculator,
      setShowPlateCalculator: (val: boolean) => {
        if (val) plateCalcSheetRef.current?.expand();
        else plateCalcSheetRef.current?.close();
      },
      
      // Additional simple actions wrapped
      handleDecreaseTimer: () => adjustTimer(-15),
      handleIncreaseTimer: () => adjustTimer(15),
      handleOpenRestTimer: () => expoRouter.push(ROUTES.REST_TIMER),
      handleSetRestTimerSeconds: (seconds: number) => useSettings.getState().setRestTimerSeconds(seconds),
      handleRemoveSet: (exerciseId: string, setId: string) => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        useActiveWorkout.getState().softRemoveSet(exerciseId, setId);
        setTimeoutFor(
          exerciseId,
          () => useActiveWorkout.getState().clearPendingDeletions(exerciseId),
          3500
        );
      },
      handleUndoSetDeletion: (exerciseId: string) => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        undoTimeoutFor(exerciseId, () => useActiveWorkout.getState().restoreLastSet(exerciseId));
      }
    }
  };
}
