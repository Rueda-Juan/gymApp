import React, { useMemo } from 'react';
import { XStack, YStack } from 'tamagui';
import { Scale, Plus } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { CardBase } from '@/shared/ui/Card';
import { animatedCardShadow, elevation } from '@/shared/ui/theme/elevation';
import { AppText } from '@/shared/ui/AppText';
import { FONT_SCALE } from '@/shared/ui/theme/tamagui.config';
import { AppIcon } from '@/shared/ui/AppIcon';
import { IconButton } from '@/shared/ui/AppButton';
import { StatsLineChart } from '@/shared/ui/charts/StatsLineChart';
import { formatDateTick } from '@/shared/ui/charts/chartUtils';
import type { BodyWeightDTO } from '@kernel';

const EMPTY_CHART_HEIGHT = 120;

interface BodyWeightCardProps {
  weightHistory: BodyWeightDTO[];
  onAddWeight: () => void;
}

export function BodyWeightCard({ weightHistory, onAddWeight }: BodyWeightCardProps) {
  const chartData = useMemo(
    () => weightHistory
      .map((w: BodyWeightDTO) => ({ x: w.date, y: Number(w.weight) }))
      .filter((p) => !isNaN(p.y) && p.y > 0)
      .reverse(),
    [weightHistory]
  );

  return (
    <Animated.View entering={FadeInDown.delay(200).springify()} style={animatedCardShadow}>
      <CardBase padding="$md" {...elevation.flat}>
      <XStack justifyContent="space-between" alignItems="center">
        <XStack alignItems="center" gap="$sm">
          <AppIcon icon={Scale} size={20} color="primary" />
          <AppText variant="titleSm">Peso Corporal</AppText>
        </XStack>
        <IconButton
          icon={<AppIcon icon={Plus} size={16} color="primary" />}
          size={44}
          backgroundColor="$primarySubtle"
          onPress={onAddWeight}
          accessibilityLabel="Registrar peso"
        />
      </XStack>

      <XStack alignItems="center" marginVertical="$md">
        <AppText fontSize={FONT_SCALE.sizes.displayLg} fontWeight={FONT_SCALE.weights.bold} letterSpacing={-0.5}>
          {weightHistory.length > 0
            ? (Number(weightHistory[0].weight) || 0).toFixed(1)
            : '--'}
        </AppText>
        <AppText variant="bodyMd" color="textSecondary" marginLeft="$xs" marginTop="$sm">kg</AppText>
      </XStack>

      <AppText variant="label" color="textTertiary" marginBottom="$md">ÚLTIMOS 30 DÍAS</AppText>
      {weightHistory.length > 1 ? (
        <StatsLineChart
          data={chartData}
          xTickFormat={formatDateTick}
        />
      ) : (
        <YStack alignItems="center" justifyContent="center" height={EMPTY_CHART_HEIGHT}>
          <AppText variant="bodyMd" color="textTertiary">Registra más datos para ver el gráfico</AppText>
        </YStack>
      )}
      </CardBase>
    </Animated.View>
  );
}
