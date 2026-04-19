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

export interface UseActiveWorkoutControllerProps {
  activeExerciseId?: string;
  isInSuperset?: boolean;
  onSupersetSetComplete?: () => void;
  supersetOrder?: string[];
  supersetCarouselIndex?: number;
  supersetGroupExercises?: any[];
}

export function useActiveWorkoutController(
  props: Partial<UseActiveWorkoutControllerProps> = {}
) {
  // ✅ DEFAULT SAFE DESTRUCTURING
  const {
    activeExerciseId,
    isInSuperset = false,
    onSupersetSetComplete = () => {},
    supersetOrder = [],
    supersetCarouselIndex = 0,
    supersetGroupExercises = [],
  } = props;

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
  const [focusedSetId, setFocusedSetId] = useState<string | null>(null);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [navDirection, setNavDirection] = useState<'forward' | 'back'>('forward');
  const [weightSuggestion, setWeightSuggestion] = useState<WeightSuggestion | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const [showPRCelebration, setShowPRCelebration] = useState(false);
  const [plateCalcSetIndex, setPlateCalcSetIndex] = useState(0);

  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { setTimeoutFor, undoTimeoutFor } = useDeletionTimeouts();

  const { completeSet } = useSetCompletion();
  const { moveToNextExercise } = useSupersetNavigation();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const optionsSheetRef = useRef<BottomSheet>(null);
  const noteSheetRef = useRef<BottomSheet>(null);
  const plateCalcSheetRef = useRef<BottomSheetModal>(null);

  const isFirst = currentExerciseIndex === 0;
  const isLast = currentExerciseIndex === exercises.length - 1;

  // ---------------------------
  // FETCH EXERCISES
  // ---------------------------
  useEffect(() => {
    exerciseService.getAll()
      .then(res => setAllExercises(res ?? []))
      .catch(() =>
        Toast.show({ type: 'error', text1: 'Error al cargar ejercicios' })
      );
  }, [exerciseService]);

  // ---------------------------
  // WEIGHT SUGGESTION
  // ---------------------------
  useEffect(() => {
    if (!activeExerciseId) return;

    let cancelled = false;

    workoutService.suggestWeight(activeExerciseId)
      .then(s => !cancelled && setWeightSuggestion(s))
      .catch(() => !cancelled && setWeightSuggestion(null));

    return () => { cancelled = true; };
  }, [activeExerciseId, workoutService]);

  // ---------------------------
  // FILTER
  // ---------------------------
  const filteredExercises = useMemo(() =>
    allExercises.filter(e =>
      getExerciseName(e).toLowerCase().includes(search.toLowerCase())
    ),
    [allExercises, search]
  );

  // ---------------------------
  // NAVIGATION
  // ---------------------------
  const goToNext = useCallback(() => {
    if (isLast) return;
    setNavDirection('forward');
    setCurrentExercise(currentExerciseIndex + 1);
    setFocusedSetId(null);
  }, [isLast, currentExerciseIndex, setCurrentExercise]);

  const goToPrev = useCallback(() => {
    if (isFirst) return;
    setNavDirection('back');
    setCurrentExercise(currentExerciseIndex - 1);
    setFocusedSetId(null);
  }, [isFirst, currentExerciseIndex, setCurrentExercise]);

  // ---------------------------
  // REST TIMER LOGIC SAFE
  // ---------------------------
  const shouldStartRestTimerAfterSet = useMemo(() => {
    if (!isInSuperset) return true;
    if (supersetGroupExercises.length === 0) return true;

    return supersetOrder[supersetCarouselIndex] ===
      supersetGroupExercises[supersetGroupExercises.length - 1]?.id;
  }, [isInSuperset, supersetOrder, supersetCarouselIndex, supersetGroupExercises]);

  // ---------------------------
  // SET TOGGLE
  // ---------------------------
  const onSetToggle = useCallback(async (exerciseId: string, setId: string, completed: boolean) => {
    const ex = exercises.find(e => e.id === exerciseId);
    if (!ex) return;

    await completeSet(exerciseId, setId, completed, ex, shouldStartRestTimerAfterSet);

    if (!completed) {
      setFocusedSetId(null);

      if (isInSuperset) onSupersetSetComplete();

      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = setTimeout(moveToNextExercise, AUTO_ADVANCE_DELAY_MS);
    }
  }, [completeSet, exercises, isInSuperset, onSupersetSetComplete, moveToNextExercise, shouldStartRestTimerAfterSet]);

  // ---------------------------
  // ACTIONS
  // ---------------------------
  const addSet = useCallback((exerciseId: string) => {
    const id = addSetStore(exerciseId);
    setFocusedSetId(id);
  }, [addSetStore]);

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

  const openPlateCalculator = useCallback((sets: any[]) => {
    const idx = sets.findIndex(s => !s.isCompleted && s.weight > 0);
    setPlateCalcSetIndex(idx !== -1 ? idx : 0);
    plateCalcSheetRef.current?.expand();
  }, []);

  // ---------------------------
  // RETURN
  // ---------------------------
  return {
    state: {
      search,
      allExercises,
      filteredExercises,
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
      setFocusedSetId,
      goToNext,
      goToPrev,
      onSetToggle,
      addSet,
      handleAddExerciseSelection,
      openPlateCalculator,
      handleDecreaseTimer: () => adjustTimer(-15),
      handleIncreaseTimer: () => adjustTimer(15),
      handleOpenRestTimer: () => expoRouter.push(ROUTES.REST_TIMER),
      handleUndoSetDeletion: (exerciseId: string) =>
        undoTimeoutFor(exerciseId, () =>
          useActiveWorkout.getState().restoreLastSet(exerciseId)
        ),
    }
  };
}