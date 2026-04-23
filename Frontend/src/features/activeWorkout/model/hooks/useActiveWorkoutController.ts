import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useDeletionTimeouts } from '@/shared/lib/hooks/useDeletionTimeouts';
import { router as expoRouter } from 'expo-router';
import BottomSheet, { BottomSheetModal } from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';

import { useActiveWorkout, useRestTimer } from '@/entities/workout';
import { useWorkout } from '@/shared/api/workout/useWorkoutApi';
import { getExerciseName, useExerciseApi } from '@/entities/exercise';

import { useSetCompletion } from './useSetCompletion';

import { useSupersetNavigation } from './useSupersetNavigation';
import { createClientId } from '@/shared/lib/clientId';
import { ROUTES } from '@/shared/constants/routes';

import type { Exercise, WeightSuggestion } from '@kernel';

const AUTO_ADVANCE_DELAY_MS = 1000;

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
  const {
    activeExerciseId,
    isInSuperset = false,
    onSupersetSetComplete = () => {},
    supersetOrder = [],
    supersetCarouselIndex = 0,
    supersetGroupExercises = [],
  } = props;

  // ---------------------------
  // SERVICES
  // ---------------------------
  const workoutService = useWorkout();
  const exerciseService = useExerciseApi();

  // ---------------------------
  // STORE
  // ---------------------------
  const exercises = useActiveWorkout((s: any) => s.exercises);
  const currentExerciseIndex = useActiveWorkout((s: any) => s.currentExerciseIndex);
  const addSetStore = useActiveWorkout((s: any) => s.addSet);
  const addExercise = useActiveWorkout((s: any) => s.addExercise);
  const setCurrentExercise = useActiveWorkout((s: any) => s.setCurrentExercise);

  const adjustTimer = useRestTimer((s: any) => s.adjustTimer);
  // const setNewRecords = useWorkoutSummaryData(state => state.setNewRecords); // Removed: not used

  // ---------------------------
  // STATE
  // ---------------------------
  const [search, setSearch] = useState('');
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [focusedSetId, setFocusedSetId] = useState<string | null>(null);
  const [navDirection, setNavDirection] = useState<'forward' | 'back'>('forward');
  const [weightSuggestion, setWeightSuggestion] = useState<WeightSuggestion | null>(null);
  const [plateCalcSetIndex, setPlateCalcSetIndex] = useState(0);

  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { undoTimeoutFor } = useDeletionTimeouts();

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
      .then((res: Exercise[]) => setAllExercises(res ?? []))
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
      .then((s: WeightSuggestion) => !cancelled && setWeightSuggestion(s))
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
  // REST TIMER LOGIC
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
  const onSetToggle = useCallback(
    async (exerciseId: string, setId: string, completed: boolean) => {
      const ex = exercises.find((e: any) => e.id === exerciseId);
      if (!ex) return;

      await completeSet(exerciseId, setId, completed, ex, shouldStartRestTimerAfterSet);

      if (!completed) {
        setFocusedSetId(null);

        if (isInSuperset) onSupersetSetComplete();

        if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
        autoAdvanceRef.current = setTimeout(moveToNextExercise, AUTO_ADVANCE_DELAY_MS);
      }
    },
    [
      completeSet,
      exercises,
      isInSuperset,
      onSupersetSetComplete,
      moveToNextExercise,
      shouldStartRestTimerAfterSet
    ]
  );

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
      sets: [
        {
          id: createClientId(),
          weight: 0,
          reps: 0,
          isCompleted: false,
          type: 'normal'
        }
      ],
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
      navDirection,
      weightSuggestion,
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
      setCurrentExercise,
      updateSetValues: useActiveWorkout.getState().updateSetValues,
      handleDecreaseTimer: () => adjustTimer(-15),
      handleIncreaseTimer: () => adjustTimer(15),
      handleOpenRestTimer: () => expoRouter.push(ROUTES.REST_TIMER),
      handleUndoSetDeletion: (exerciseId: string) =>
        undoTimeoutFor(exerciseId, () =>
          useActiveWorkout.getState().restoreLastSet(exerciseId)
        ),
      skipExercise: useActiveWorkout.getState().skipExercise,
      moveExerciseToEnd: useActiveWorkout.getState().moveExerciseToEnd,
      removeExercise: useActiveWorkout.getState().removeExercise,
    }
  };
}
