import React, { useEffect } from 'react';
import { Value, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@tamagui/core';
import { YStack, XStack } from 'tamagui';

interface SkeletonLoaderProps {
  width?: Value | string;
  height?: Value | string;
  borderRadius?: number;
  style?: ViewStyle;
}

const AnimatedView = Animated.createAnimatedComponent(YStack);

export function SkeletonLoader({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}: SkeletonLoaderProps) {
  const theme = useTheme();
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <AnimatedView
      width={width}
      height={height}
      borderRadius={borderRadius}
      backgroundColor="$surfaceSecondary"
      overflow="hidden"
      style={[animatedStyle, style]}
    />
  );
}

export function RoutineCardSkeleton() {
  return (
    <YStack width={280} p="$md" borderRadius="$lg" backgroundColor="$surface" mr="$md">
      <SkeletonLoader width="70%" height={20} style={{ marginBottom: 12 }} />
      <SkeletonLoader width="100%" height={14} style={{ marginBottom: 8 }} />
      <SkeletonLoader width="80%" height={14} style={{ marginBottom: 20 }} />
      <XStack justifyContent="space-between" alignItems="center">
        <SkeletonLoader width={60} height={12} />
        <SkeletonLoader width={32} height={32} borderRadius={9999} />
      </XStack>
    </YStack>
  );
}

export function HistoryCardSkeleton() {
  return (
    <YStack p="$md" borderRadius="$lg" backgroundColor="$surface" mb="$md" borderLeftWidth={4} borderLeftColor="$surfaceSecondary">
      <XStack width="100%" justifyContent="space-between" mb="$3">
        <YStack flex={1}>
          <SkeletonLoader width="60%" height={18} style={{ marginBottom: 4 }} />
          <SkeletonLoader width="40%" height={12} />
        </YStack>
        <SkeletonLoader width={80} height={24} borderRadius={12} />
      </XStack>
      <XStack width="100%" justifyContent="flex-start" space="$5">
        <SkeletonLoader width={60} height={14} />
        <SkeletonLoader width={80} height={14} />
      </XStack>
    </YStack>
  );
}
