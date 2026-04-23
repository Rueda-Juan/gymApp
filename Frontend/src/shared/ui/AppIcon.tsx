import React from 'react';
import { useTheme } from 'tamagui';
import { LucideIcon } from 'lucide-react-native';
import { ThemeColorKey } from '../config/types';

type AppIconVariant = 'mono' | 'duotone';

const SUBTLE_FILL: Partial<Record<ThemeColorKey, ThemeColorKey>> = {
  primary: 'primarySubtle',
  danger: 'dangerSubtle',
  warning: 'warningSubtle',
  success: 'successSubtle',
  gold: 'goldSubtle',
  info: 'infoSubtle',
};

interface AppIconProps {
  icon: LucideIcon;
  size?: number;
  color?: ThemeColorKey | string;
  strokeWidth?: number;
  fill?: ThemeColorKey | 'none' | string;
  variant?: AppIconVariant;
}

function resolveThemeColor(key: string, theme: Record<string, { val?: string } | undefined>): string | undefined {
  return (key in theme) ? theme[key]?.val : undefined;
}

export function AppIcon({
  icon: Icon,
  size = 24,
  color = 'color',
  strokeWidth = 2,
  fill,
  variant = 'duotone',
}: AppIconProps) {
  const theme = useTheme();

  const resolvedColor = theme[color]?.val ?? theme.color?.val;

  let resolvedFill: string;
  if (fill !== undefined) {
    resolvedFill = fill === 'none' ? 'none' : (resolveThemeColor(fill, theme) ?? fill);
  } else if (variant === 'duotone') {
    const subtleKey = SUBTLE_FILL[color as ThemeColorKey] ?? 'primarySubtle';
    resolvedFill = theme[subtleKey]?.val ?? 'none';
  } else {
    resolvedFill = 'none';
  }

  return (
    <Icon
      size={size}
      color={resolvedColor}
      strokeWidth={strokeWidth}
      fill={resolvedFill}
    />
  );
}
