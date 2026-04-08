import React from 'react';
import { YStack, XStack } from 'tamagui';
import { SkeletonLoader } from '../feedback/SkeletonLoader';

export const RoutineCardSkeleton = React.memo(function RoutineCardSkeleton() {
  return (
    <YStack padding="$md" borderRadius="$lg" borderCurve="continuous" backgroundColor="$surface" gap="$md">
      <XStack justifyContent="space-between" alignItems="stretch">
        <YStack flex={1} padding="$md" gap="$xs">
          <SkeletonLoader width="40%" height={14} accessibilityElementsHidden importantForAccessibility="no" />
          <SkeletonLoader width="70%" height={20} accessibilityElementsHidden importantForAccessibility="no" />
          <SkeletonLoader width="90%" height={16} accessibilityElementsHidden importantForAccessibility="no" />
          <XStack gap="$sm" marginTop="$sm">
            <SkeletonLoader width={60} height={22} borderRadius="$full" accessibilityElementsHidden importantForAccessibility="no" />
            <SkeletonLoader width={60} height={22} borderRadius="$full" accessibilityElementsHidden importantForAccessibility="no" />
          </XStack>
        </YStack>
        <YStack width={64} alignItems="center" justifyContent="center" borderLeftWidth={1} borderLeftColor="$borderColor">
          <SkeletonLoader width={32} height={32} borderRadius="$full" accessibilityElementsHidden importantForAccessibility="no" />
        </YStack>
      </XStack>
    </YStack>
  );
});

export const HistoryCardSkeleton = React.memo(function HistoryCardSkeleton() {
  return (
    <YStack padding="$md" borderRadius="$lg" borderCurve="continuous" backgroundColor="$surface" gap="$sm">
      <XStack justifyContent="space-between" alignItems="center">
        <YStack flex={1} gap="$xs">
          <SkeletonLoader width="60%" height={20} accessibilityElementsHidden importantForAccessibility="no" />
          <SkeletonLoader width="40%" height={14} accessibilityElementsHidden importantForAccessibility="no" />
        </YStack>
        <SkeletonLoader width={20} height={20} borderRadius="$sm" accessibilityElementsHidden importantForAccessibility="no" />
      </XStack>
      <XStack alignItems="center" gap="$lg">
        <SkeletonLoader width={60} height={14} accessibilityElementsHidden importantForAccessibility="no" />
        <SkeletonLoader width={70} height={14} accessibilityElementsHidden importantForAccessibility="no" />
        <SkeletonLoader width={50} height={14} accessibilityElementsHidden importantForAccessibility="no" />
      </XStack>
      <SkeletonLoader width="80%" height={14} accessibilityElementsHidden importantForAccessibility="no" />
    </YStack>
  );
});
