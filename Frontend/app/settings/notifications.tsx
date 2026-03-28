import React from 'react';
import { XStack, YStack } from 'tamagui';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { router } from 'expo-router';

export default function NotificationsScreen() {
  return (
    <Screen safeAreaEdges={['top', 'left', 'right']}>
      <YStack paddingHorizontal="$lg" paddingTop="$lg" gap="$md">
        <AppText variant="titleLg">Notificaciones</AppText>
        <AppText variant="bodyMd" color="textSecondary">Personaliza alertas y recordatorios.</AppText>

        <AppText variant="bodyMd" marginTop="$md">Aún en desarrollo: agrega aquí los toggles de notificaciones push o recordatorios.</AppText>

        <AppButton label="Volver" onPress={() => router.back()} />
      </YStack>
    </Screen>
  );
}
