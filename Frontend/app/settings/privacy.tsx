import React from 'react';
import { YStack, XStack } from 'tamagui';
import { Lock } from 'lucide-react-native';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { EmptyState } from '@/components/ui/empty-state';
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
      </YStack>
      <EmptyState
        icon={Lock}
        title="En desarrollo"
        description="Pronto encontrarás aquí política de privacidad y gestión de datos."
        action={<AppButton label="Volver" onPress={() => router.back()} />}
      />
    </Screen>
  );
}
