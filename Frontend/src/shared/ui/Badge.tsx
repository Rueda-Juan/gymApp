import React from 'react';
import { XStack } from 'tamagui';
import { AppText } from './AppText';
import { ThemeColorKey } from '../config/types';
import { FONT_SCALE } from './theme/tamagui.config';

const BADGE_ICON_GAP = 4;

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
  sm: { px: 8, py: 4, fontSize: FONT_SCALE.sizes[1], iconSize: 12 },
  md: { px: 12, py: 4, fontSize: FONT_SCALE.sizes[2], iconSize: 14 },
};

export function Badge({ label, variant = 'primary', size = 'sm', icon }: BadgeProps) {
  const colors = BADGE_CONFIG[variant];
  const spacing = SIZE_CONFIG[size];

  const styledIcon = React.isValidElement<{ size?: number; color?: string }>(icon)
    ? React.cloneElement(icon, {
        size: spacing.iconSize,
        color: colors.color,
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
      gap={BADGE_ICON_GAP}
      maxWidth="100%"
      accessibilityRole="text"
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
