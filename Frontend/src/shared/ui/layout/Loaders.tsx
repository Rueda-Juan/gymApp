import React from 'react';
import { YStack, XStack } from 'tamagui';
import { SkeletonLoader } from '../feedback/SkeletonLoader';

export const StatsSummaryGridSkeleton = React.memo(function StatsSummaryGridSkeleton() {
  return (
    <YStack gap="$md">
      {[0, 1].map((row) => (
        <XStack key={row} gap="$md">
          {[0, 1].map((col) => (
            <YStack key={col} flex={1} padding="$md" borderRadius="$lg" borderCurve="continuous" backgroundColor="$surface">
              <SkeletonLoader width="50%" height={14} marginBottom="$xs" />
              <SkeletonLoader width="40%" height={24} />
            </YStack>
          ))}
        </XStack>
      ))}
    </YStack>
  );
});

export const StatsPageSkeleton = React.memo(function StatsPageSkeleton() {
  return (
    <YStack gap="$lg" paddingHorizontal="$xl" paddingTop="$sm">
      <StatsSummaryGridSkeleton />

      {/* BodyWeight card skeleton */}
      <YStack padding="$md" borderRadius="$lg" borderCurve="continuous" backgroundColor="$surface" gap="$md">
        <XStack justifyContent="space-between" alignItems="center">
          <SkeletonLoader width={140} height={20} />
          <SkeletonLoader width={44} height={44} borderRadius="$full" />
        </XStack>
        <SkeletonLoader width={80} height={32} />
        <SkeletonLoader width="60%" height={14} />
        <SkeletonLoader width="100%" height={120} borderRadius="$md" />
      </YStack>

      {/* Strength card skeleton */}
      <YStack padding="$md" borderRadius="$lg" borderCurve="continuous" backgroundColor="$surface" gap="$md">
        <SkeletonLoader width={160} height={20} />
        <SkeletonLoader width="100%" height={44} borderRadius="$md" />
        <SkeletonLoader width="100%" height={160} borderRadius="$md" />
      </YStack>

      {/* Volume chart skeleton */}
      <YStack borderRadius="$lg" borderCurve="continuous" backgroundColor="$surface">
        <SkeletonLoader width={140} height={16} margin="$md" />
        <SkeletonLoader width="100%" height={200} borderRadius={0} />
      </YStack>

      {/* Activity grid skeleton */}
      <YStack padding="$md" borderRadius="$lg" borderCurve="continuous" backgroundColor="$surface">
        <SkeletonLoader width="100%" height={140} borderRadius="$md" />
      </YStack>
    </YStack>
  );
});

export const DashboardSkeleton = React.memo(function DashboardSkeleton() {
  return (
    <YStack gap="$lg" paddingHorizontal="$xl">
      {/* Stats row */}
      <XStack gap="$md">
        <YStack flex={1} padding="$md" borderRadius="$lg" borderCurve="continuous" backgroundColor="$surface" borderWidth={1} borderColor="$borderColor" gap="$sm">
          <SkeletonLoader width="60%" height={14} />
          <SkeletonLoader width="50%" height={24} />
        </YStack>
        <YStack flex={1} padding="$md" borderRadius="$lg" borderCurve="continuous" backgroundColor="$surface" borderWidth={1} borderColor="$borderColor" gap="$sm">
          <SkeletonLoader width="60%" height={14} />
          <SkeletonLoader width="50%" height={24} />
        </YStack>
      </XStack>

      {/* Weekly circles */}
      <XStack justifyContent="center" gap="$sm">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <SkeletonLoader key={i} width={28} height={28} borderRadius={14} />
        ))}
      </XStack>

      {/* Last workout card */}
      <YStack padding="$md" borderRadius="$lg" borderCurve="continuous" backgroundColor="$surface" gap="$md">
        <SkeletonLoader width="50%" height={16} />
        <SkeletonLoader width="100%" height={80} borderRadius="$md" />
      </YStack>

      {/* Routine cards */}
      <YStack gap="$md">
        <SkeletonLoader width={120} height={20} />
        <YStack padding="$md" borderRadius="$lg" borderCurve="continuous" backgroundColor="$surface" gap="$sm">
          <SkeletonLoader width="70%" height={20} />
          <SkeletonLoader width="40%" height={14} />
          <SkeletonLoader width="90%" height={16} />
        </YStack>
        <YStack padding="$md" borderRadius="$lg" borderCurve="continuous" backgroundColor="$surface" gap="$sm">
          <SkeletonLoader width="60%" height={20} />
          <SkeletonLoader width="45%" height={14} />
          <SkeletonLoader width="80%" height={16} />
        </YStack>
      </YStack>
    </YStack>
  );
});
