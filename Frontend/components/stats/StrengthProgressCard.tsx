import React from 'react';
import { Pressable } from 'react-native';
import { XStack, YStack } from 'tamagui';
import { TrendingUp, ChevronRight } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { CardBase } from '@/components/ui/Card';
import { animatedCardShadow, elevation } from '@/constants/elevation';
import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { StatsLineChart } from '@/components/charts/index';
import { formatDateTick } from '@/components/charts/chartUtils';
import { getExerciseName } from '@/utils/exercise';
import { FONT_SCALE } from '@/tamagui.config';

const CHART_HEIGHT = 160;
const EMPTY_STATE_HEIGHT = 100;

interface StrengthExercise {
  name: string;
  nameEs?: string | null;
}

interface StrengthProgressCardProps {
  strengthExercise: StrengthExercise | null;
  strengthHistory: { x: string; y: number }[];
  current1RM: number;
  onOpenExercisePicker: () => void;
}

export function StrengthProgressCard({
  strengthExercise,
  strengthHistory,
  current1RM,
  onOpenExercisePicker,
}: StrengthProgressCardProps) {
  return (
    <Animated.View entering={FadeInDown.delay(300).springify()} style={animatedCardShadow}>
      <CardBase padding="$md" {...elevation.flat}>
        <YStack gap="$sm">
          <XStack alignItems="center" gap="$sm" style={{ minHeight: 32 }}>
            <AppIcon icon={TrendingUp} size={20} color="primary" />
            <AppText variant="titleSm" flex={1}>Fuerza</AppText>
          </XStack>
          <Pressable onPress={onOpenExercisePicker} accessibilityLabel="Seleccionar ejercicio">
            <XStack
              alignItems="center"
              justifyContent="space-between"
              padding="$sm"
              borderRadius="$md"
              borderWidth={1}
              borderColor="$borderColor"
              backgroundColor="$surfaceSecondary"
              marginBottom="$md"
              style={{ minHeight: 44 }}
            >
              <AppText variant="bodyMd" color={strengthExercise ? 'color' : 'textTertiary'} numberOfLines={1} style={{ flex: 1 }}>
                {strengthExercise ? getExerciseName(strengthExercise) : 'Seleccionar ejercicio...'}
              </AppText>
              <AppIcon icon={ChevronRight} size={18} color="textTertiary" />
            </XStack>
          </Pressable>
        </YStack>

      {strengthExercise && strengthHistory.length > 0 ? (
        <YStack gap="$sm">
          <XStack alignItems="baseline" gap="$xs">
            <AppText fontSize={FONT_SCALE.sizes.display} fontWeight={FONT_SCALE.weights.bold} letterSpacing={-0.5}>{current1RM.toFixed(1)}</AppText>
            <AppText variant="bodyMd" color="textSecondary">kg · 1RM est.</AppText>
          </XStack>
          <AppText variant="label" color="textTertiary" marginBottom="$sm">PROGRESIÓN 1RM ESTIMADO</AppText>
          <StatsLineChart
            data={strengthHistory}
            height={CHART_HEIGHT}
            xTickFormat={formatDateTick}
          />
        </YStack>
      ) : (
        <YStack alignItems="center" justifyContent="center" height={EMPTY_STATE_HEIGHT}>
          <AppText variant="bodyMd" color="textTertiary">
            {strengthExercise ? 'Sin historial para este ejercicio' : 'Selecciona un ejercicio para ver su progreso'}
          </AppText>
        </YStack>
      )}
      </CardBase>
    </Animated.View>
  );
}
