import { XStack as TamaguiXStack, YStack as TamaguiYStack, Stack as TamaguiStack } from 'tamagui';
import React from 'react';

export function XStack(props: React.ComponentProps<typeof TamaguiXStack>) {
  return <TamaguiXStack {...props} />;
}

export function YStack(props: React.ComponentProps<typeof TamaguiYStack>) {
  return <TamaguiYStack {...props} />;
}

export function ZStack(props: React.ComponentProps<typeof TamaguiStack>) {
  return <TamaguiStack {...props} />;
}
