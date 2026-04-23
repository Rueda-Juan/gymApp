import React from 'react';
import { XStack } from 'tamagui';
import { Calendar, Dumbbell, Clock, Trophy } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { CardBase } from '@/shared/ui/Card';
import { AppText } from '@/shared/ui/AppText';
import { AppIcon } from '@/shared/ui/AppIcon';
import { AnimatedNumber } from '@/shared/ui/feedback/AnimatedNumber';
import { animatedCardShadow, elevation } from '@/shared/constants/elevation';

const VOLUME_COMPACT_THRESHOLD = 1000;

function formatVolume(n: number): string {
  return n > VOLUME_COMPACT_THRESHOLD ? `${(n / VOLUME_COMPACT_THRESHOLD).toFixed(1)}k` : String(n);
}

interface SummaryStats {
  workouts: number;
  volume: number;
  time: number;
  prs: number;
}

interface SummaryRowItem {
  icon: LucideIcon;
  label: string;
  key: keyof SummaryStats;
}

interface StatsSummaryGridProps {
  summaries: SummaryStats;
}

const SUMMARY_ROWS: [SummaryRowItem[], SummaryRowItem[]] = [
  [
    { icon: Calendar, label: 'WORKOUTS', key: 'workouts' },
    { icon: Dumbbell, label: 'VOLUMEN (KG)', key: 'volume' },
  ],
  [
    { icon: Clock, label: 'TIEMPO (H)', key: 'time' },
    { icon: Trophy, label: 'PRS', key: 'prs' },
  ],
];

export function StatsSummaryGrid({ summaries }: StatsSummaryGridProps) {
  return (
    <>
      {SUMMARY_ROWS.map((row, rowIdx) => (
        <XStack key={rowIdx} gap="$md">
          {row.map(({ icon, label, key }, colIdx) => {
            const rawValue = summaries[key];
            return (
              <Animated.View
                key={label}
                entering={FadeInDown.delay(rowIdx * 100 + colIdx * 50).springify()}
                style={[{ flex: 1 }, animatedCardShadow]}
              >
                <CardBase padding="$md" accessibilityLabel={`${rawValue} ${label}`} {...elevation.flat}>
                <XStack alignItems="center" gap="$xs" marginBottom="$xs">
                  <AppIcon icon={icon} size={16} color="primary" />
                  <AppText variant="label" color="textTertiary">{label}</AppText>
                </XStack>
                <AnimatedNumber
                  value={rawValue}
                  variant="titleMd"
                  formatter={key === 'volume' ? formatVolume : undefined}
                />
                </CardBase>
              </Animated.View>
            );
          })}
        </XStack>
      ))}
    </>
  );
}
