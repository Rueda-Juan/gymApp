import React from 'react';
import { Pressable } from 'react-native';
import { XStack, YStack } from 'tamagui';
import { AppText } from '@/components/ui/AppText';

interface HomeHeaderProps {
  userName?: string | null;
  onEditProfile: () => void;
}

export default function HomeHeader({ userName, onEditProfile }: HomeHeaderProps) {
  return (
    <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$xl" paddingTop="$xl" paddingBottom="$lg">
      <Pressable onPress={onEditProfile} accessibilityLabel="Editar perfil">
        <YStack>
          <AppText variant="bodyLg" color="textSecondary">Bienvenido</AppText>
          <AppText variant="titleLg">{userName}</AppText>
        </YStack>
      </Pressable>
    </XStack>
  );
}
