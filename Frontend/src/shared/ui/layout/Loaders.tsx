import React from 'react';
import { YStack, XStack } from 'tamagui';
import { SkeletonLoader } from '../feedback/SkeletonLoader';

export const RoutineCardSkeleton = () => (
  <YStack
    padding="$lg"
    backgroundColor="$surfaceSecondary"
    borderRadius="$xl"
    gap="$md"
    height={120}
  >
    <XStack justifyContent="space-between" alignItems="center">
      <SkeletonLoader width={120} height={20} />
      <SkeletonLoader width={60} height={16} />
    </XStack>
    <XStack gap="$sm">
      <SkeletonLoader width={40} height={24} borderRadius={12} />
      <SkeletonLoader width={40} height={24} borderRadius={12} />
    </XStack>
  </YStack>
);

export const ExerciseCardSkeleton = () => (
  <XStack
    padding="$md"
    backgroundColor="$surfaceSecondary"
    borderRadius="$lg"
    gap="$md"
    alignItems="center"
  >
    <SkeletonLoader width={40} height={40} borderRadius={20} />
    <YStack flex={1} gap="$xs">
      <SkeletonLoader width="60%" height={20} />
      <SkeletonLoader width="40%" height={16} />
    </YStack>
  </XStack>
);

export const SetRowSkeleton = () => (
  <XStack alignItems="center" gap="$md" paddingVertical="$sm">
    <SkeletonLoader width={30} height={24} />
    <SkeletonLoader width="60%" height={24} />
    <SkeletonLoader width={40} height={24} />
  </XStack>
);

export const DashboardStatsSkeleton = () => (
  <XStack gap="$md" paddingHorizontal="$lg">
    <LoaderItem />
  </XStack>
);

export const StatsPageSkeleton = () => (
  <YStack padding="$lg" gap="$md">
    <SkeletonLoader width="60%" height={32} />
    <XStack gap="$md">
      <LoaderItem />
      <LoaderItem />
    </XStack>
    <SkeletonLoader width="100%" height={200} />
  </YStack>
);

export const DashboardSkeleton = () => (
  <YStack gap="$lg" paddingVertical="$lg">
    <XStack gap="$md" paddingHorizontal="$lg">
      <LoaderItem />
      <LoaderItem />
    </XStack>
    <YStack gap="$md" paddingHorizontal="$lg">
      <SkeletonLoader width="40%" height={24} />
      <SkeletonLoader width="100%" height={100} borderRadius="$lg" />
      <SkeletonLoader width="100%" height={100} borderRadius="$lg" />
    </YStack>
  </YStack>
);

export const HistoryCardSkeleton = () => (
  <YStack padding="$md" backgroundColor="$surfaceSecondary" borderRadius="$lg" gap="$sm">
    <SkeletonLoader width="70%" height={20} />
    <SkeletonLoader width="40%" height={16} />
    <XStack gap="$md">
      <SkeletonLoader width={60} height={24} />
      <SkeletonLoader width={60} height={24} />
    </XStack>
  </YStack>
);

const LoaderItem = () => <SkeletonLoader width={100} height={80} borderRadius="$lg" />;
