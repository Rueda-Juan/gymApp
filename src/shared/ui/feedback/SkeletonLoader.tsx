import React, { useEffect } from 'react';
import { DimensionValue, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { useTheme } from 'tamagui';
import { motion } from '../theme/motion';
import { useMotion } from '../../lib/hooks/useMotion';

const SKELETON_OPACITY_MIN = 0.5;
const SKELETON_OPACITY_REDUCED = 0.7;
const SKELETON_PULSE_DURATION_MS = 800;
// Valor de fallback si el token de tema no está disponible
const SKELETON_BG_FALLBACK = '#2a2a2a';

export interface SkeletonLoaderProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
}

export function SkeletonLoader({
  width = '100%',
  height = 20,
  borderRadius = 8,
}: SkeletonLoaderProps) {
  const theme = useTheme();
  const { isReduced } = useMotion();
  const opacity = useSharedValue(SKELETON_OPACITY_MIN);

  useEffect(() => {
    if (isReduced) {
      opacity.value = SKELETON_OPACITY_REDUCED;
      return;
    }
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: SKELETON_PULSE_DURATION_MS,
          // @ts-ignore - internal easing helper
          easing: motion.easing?.symmetric || undefined,
        }),
        withTiming(SKELETON_OPACITY_MIN, {
          duration: SKELETON_PULSE_DURATION_MS,
          // @ts-ignore - internal easing helper
          easing: motion.easing?.symmetric || undefined,
        }),
      ),
      -1,
      true,
    );
  }, [opacity, isReduced]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const backgroundColor =
    (theme.surfaceSecondary?.val as string | undefined) ?? SKELETON_BG_FALLBACK;

  return (
    <Animated.View
      style={[
        styles.base,
        { width, height, borderRadius, backgroundColor },
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});
