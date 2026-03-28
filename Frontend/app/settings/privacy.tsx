import React from 'react';
import { XStack, YStack } from 'tamagui';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { router } from 'expo-router';

export default function PrivacyScreen() {
  return (
    <Screen safeAreaEdges={['top', 'left', 'right']}>
      <YStack paddingHorizontal="$lg" paddingTop="$lg" gap="$md">
        <AppText variant="titleLg">Privacidad</AppText>
        <AppText variant="bodyMd" color="textSecondary">Configura permisos y uso de datos.</AppText>

        <AppText variant="bodyMd" marginTop="$md">Aún en desarrollo: mostrar políticas de privacidad, gestión de cookies y borrado de datos.</AppText>

        <AppButton label="Volver" onPress={() => router.back()} />
      </YStack>
    </Screen>
  );
}
