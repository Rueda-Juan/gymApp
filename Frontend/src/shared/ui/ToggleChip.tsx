import React from 'react';
import { Pressable } from 'react-native';
import { YStack } from 'tamagui';
import { AppText } from './AppText';
import { ThemeColorKey } from '../types/ui';

type ChipVariant = 'subtle' | 'solid' | 'secondary';

export interface ToggleChipProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
  variant?: ChipVariant;
  disabled?: boolean;
}

const CHIP_STYLES = {
  subtle: {
    activeBg: '$primarySubtle',
    activeBorder: '$primary',
    inactiveBg: '$surfaceSecondary',
    borderRadius: '$full',
  },
  solid: {
    activeBg: '$primary',
    activeBorder: '$primary',
    inactiveBg: '$surfaceSecondary',
    borderRadius: '$full',
  },
  secondary: {
    activeBg: '$secondary',
    activeBorder: '$secondary',
    inactiveBg: 'transparent',
    borderRadius: '$sm',
  },
} as const;

export function ToggleChip({ label, isActive, onPress, accessibilityLabel, variant = 'subtle', disabled }: ToggleChipProps) {
  const styles = CHIP_STYLES[variant];
  const activeTextColor: ThemeColorKey = variant === 'subtle' ? 'primary' : 'background';
  const inactiveTextColor: ThemeColorKey = variant === 'solid' ? 'color' : 'textSecondary';
  const inactiveFontWeight = variant === 'secondary' ? '600' : '500';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected: isActive, disabled: !!disabled }}
      disabled={disabled}
      style={({ pressed }) => [{ opacity: disabled ? 0.5 : 1 }]}
    >
      <YStack
        alignItems="center"
        justifyContent="center"
        paddingHorizontal="$md"
        paddingVertical="$xs"
        borderRadius={styles.borderRadius}
        borderWidth={1}
        borderColor={isActive ? styles.activeBorder : '$borderColor'}
        backgroundColor={isActive ? styles.activeBg : styles.inactiveBg}
      >
        <AppText
          variant="bodyMd"
          fontWeight={isActive ? '700' : inactiveFontWeight}
          color={isActive ? activeTextColor : inactiveTextColor}
        >
          {label}
        </AppText>
      </YStack>
    </Pressable>
  );
}
