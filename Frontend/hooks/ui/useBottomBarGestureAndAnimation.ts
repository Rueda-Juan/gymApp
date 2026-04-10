import { useEffect, useCallback } from 'react';
import { useTheme } from 'tamagui';
import { useSharedValue, useAnimatedStyle, withSequence, withTiming, withSpring, runOnJS, Easing } from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { logEvent } from '@/utils/instrumentation';
import { useMotion } from '@/hooks/ui/useMotion';
import { motion } from '@/constants/motion';

const BOUNCE_INTERVAL_MS = 8000;
const BOUNCE_OFFSET = -3;
const BOUNCE_DURATION_MS = 300;
const SWIPE_UP_THRESHOLD = -60;
const GESTURE_ACTIVE_OFFSET_Y: [number, number] = [-10, 10];
const GESTURE_FAIL_OFFSET_X: [number, number] = [-30, 30];

interface UseBottomBarGestureAndAnimationProps {
  insetsBottom: number;
  onOpenPlateCalculator: () => void;
}

export function useBottomBarGestureAndAnimation({ insetsBottom, onOpenPlateCalculator }: UseBottomBarGestureAndAnimationProps) {
  const theme = useTheme();
  const motionHelpers = useMotion();
  const handleY = useSharedValue(0);

  useEffect(() => {
    // Instrument: report current bottom inset for repro
    try {
      logEvent('bottombar_mount', { insetsBottom });
    } catch {
      // ignore
    }
    if (motionHelpers.isReduced) return;
    const id = setInterval(() => {
      handleY.value = withSequence(
        withTiming(BOUNCE_OFFSET, { duration: BOUNCE_DURATION_MS, easing: Easing.out(Easing.ease) }),
        withSpring(0, motion.spring.subtle),
      );
    }, BOUNCE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [motionHelpers.isReduced, handleY, insetsBottom]);

  // Memoized handler for opening the plate calculator
  const handleOpenPlateCalculator = useCallback(() => {
    onOpenPlateCalculator();
  }, [onOpenPlateCalculator]);

  const handleAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: handleY.value }],
  }));

  const swipeUpGesture = useCallback(() =>
    Gesture.Pan()
      .activeOffsetY(GESTURE_ACTIVE_OFFSET_Y)
      .failOffsetX(GESTURE_FAIL_OFFSET_X)
      .onEnd(({ translationY }) => {
        'worklet';
        if (translationY < SWIPE_UP_THRESHOLD) {
          try {
            runOnJS(logEvent)('bottomsheet_swipe_up', { translationY });
          } finally {
            runOnJS(handleOpenPlateCalculator)();
          }
        }
      })
  , [handleOpenPlateCalculator]);

  // Fallback to a neutral dark tone if the theme token is unavailable
  const handleColor = theme.textTertiary?.val ?? theme.icon?.val ?? '#6B6352';

  return {
    handleAnimStyle,
    swipeUpGesture: swipeUpGesture(),
    handleColor
  };
}
