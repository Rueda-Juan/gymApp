import { useCallback, useRef } from 'react';
import Animated, { useAnimatedRef, scrollTo, runOnUI } from 'react-native-reanimated';
import { triggerSelectionHaptic } from '@/shared/lib/haptics';

type LayoutInfo = { y: number; height: number };

export function useSupersetFlow() {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const itemLayouts = useRef<Record<string, LayoutInfo>>({});

  const registerLayout = useCallback((id: string, y: number, height: number) => {
    itemLayouts.current[id] = { y, height };
  }, []);

  const unregisterLayout = useCallback((id: string) => {
    delete itemLayouts.current[id];
  }, []);

  const scrollToExercise = useCallback((exerciseId: string, offset = 0) => {
    const info = itemLayouts.current[exerciseId];
    if (!info) return;

    const targetY = Math.max(0, Math.round(info.y - offset));

    triggerSelectionHaptic();
    runOnUI(() => {
      scrollTo(
        scrollRef,
        0,
        targetY,
        true // with animation
      );
    })();
  }, [scrollRef]);

  return {
    scrollRef,
    registerLayout,
    unregisterLayout,
    scrollToExercise,
  };
}

