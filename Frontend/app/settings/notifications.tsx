import React from 'react';
import { YStack, XStack } from 'tamagui';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { router } from 'expo-router';

export default function NotificationsScreen() {
  return (
    <Screen safeAreaEdges={['top', 'left', 'right']}>
      <YStack paddingHorizontal="$lg" paddingTop="$lg" gap="$md">
        <XStack alignItems="center" gap="$sm" flexWrap="wrap">
          <AppText variant="titleLg">Notificaciones</AppText>
          <YStack paddingHorizontal="$sm" paddingVertical="$xs" borderRadius="$md" backgroundColor="$primarySubtle">
            <AppText variant="label" color="primary">PRÓXIMAMENTE</AppText>
          </YStack>
        </XStack>
        <AppText variant="bodyMd" color="textSecondary">Personaliza alertas y recordatorios.</AppText>
        <AppText variant="bodyMd" color="textTertiary" marginTop="$md">
          Esta sección está en desarrollo. Pronto podrás configurar notificaciones push y recordatorios de entrenamiento.
        </AppText>
        <AppButton label="Volver" onPress={() => router.back()} />
      </YStack>
    </Screen>
  );
}
