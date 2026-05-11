import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useWindowDimensions } from 'react-native';
import Animated, { useAnimatedRef, scrollTo, withTiming, Easing, runOnUI } from 'react-native-reanimated';
import type { WorkoutExerciseState } from '@/shared/types/workout';
import { getExerciseName } from '@/entities/exercise';
import { logEvent } from '@/shared/lib/instrumentation';

const CAROUSEL_H_PADDING = 32;
const SUPERSET_SCROLL_DURATION_MS = 1500;

export function useSupersetCarousel(
  exercises: WorkoutExerciseState[],
  currentExerciseIndex: number,
) {
  const currentExercise = exercises[currentExerciseIndex];
  const { width: screenWidth } = useWindowDimensions();

  const [supersetOrder, setSupersetOrder] = useState<string[]>([]);
  const [supersetCarouselIndex, setSupersetCarouselIndex] = useState(0);
  const [supersetTransitionName, setSupersetTransitionName] = useState<string | null>(null);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const supersetScrollRef = useAnimatedRef<Animated.ScrollView>();

  const activeSupersetGroup = currentExercise?.supersetGroup ?? null;

  const supersetGroupExercises = useMemo(
    () => activeSupersetGroup != null
      ? exercises.filter(ex => ex.supersetGroup === activeSupersetGroup)
      : [],
    [activeSupersetGroup, exercises],
  );

  const isInSuperset = supersetGroupExercises.length > 1;
  const supersetIdsSignature = supersetGroupExercises.map(ex => ex.id).join('|');

  useEffect(() => {
    if (!isInSuperset) {
      setSupersetOrder(prev => (prev.length === 0 ? prev : []));
      setSupersetCarouselIndex(prev => (prev === 0 ? prev : 0));
      return;
    }
    const groupIds = supersetIdsSignature.split('|');
    setSupersetOrder(prev => {
      const hasChanged =
        groupIds.length !== prev.length || groupIds.some((id, i) => id !== prev[i]);
      if (hasChanged) {
        try { logEvent('superset_order_changed', { groupIds }); } catch { /* noop */ }
      }
      return hasChanged ? groupIds : prev;
    });
    setSupersetCarouselIndex(0);
  }, [isInSuperset, supersetIdsSignature]);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, []);

  const carouselItemWidth = screenWidth - CAROUSEL_H_PADDING;

  const visibleSupersetExercise =
    isInSuperset && supersetOrder.length > 0
      ? (exercises.find(ex => ex.id === supersetOrder[supersetCarouselIndex]) ?? currentExercise)
      : currentExercise;

  const rotateSupersetCarousel = useCallback(() => {
    if (supersetOrder.length <= 1) return;
    const nextIndex = (supersetCarouselIndex + 1) % supersetOrder.length;
    const nextId = supersetOrder[nextIndex];
    const nextEx = nextId ? exercises.find(ex => ex.id === nextId) : null;
    const targetX = nextIndex * carouselItemWidth;

    setSupersetCarouselIndex(nextIndex);
    try { logEvent('superset_rotate', { nextIndex, targetX }); } catch { /* noop */ }
    runOnUI(() => {
      scrollTo(
        supersetScrollRef,
        withTiming(targetX, { duration: SUPERSET_SCROLL_DURATION_MS, easing: Easing.out(Easing.cubic) }),
        0,
        false,
      );
    })();

    if (nextEx) {
      setSupersetTransitionName(getExerciseName(nextEx));
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = setTimeout(
        () => setSupersetTransitionName(null),
        SUPERSET_SCROLL_DURATION_MS,
      );
    }
  }, [supersetOrder, supersetCarouselIndex, exercises, carouselItemWidth, supersetScrollRef]);

  const scrollToTab = useCallback(
    (tabIndex: number) => {
      setSupersetCarouselIndex(tabIndex);
      const targetX = tabIndex * carouselItemWidth;
      runOnUI(() => {
        scrollTo(supersetScrollRef, targetX, 0, true);
      })();
    },
    [carouselItemWidth, supersetScrollRef],
  );

  const handleScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const newIndex = Math.round(e.nativeEvent.contentOffset.x / carouselItemWidth);
      try { logEvent('superset_scroll_end', { newIndex, contentOffsetX: e.nativeEvent.contentOffset.x, carouselItemWidth }); } catch { /* noop */ }
      setSupersetCarouselIndex(newIndex);
    }, [carouselItemWidth],
  );

  return {
    isInSuperset,
    supersetOrder,
    supersetCarouselIndex,
    setSupersetCarouselIndex,
    supersetTransitionName,
    supersetScrollRef,
    supersetGroupExercises,
    visibleSupersetExercise,
    carouselItemWidth,
    rotateSupersetCarousel,
    scrollToTab,
    handleScrollEnd,
  };
}

