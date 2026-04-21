import React from 'react';
import { YStack, XStack } from 'tamagui';
import { Bell } from 'lucide-react-native';
import { Screen } from '@/shared/ui/Screen';
import { AppText } from '@/shared/ui/AppText';
import { AppButton } from '@/shared/ui/AppButton';
import { EmptyState } from '@/shared/ui/EmptyState';
import { router } from 'expo-router';

export default function NotificationsScreen() {
  return (
    <Screen safeAreaEdges={['top','bottom','left','right']}>
      <YStack paddingHorizontal="$lg" paddingTop="$lg" gap="$md">
        <XStack alignItems="center" gap="$sm" flexWrap="wrap">
          <AppText variant="titleLg">Notificaciones</AppText>
          <YStack paddingHorizontal="$sm" paddingVertical="$xs" borderRadius="$md" backgroundColor="$primarySubtle">
            <AppText variant="label" color="primary">PRÓXIMAMENTE</AppText>
          </YStack>
        </XStack>
      </YStack>
      <EmptyState
        icon={Bell}
        title="En desarrollo"
        description="Pronto podrás configurar notificaciones push y recordatorios de entrenamiento."
        action={<AppButton label="Volver" onPress={() => router.back()} />}
      />
    </Screen>
  );
}
