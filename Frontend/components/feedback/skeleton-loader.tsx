import React, { useEffect } from 'react';
import { DimensionValue } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { YStack, XStack, YStackProps } from 'tamagui';

const AnimatedYStack = Animated.createAnimatedComponent(YStack);

interface SkeletonLoaderProps extends YStackProps {
  width?: DimensionValue;
  height?: DimensionValue;
}

export function SkeletonLoader({
  width = '100%',
  height = 20,
  borderRadius = '$md',
  ...props
}: SkeletonLoaderProps) {
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.5, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [opacity]);

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

export const RoutineCardSkeleton = React.memo(function RoutineCardSkeleton() {
  return (
    <YStack width={280} padding="$md" borderRadius="$lg" borderCurve="continuous" backgroundColor="$surface" marginRight="$md" gap="$sm">
      <SkeletonLoader width="70%" height={24} />
      <SkeletonLoader width="100%" height={16} />
      <SkeletonLoader width="80%" height={16} marginBottom="$sm" />
      <XStack justifyContent="space-between" alignItems="center">
        <SkeletonLoader width={60} height={14} />
        <SkeletonLoader width={32} height={32} borderRadius="$full" />
      </XStack>
    </YStack>
  );
});

export const HistoryCardSkeleton = React.memo(function HistoryCardSkeleton() {
  return (
    <YStack padding="$md" borderRadius="$lg" borderCurve="continuous" backgroundColor="$surface" marginBottom="$md" borderLeftWidth={4} borderLeftColor="$surfaceSecondary" gap="$md">
      <XStack width="100%" justifyContent="space-between" alignItems="flex-start">
        <YStack flex={1} gap="$xs">
          <SkeletonLoader width="60%" height={20} />
          <SkeletonLoader width="40%" height={14} />
        </YStack>
        <SkeletonLoader width={80} height={24} borderRadius="$full" />
      </XStack>
      <XStack width="100%" justifyContent="flex-start" gap="$md">
        <SkeletonLoader width={60} height={14} />
        <SkeletonLoader width={80} height={14} />
      </XStack>
    </YStack>
  );
});