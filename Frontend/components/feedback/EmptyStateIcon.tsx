import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';
import { useMotion } from '@/hooks/useMotion';
import { motion } from '@/constants/motion';
import { AppIcon } from '@/components/ui/AppIcon';
import { ThemeColorKey } from '@/theme/types';
import type { LucideIcon } from 'lucide-react-native';

const FLOAT_DISTANCE = -2;
const CYCLE_DURATION = 2000;
const OPACITY_MIN = 0.7;
const STATIC_OPACITY = 0.7;

interface EmptyStateIconProps {
  icon: LucideIcon;
  size?: number;
  color?: ThemeColorKey;
}

export function EmptyStateIcon({ icon, size = 48, color = 'textTertiary' }: EmptyStateIconProps) {
  const { isReduced } = useMotion();
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(isReduced ? STATIC_OPACITY : 1);

  useEffect(() => {
    if (isReduced) {
      opacity.value = STATIC_OPACITY;
      return;
    }

    translateY.value = withRepeat(
      withSequence(
        withTiming(FLOAT_DISTANCE, { duration: CYCLE_DURATION, easing: motion.easing.symmetric }),
        withTiming(0, { duration: CYCLE_DURATION, easing: motion.easing.symmetric })
      ),
      -1,
      true
    );

    opacity.value = withRepeat(
      withSequence(
        withTiming(OPACITY_MIN, { duration: CYCLE_DURATION, easing: motion.easing.symmetric }),
        withTiming(1, { duration: CYCLE_DURATION, easing: motion.easing.symmetric })
      ),
      -1,
      true
    );

    return () => {
      cancelAnimation(translateY);
      cancelAnimation(opacity);
    };
  }, [isReduced, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={animatedStyle}>
      <AppIcon icon={icon} size={size} color={color} />
    </Animated.View>
  );
}
