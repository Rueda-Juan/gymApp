import { XStack, Text } from 'tamagui';
import React from 'react';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'ghost';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
}

const BADGE_CONFIG: Record<BadgeVariant, { bg: string; color: string }> = {
  primary: { bg: '$primarySubtle', color: '$primary' },
  success: { bg: '$successSubtle', color: '$success' },
  warning: { bg: '$warningSubtle', color: '$warning' },
  danger: { bg: '$dangerSubtle', color: '$danger' },
  ghost: { bg: '$surfaceSecondary', color: '$textSecondary' },
};

const SIZE_CONFIG: Record<BadgeSize, { px: number; py: number; fontSize: number }> = {
  sm: { px: 8, py: 2, fontSize: 10 },
  md: { px: 12, py: 4, fontSize: 12 },
};

export function Badge({ label, variant = 'primary', size = 'sm', icon }: BadgeProps) {
  const colors = BADGE_CONFIG[variant];
  const spacing = SIZE_CONFIG[size];

  return (
    <XStack alignItems="center" justifyContent="center" borderRadius="$sm" backgroundColor={colors.bg} px={spacing.px} py={spacing.py} alignSelf="flex-start" gap={4}>
      {icon && <XStack>{icon}</XStack>}
      <Text fontWeight="700" textTransform="uppercase" letterSpacing={0.5} color={colors.color} fontSize={spacing.fontSize}>
        {label}
      </Text>
    </XStack>
  );
}
