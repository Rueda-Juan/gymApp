import { useEffect } from 'react';
import { useTheme } from 'tamagui';
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming, withSpring, runOnJS, Easing } from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { logEvent } from '@/utils/instrumentation';
import { useMotion } from '@/hooks/useMotion';

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
    } catch (e) {
      // ignore
    }
    if (motionHelpers.isReduced) return;
    const id = setInterval(() => {
      handleY.value = withSequence(
        withTiming(BOUNCE_OFFSET, { duration: BOUNCE_DURATION_MS, easing: Easing.out(Easing.ease) }),
        withSpring(0, motionHelpers.spring.subtle),
      );
    }, BOUNCE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [motionHelpers.isReduced, handleY, insetsBottom, motionHelpers.spring.subtle]);

  const handleAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: handleY.value }],
  }));

  const swipeUpGesture = Gesture.Pan()
    .activeOffsetY(GESTURE_ACTIVE_OFFSET_Y)
    .failOffsetX(GESTURE_FAIL_OFFSET_X)
    .onEnd((e) => {
      'worklet';
      if (e.translationY < SWIPE_UP_THRESHOLD) {
        try {
          runOnJS(logEvent)('bottomsheet_swipe_up', { translationY: e.translationY });
        } finally {
          runOnJS(onOpenPlateCalculator)();
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
