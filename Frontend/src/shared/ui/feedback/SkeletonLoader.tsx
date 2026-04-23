import React, { useEffect } from 'react';
import { DimensionValue } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { YStack, YStackProps } from 'tamagui';
import { motion } from '../theme/motion';
import { useMotion } from '../../lib/hooks/useMotion';

const SKELETON_OPACITY_MIN = 0.5;
const SKELETON_OPACITY_REDUCED = 0.7;
const SKELETON_PULSE_DURATION_MS = 800;

const AnimatedYStack = Animated.createAnimatedComponent(YStack);

export interface SkeletonLoaderProps extends YStackProps {
  width?: DimensionValue;
  height?: DimensionValue;
}

export function SkeletonLoader({
  width = '100%',
  height = 20,
  borderRadius = '$md',
  ...props
}: SkeletonLoaderProps) {
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
          easing: motion.easing?.symmetric || undefined 
        }),
        withTiming(SKELETON_OPACITY_MIN, { 
          duration: SKELETON_PULSE_DURATION_MS, 
          // @ts-ignore - internal easing helper
          easing: motion.easing?.symmetric || undefined 
        })
      ),
      -1,
      true
    );
  }, [opacity, isReduced]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <AnimatedYStack
      width={width}
      height={height}
      borderRadius={borderRadius}
      borderCurve="continuous"
      backgroundColor="$surfaceSecondary"
      overflow="hidden"
      style={animatedStyle}
      {...props}
    />
  );
}
