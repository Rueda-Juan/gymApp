import { useCallback } from 'react';
import { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import { motion } from '@/constants/motion';
import { useMotion } from '@/hooks/useMotion';

export function usePressScale(disabled = false) {
  const { isReduced } = useMotion();
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    if (!disabled && !isReduced) {
      scale.value = withSpring(motion.scale.press, motion.spring.snappy);
    }
  }, [disabled, isReduced, scale]);

  const handlePressOut = useCallback(() => {
    if (!isReduced) {
      scale.value = withSpring(1, motion.spring.snappy);
    }
  }, [isReduced, scale]);

  const animatedScale = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return { handlePressIn, handlePressOut, animatedScale };
}
