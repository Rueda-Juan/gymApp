import { useEffect, useCallback } from 'react';
import { useTheme } from 'tamagui';
import { useSharedValue, useAnimatedStyle, withSequence, withTiming, withSpring, runOnJS, Easing } from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { logEvent } from '../../lib/instrumentation';
import { useMotion } from '../../lib/hooks/useMotion';
import { motion } from '../theme/motion';
import {
  BOUNCE_INTERVAL_MS,
  BOUNCE_OFFSET,
  BOUNCE_DURATION_MS,
  SWIPE_UP_THRESHOLD,
  GESTURE_ACTIVE_OFFSET_Y,
  GESTURE_FAIL_OFFSET_X,
} from '../../constants/bottomBar';

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

  const swipeUpGesture = Gesture.Pan()
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
    });

  // Fallback to a neutral dark tone if the theme token is unavailable
  const handleColor = theme.textTertiary?.val ?? theme.icon?.val ?? '#6B6352';

  return {
    handleAnimStyle,
    swipeUpGesture,
    handleColor
  };
}
