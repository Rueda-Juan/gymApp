import React from 'react';
import { XStack } from 'tamagui';
import { AppText } from './AppText';
import { ThemeColorKey } from '@/theme/types';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'ghost';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
}

const BADGE_CONFIG: Record<BadgeVariant, { bg: string; color: ThemeColorKey }> = {
  primary: { bg: '$primarySubtle', color: 'primary' },
  success: { bg: '$successSubtle', color: 'success' },
  warning: { bg: '$warningSubtle', color: 'warning' },
  danger: { bg: '$dangerSubtle', color: 'danger' },
  ghost: { bg: '$surfaceSecondary', color: 'textSecondary' },
};

const SIZE_CONFIG: Record<BadgeSize, { px: number; py: number; fontSize: number; iconSize: number }> = {
  sm: { px: 8, py: 2, fontSize: 10, iconSize: 12 },
  md: { px: 12, py: 4, fontSize: 12, iconSize: 14 },
};

export function Badge({ label, variant = 'primary', size = 'sm', icon }: BadgeProps) {
  const colors = BADGE_CONFIG[variant];
  const spacing = SIZE_CONFIG[size];

  const styledIcon = React.isValidElement(icon)
    ? React.cloneElement(icon as React.ReactElement<any>, {
        size: spacing.iconSize,
        color: `$${colors.color}`,
      })
    : icon;

  return (
    <XStack
      alignItems="center"
      justifyContent="center"
      borderRadius="$sm"
      borderCurve="continuous"
      backgroundColor={colors.bg}
      paddingHorizontal={spacing.px}
      paddingVertical={spacing.py}
      alignSelf="flex-start"
      gap={4}
      maxWidth="100%"
    >
      {styledIcon}
      <AppText
        variant="label"
        color={colors.color}
        fontSize={spacing.fontSize}
        numberOfLines={1}
        ellipsizeMode="tail"
        flexShrink={1}
      >
        {label}
      </AppText>
    </XStack>
  );
}