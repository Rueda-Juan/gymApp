import React from 'react';
import { ScrollView } from 'react-native';
import { YStack, XStack } from 'tamagui';
import { router } from 'expo-router';
import { X, Info, Github, Twitter, ShieldCheck } from 'lucide-react-native';

import { Screen, AppText, AppIcon, IconButton, CardBase as Card } from '@/shared/ui';

export default function ModalPage() {
  return (
    <Screen safeAreaEdges={['top', 'bottom']}>
      <YStack flex={1}>
        {/* Header */}
        <XStack
          justifyContent="space-between"
          alignItems="center"
          paddingHorizontal="$lg"
          height={56}
          borderBottomWidth={1}
          borderBottomColor="$borderColor"
        >
          <XStack alignItems="center" gap="$sm">
            <AppIcon icon={Info} size={20} color="primary" />
            <AppText variant="titleSm">Información</AppText>
          </XStack>
          <IconButton
            icon={<AppIcon icon={X} size={24} color="textSecondary" />}
            onPress={() => router.back()}
            accessibilityLabel="Cerrar"
          />
        </XStack>

        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack padding="$lg" gap="$xl">
            {/* App Info Card */}
            <Card variant="outlined" padding="$lg" gap="$md">
              <AppText variant="titleMd">Temper Identity</AppText>
              <AppText variant="bodyMd" color="textSecondary">
                Tu compañero definitivo para el seguimiento de entrenamientos, diseñado con un enfoque en la simplicidad y el rendimiento.
              </AppText>
              <AppText variant="label" color="textTertiary">Versión 3.0.0 (Alpha)</AppText>
            </Card>

            {/* Features/Status */}
            <YStack gap="$md">
              <AppText variant="label" color="textSecondary">ESTADO DEL SISTEMA</AppText>
              <XStack alignItems="center" gap="$md" padding="$md" backgroundColor="$surfaceSecondary" borderRadius="$lg">
                <AppIcon icon={ShieldCheck} color="success" size={20} />
                <YStack flex={1}>
                  <AppText variant="bodyMd" fontWeight="600">Base de datos local</AppText>
                  <AppText variant="bodySm" color="textSecondary">Sincronizada y segura</AppText>
                </YStack>
              </XStack>
            </YStack>

            {/* Links/Social */}
            <YStack gap="$md">
              <AppText variant="label" color="textSecondary">COMUNIDAD</AppText>
              
              <XStack gap="$md">
                <Card variant="outlined" flex={1} padding="$md" alignItems="center" gap="$sm">
                  <AppIcon icon={Github} size={20} color="textSecondary" />
                  <AppText variant="bodySm">GitHub</AppText>
                </Card>
                <Card variant="outlined" flex={1} padding="$md" alignItems="center" gap="$sm">
                  <AppIcon icon={Twitter} size={20} color="textSecondary" />
                  <AppText variant="bodySm">Twitter</AppText>
                </Card>
              </XStack>
            </YStack>

            {/* Footer Text */}
            <YStack marginTop="$xl" alignItems="center">
              <AppText variant="bodySm" color="textTertiary" textAlign="center">
                Temper
              </AppText>
            </YStack>
          </YStack>
        </ScrollView>
      </YStack>
    </Screen>
  );
}
