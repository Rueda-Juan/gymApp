import React from 'react';
// import { Pressable } from 'react-native';
import { XStack, YStack } from 'tamagui';
import { AppText } from '@/shared/ui/AppText';

interface HomeHeaderProps {
  userName?: string | null;
  onEditProfile: () => void;
}

export default function HomeHeader({ userName, onEditProfile }: HomeHeaderProps) {
  return (
    <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$xl" paddingTop="$xl" paddingBottom="$lg">
      <YStack
        onPress={onEditProfile}
        accessibilityRole="button"
        accessibilityLabel="Editar perfil"
        cursor="pointer"
        pressStyle={{ opacity: 0.85 }}
      >
        <AppText variant="bodyLg" color="textSecondary">Bienvenido</AppText>
        <AppText variant="titleLg">{userName}</AppText>
      </YStack>
    </XStack>
  );
}
