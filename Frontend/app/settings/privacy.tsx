import React from 'react';
import { YStack, XStack } from 'tamagui';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { router } from 'expo-router';

export default function PrivacyScreen() {
  return (
    <Screen safeAreaEdges={['top', 'left', 'right']}>
      <YStack paddingHorizontal="$lg" paddingTop="$lg" gap="$md">
        <XStack alignItems="center" gap="$sm" flexWrap="wrap">
          <AppText variant="titleLg">Privacidad</AppText>
          <YStack paddingHorizontal="$sm" paddingVertical="$xs" borderRadius="$md" backgroundColor="$primarySubtle">
            <AppText variant="label" color="primary">PRÓXIMAMENTE</AppText>
          </YStack>
        </XStack>
        <AppText variant="bodyMd" color="textSecondary">Configura permisos y uso de datos.</AppText>
        <AppText variant="bodyMd" color="textTertiary" marginTop="$md">
          Esta sección está en desarrollo. Pronto encontrarás aquí política de privacidad y gestión de datos.
        </AppText>
        <AppButton label="Volver" onPress={() => router.back()} />
      </YStack>
    </Screen>
  );
}
