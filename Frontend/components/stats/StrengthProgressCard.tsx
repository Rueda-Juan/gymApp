import React from 'react';
import { Pressable } from 'react-native';
import { XStack, YStack } from 'tamagui';
import { format } from 'date-fns';
import { TrendingUp, ChevronRight } from 'lucide-react-native';

import { CardBase } from '@/components/ui/card';
import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { StatsLineChart } from '@/components/charts';
import { getExerciseName } from '@/utils/exercise';
import { FONT_SCALE } from '@/tamagui.config';

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
    <CardBase padding="$md">
      <XStack alignItems="center" gap="$sm" marginBottom="$md">
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
        >
          <AppText variant="bodyMd" color={strengthExercise ? 'color' : 'textTertiary'}>
            {strengthExercise ? getExerciseName(strengthExercise) : 'Seleccionar ejercicio...'}
          </AppText>
          <AppIcon icon={ChevronRight} size={18} color="textTertiary" />
        </XStack>
      </Pressable>

      {strengthExercise && strengthHistory.length > 0 ? (
        <YStack gap="$sm">
          <XStack alignItems="baseline" gap="$xs">
            <AppText variant="titleLg" fontSize={FONT_SCALE.sizes.display}>{current1RM.toFixed(1)}</AppText>
            <AppText variant="bodyMd" color="textSecondary">kg · 1RM est.</AppText>
          </XStack>
          <AppText variant="label" color="textTertiary" marginBottom="$sm">PROGRESIÓN 1RM ESTIMADO</AppText>
          <StatsLineChart
            data={strengthHistory}
            height={160}
            xTickFormat={(t) => { try { return format(new Date(t), 'dd/MM'); } catch { return ''; } }}
          />
        </YStack>
      ) : (
        <YStack alignItems="center" justifyContent="center" height={100}>
          <AppText variant="bodyMd" color="textTertiary">
            {strengthExercise ? 'Sin historial para este ejercicio' : 'Selecciona un ejercicio para ver su progreso'}
          </AppText>
        </YStack>
      )}
    </CardBase>
  );
}
