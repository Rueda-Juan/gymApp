import React from 'react';
import { YStack, XStack, ScrollView } from 'tamagui';
import { router } from 'expo-router';
import { CheckCircle2, Clock, Trophy } from 'lucide-react-native';

import { Screen, AppText, AppButton, AppIcon, Card } from '@/shared/ui';
import { ROUTES } from '@/shared/constants/routes';
export default function SummaryPage() {
  // In a real scenario, we would fetch the finished workout by ID
  // But since we just finished it, we might still have some state or we can mock it
  
  // For now, we'll use the last outcome and show a success screen
  // If we had a "lastFinishedWorkout" in store, we would use it here
  
  return (
    <Screen safeAreaEdges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack padding="$xl" gap="$2xl">
          <YStack alignItems="center" gap="$md" marginTop="$xl">
            <CheckCircle2 size={80} color="#10b981" />
            <AppText variant="titleLg" textAlign="center">
              ¡Entrenamiento completado!
            </AppText>
            <AppText variant="bodyMd" color="textSecondary" textAlign="center">
              Buen trabajo. Tu esfuerzo de hoy suma para tus objetivos.
            </AppText>
          </YStack>

          <XStack gap="$lg" width="100%">
            <Card flex={1} padding="$md" alignItems="center" gap="$xs">
              <AppIcon icon={Clock} color="primary" size={20} />
              <AppText variant="label" color="textTertiary">TIEMPO</AppText>
              <AppText variant="titleSm">45m</AppText>
            </Card>
            <Card flex={1} padding="$md" alignItems="center" gap="$xs">
              <AppIcon icon={Trophy} color="primary" size={20} />
              <AppText variant="label" color="textTertiary">VOLUMEN</AppText>
              <AppText variant="titleSm">12k kg</AppText>
            </Card>
          </XStack>

          <YStack width="100%" gap="$md">
            <AppButton 
              label="Ver historial completo"
              onPress={() => router.replace(ROUTES.HISTORY)}
            />
            <AppButton 
              label="Volver al inicio"
              appVariant="ghost"
              onPress={() => router.replace(ROUTES.TABS_HOME)}
            />
          </YStack>
        </YStack>
      </ScrollView>
    </Screen>
  );
}
