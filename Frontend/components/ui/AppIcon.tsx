import React from 'react';
import { useTheme } from 'tamagui';
import { LucideIcon } from 'lucide-react-native';
import { ThemeColorKey } from '@/theme/types';

interface AppIconProps {
  icon: LucideIcon;
  size?: number;
  color?: ThemeColorKey;
  strokeWidth?: number;
  fill?: ThemeColorKey | 'none' | string;
}

export function AppIcon({
  icon: Icon,
  size = 24,
  color = 'color',
  strokeWidth = 2,
  fill = 'none',
}: AppIconProps) {
  const theme = useTheme();
  
  const resolvedColor = theme[color]?.val ?? theme.color?.val;
  // Resolvemos el fill por si le pasás un token de Tamagui o un color crudo
  const resolvedFill = theme[fill as ThemeColorKey]?.val ?? fill;

  return (
    <Icon 
      size={size} 
      color={resolvedColor} 
      strokeWidth={strokeWidth} 
      fill={resolvedFill} 
    />
  );
}