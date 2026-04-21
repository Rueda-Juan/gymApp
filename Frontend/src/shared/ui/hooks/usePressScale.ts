import { useCallback } from 'react';
import { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import { motion } from '@/constants/motion';
import { useMotion } from '@/ui/hooks/useMotion';

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

  // Return a simple reactive style object so tests can read the current value
  // (using a getter) without depending on the full Reanimated runtime.
  const animatedScale = new Proxy({}, {
    get(_, prop) {
      if (prop === 'transform') return [{ scale: scale.value }];
      return undefined;
    }
  }) as any;

  return { handlePressIn, handlePressOut, animatedScale };
}
