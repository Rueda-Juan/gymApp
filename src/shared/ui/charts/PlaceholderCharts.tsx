import React from 'react';
import { YStack } from 'tamagui';
import { AppText } from '../AppText';

export const WeeklyVolumeBarChart = (_props: Record<string, unknown>) => (
  <YStack padding="$lg" backgroundColor="$surfaceSecondary" borderRadius="$lg" height={200} justifyContent="center" alignItems="center">
    <AppText color="textTertiary">Gráfico de Volumen Semanal (MOCK)</AppText>
  </YStack>
);

export const ActivityGrid = (_props: Record<string, unknown>) => (
  <YStack padding="$md" backgroundColor="$surfaceSecondary" borderRadius="$lg" height={150} justifyContent="center" alignItems="center">
    <AppText color="textTertiary">Cuadrícula de Actividad (MOCK)</AppText>
  </YStack>
);
