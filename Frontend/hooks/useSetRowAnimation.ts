import { useCallback } from 'react';
import { Alert } from 'react-native';
import {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
  interpolate,
  interpolateColor,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { motion } from '@/constants/motion';
import { useMotion } from '@/hooks/useMotion';

const DELETE_BUTTON_WIDTH = 80;
const SWIPE_DELETE_RATIO = 0.2;
const GESTURE_ACTIVE_OFFSET: [number, number] = [-10, 10];
const GESTURE_FAIL_OFFSET: [number, number] = [-5, 5];

interface ThemeColors {
  danger: string;
  dangerSubtle: string;
  surfaceSecondary: string;
  successSubtle: string;
}

interface UseSetRowAnimationParams {
  isCompleted: boolean;
  showRirSelector: boolean;
  screenWidth: number;
  onRemove?: () => void;
  themeColors: ThemeColors;
}

export function useSetRowAnimation({
  isCompleted,
  showRirSelector,
  screenWidth,
  onRemove,
  themeColors,
}: UseSetRowAnimationParams) {
  const motionHelpers = useMotion();

  const scale = useSharedValue(1);
  const rirAnim = useSharedValue(0);
  const completionAnim = useSharedValue(isCompleted ? 1 : 0);
  const completionFlash = useSharedValue(0);
  const translateX = useSharedValue(0);

  const deleteThreshold = screenWidth * SWIPE_DELETE_RATIO;

  const triggerDelete = useCallback(() => {
    if (!onRemove) return;
    onRemove();
    // Reset position for next potential render/recycling
    translateX.value = 0;
  }, [onRemove, translateX]);

  const syncRirAnim = useCallback((visible: boolean) => {
    rirAnim.value = withSpring(visible ? 1 : 0, { ...motion.spring.subtle });
  }, [rirAnim]);

  const syncCompletionAnim = useCallback((completed: boolean) => {
    completionAnim.value = withTiming(completed ? 1 : 0, { duration: motion.duration.normal });
  }, [completionAnim]);

  const playCompletionPop = useCallback(() => {
    scale.value = withSequence(
      withSpring(motion.scale.press, motionHelpers.spring('snappy')),
      withSpring(motion.scale.pop, motionHelpers.spring('bounce')),
      withSpring(1, motionHelpers.spring('snappy'))
    );
    completionFlash.value = withSequence(
      withTiming(0.15, { duration: motion.duration.instant }),
      withTiming(0, { duration: motion.duration.normal })
    );
  }, [scale, completionFlash, motionHelpers]);

  const playUncompletionPress = useCallback(() => {
    scale.value = withSequence(
      withSpring(motion.scale.press, motionHelpers.spring('snappy')),
      withSpring(1, motionHelpers.spring('snappy'))
    );
  }, [scale, motionHelpers]);

  const swipeGesture = Gesture.Pan()
    .activeOffsetX(GESTURE_ACTIVE_OFFSET)
    .failOffsetY(GESTURE_FAIL_OFFSET)
    .enabled(!!onRemove)
    .onUpdate((event) => {
      if (event.translationX < 0) {
        // 1) Apply heavy base friction so the drag feels weighty
        let tX = event.translationX * 0.75;
        
        // 2) Apply overshoot friction if dragged past the reveal area
        const dragLimit = -DELETE_BUTTON_WIDTH - 20;
        if (tX < dragLimit) {
          const excess = tX - dragLimit;
          tX = dragLimit + (excess * 0.2);
        }
        
        translateX.value = tX;
      }
    })
    .onEnd((event) => {
      if (event.translationX < -deleteThreshold) {
        translateX.value = withTiming(-screenWidth, { duration: motion.duration.normal }, () => {
          runOnJS(triggerDelete)();
        });
      } else {
        translateX.value = withSpring(0, motionHelpers.spring('heavy'));
      }
    });

  const swipeRowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const deleteButtonOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-DELETE_BUTTON_WIDTH, 0], [1, 0]),
  }));

  const deleteButtonBgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      translateX.value,
      [-deleteThreshold, -DELETE_BUTTON_WIDTH * 0.3, 0],
      [themeColors.danger, themeColors.dangerSubtle, themeColors.dangerSubtle],
    ),
  }));

  const deleteIconRestStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-deleteThreshold, -DELETE_BUTTON_WIDTH * 0.3], [0, 1]),
  }));

  const deleteIconActiveStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-deleteThreshold, -DELETE_BUTTON_WIDTH * 0.3], [1, 0]),
  }));

  const animatedCheckStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      completionAnim.value,
      [0, 1],
      [themeColors.surfaceSecondary, themeColors.successSubtle]
    ),
    transform: [{ scale: scale.value }],
  }));

  const completionFlashStyle = useAnimatedStyle(() => ({
    opacity: completionFlash.value,
  }));

  const rirGroupStyle = useAnimatedStyle(() => ({
    opacity: interpolate(rirAnim.value, [0.2, 1], [0, 1]),
    transform: [{ translateX: interpolate(rirAnim.value, [0, 1], [15, 0]) }],
  }));

  const inputGroupStyle = useAnimatedStyle(() => ({
    opacity: interpolate(rirAnim.value, [0, 0.8], [1, 0]),
    transform: [{ translateX: interpolate(rirAnim.value, [0, 1], [0, -15]) }],
  }));

  return {
    syncRirAnim,
    syncCompletionAnim,
    playCompletionPop,
    playUncompletionPress,
    swipeGesture,
    styles: {
      swipeRow: swipeRowStyle,
      deleteButtonOpacity,
      deleteButtonBg: deleteButtonBgStyle,
      deleteIconRest: deleteIconRestStyle,
      deleteIconActive: deleteIconActiveStyle,
      animatedCheck: animatedCheckStyle,
      completionFlash: completionFlashStyle,
      rirGroup: rirGroupStyle,
      inputGroup: inputGroupStyle,
    },
  };
}
