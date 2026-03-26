import { XStack, YStack } from 'tamagui';
import React, { useState } from 'react';
import { Pressable } from 'react-native';
import { AppText } from './AppText';
import { IconSymbol } from './icon-symbol';

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
}

export function Collapsible({ children, title }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <YStack>
      <Pressable onPress={() => setIsOpen((value) => !value)}>
        <XStack alignItems="center" gap="$xs">
          <IconSymbol
            name="chevron.right"
            size={18}
            weight="medium"
            color="$color"
            style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
          />
          <AppText variant="bodyMd">{title}</AppText>
        </XStack>
      </Pressable>
      {isOpen && (
        <YStack mt="$xs" ml="$4xl">
          {children}
        </YStack>
      )}
    </YStack>
  );
}
