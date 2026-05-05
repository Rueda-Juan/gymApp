import React from 'react';
import { YStack, Text } from 'tamagui';

export const LoadingSkeleton = () => (
  <YStack flex={1} justifyContent="center" alignItems="center">
    <Text color="$textSecondary">Cargando...</Text>
  </YStack>
);
