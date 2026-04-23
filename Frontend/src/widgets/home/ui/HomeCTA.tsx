import React from 'react';
// import { Pressable } from 'react-native';
import { XStack, YStack } from 'tamagui';
import { AppButton } from '@/shared/ui/AppButton';
import { AppIcon } from '@/shared/ui/AppIcon';
import { Play, Activity } from 'lucide-react-native';
import { AppText } from '@/shared/ui/AppText';

interface HomeCTAProps {
  isActive: boolean;
  routineName?: string | null;
  onContinue: () => void;
  onNewSession: () => void;
  onFreeSession: () => void;
}

export function HomeCTA({ isActive, routineName, onContinue, onNewSession, onFreeSession }: HomeCTAProps) {
  return (
    <YStack paddingHorizontal="$xl" paddingBottom="$xl">
      {isActive ? (
        <YStack
          onPress={onContinue}
          accessibilityRole="button"
          accessibilityLabel="Continuar entrenamiento en curso"
          backgroundColor="$primarySubtle"
          borderWidth={1.5}
          borderColor="$primary"
          height={80}
          borderRadius="$lg"
          borderCurve="continuous"
          paddingHorizontal="$lg"
          justifyContent="center"
          cursor="pointer"
          pressStyle={{ opacity: 0.85 }}
        >
          <XStack alignItems="center" gap="$sm">
            <AppIcon icon={Activity} color="primary" size={20} />
            <AppText variant="bodySm" color="primary" fontWeight="700">
              ENTRENAMIENTO EN CURSO
            </AppText>
          </XStack>
          <AppText variant="titleSm" color="primary" marginTop="$xs">
            Continuar {routineName}
          </AppText>
        </YStack>
      ) : (
        <YStack gap="$md">
          <AppButton
            appVariant="primary"
            backgroundColor="$primary"
            label="Elegir Rutina"
            icon={<AppIcon icon={Play} color="surface" fill="surface" size={24} />}
            onPress={onNewSession}
            thermalBreathing
          />
          <AppButton
            appVariant="ghost"
            label="Entrenamiento Libre"
            onPress={onFreeSession}
          />
        </YStack>
      )}
    </YStack>
  );
}
