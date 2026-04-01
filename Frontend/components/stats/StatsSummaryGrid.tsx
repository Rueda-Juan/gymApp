import React from 'react';
import { XStack } from 'tamagui';
import { Calendar, Dumbbell, Clock, Trophy } from 'lucide-react-native';

import { CardBase } from '@/components/ui/card';
import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';

interface SummaryStats {
  workouts: number;
  volume: number;
  time: number;
  prs: number;
}

interface StatsSummaryGridProps {
  summaries: SummaryStats;
}

export function StatsSummaryGrid({ summaries }: StatsSummaryGridProps) {
  const formattedVolume = summaries.volume > 1000
    ? `${(summaries.volume / 1000).toFixed(1)}k`
    : summaries.volume;

  return (
    <>
      <XStack gap="$md">
        {[
          { icon: Calendar, label: 'WORKOUTS', value: summaries.workouts },
          { icon: Dumbbell, label: 'VOLUMEN (KG)', value: formattedVolume },
        ].map(({ icon: Icon, label, value }) => (
          <CardBase key={label} flex={1} padding="$md">
            <XStack alignItems="center" gap="$xs" marginBottom="$xs">
              <AppIcon icon={Icon} size={16} color="primary" />
              <AppText variant="label" color="textTertiary">{label}</AppText>
            </XStack>
            <AppText variant="titleMd">{value}</AppText>
          </CardBase>
        ))}
      </XStack>
      <XStack gap="$md">
        {[
          { icon: Clock, label: 'TIEMPO (H)', value: summaries.time },
          { icon: Trophy, label: 'PRS', value: summaries.prs },
        ].map(({ icon: Icon, label, value }) => (
          <CardBase key={label} flex={1} padding="$md">
            <XStack alignItems="center" gap="$xs" marginBottom="$xs">
              <AppIcon icon={Icon} size={16} color="primary" />
              <AppText variant="label" color="textTertiary">{label}</AppText>
            </XStack>
            <AppText variant="titleMd">{value}</AppText>
          </CardBase>
        ))}
      </XStack>
    </>
  );
}
