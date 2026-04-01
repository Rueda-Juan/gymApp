import React, { useMemo } from 'react';
import { XStack, YStack } from 'tamagui';
import { format } from 'date-fns';
import { Scale, Plus } from 'lucide-react-native';

import { CardBase } from '@/components/ui/card';
import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { IconButton } from '@/components/ui/AppButton';
import { StatsLineChart } from '@/components/charts';
import type { BodyWeightEntry } from 'backend/shared/types';
import { FONT_SCALE } from '@/tamagui.config';

interface BodyWeightCardProps {
  weightHistory: BodyWeightEntry[];
  onAddWeight: () => void;
}

export function BodyWeightCard({ weightHistory, onAddWeight }: BodyWeightCardProps) {
  const chartData = useMemo(
    () => weightHistory
      .map((w) => ({ x: w.date, y: Number(w.weight) }))
      .filter((p) => !isNaN(p.y) && p.y > 0)
      .reverse(),
    [weightHistory]
  );

  return (
    <CardBase padding="$md">
      <XStack justifyContent="space-between" alignItems="center">
        <XStack alignItems="center" gap="$sm">
          <AppIcon icon={Scale} size={20} color="primary" />
          <AppText variant="titleSm">Peso Corporal</AppText>
        </XStack>
        <IconButton
          icon={<AppIcon icon={Plus} size={16} color="primary" />}
          size={32}
          backgroundColor="$primarySubtle"
          onPress={onAddWeight}
          accessibilityLabel="Registrar peso"
        />
      </XStack>

      <XStack alignItems="center" marginVertical="$md">
        <AppText variant="titleLg" fontSize={FONT_SCALE.sizes.displayLg}>
          {weightHistory.length > 0 ? (Number(weightHistory[0].weight) || 0).toFixed(1) : '--'}
        </AppText>
        <AppText variant="bodyMd" color="textSecondary" marginLeft="$xs" marginTop="$sm">kg</AppText>
      </XStack>

      <AppText variant="label" color="textTertiary" marginBottom="$md">ÚLTIMOS 30 DÍAS</AppText>
      {weightHistory.length > 1 ? (
        <StatsLineChart
          data={chartData}
          xTickFormat={(t) => {
            try {
              return format(new Date(t), 'dd/MM');
            } catch {
              return '';
            }
          }}
        />
      ) : (
        <YStack alignItems="center" justifyContent="center" height={120}>
          <AppText variant="bodyMd" color="textTertiary">Registra más datos para ver el gráfico</AppText>
        </YStack>
      )}
    </CardBase>
  );
}
