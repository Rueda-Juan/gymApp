import React from 'react';
import { Text as TamaguiText, TextProps as TamaguiTextProps } from 'tamagui';
import { ThemeColorKey } from '@/theme/types';

type TextVariant = 'titleLg' | 'titleMd' | 'titleSm' | 'subtitle' | 'bodyLg' | 'bodyMd' | 'bodySm' | 'label';

interface AppTextProps extends Omit<TamaguiTextProps, 'color'> {
  variant?: TextVariant;
  color?: ThemeColorKey;
  tabularNums?: boolean;
}

const variantMapping: Record<TextVariant, {
  fontSize: string;
  fontWeight: string;
  letterSpacing?: number;
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
}> = {
  titleLg: { fontSize: '$7', fontWeight: '$7', letterSpacing: -0.5 },
  titleMd: { fontSize: '$6', fontWeight: '$7', letterSpacing: -0.5 },
  titleSm: { fontSize: '$5', fontWeight: '$7' },
  subtitle: { fontSize: '$4', fontWeight: '$7' },
  bodyLg: { fontSize: '$4', fontWeight: '$5' },
  bodyMd: { fontSize: '$3', fontWeight: '$4' },
  bodySm: { fontSize: '$2', fontWeight: '$4' },
  label: { fontSize: '$1', fontWeight: '$7', letterSpacing: 0.5, textTransform: 'uppercase' },
};

export function AppText({
  variant = 'bodyMd',
  color = 'color',
  tabularNums = false,
  style,
  ...props
}: AppTextProps) {
  const resolved = variantMapping[variant];

  return (
    <TamaguiText
      color={`$${color}`}
      fontSize={resolved.fontSize}
      fontWeight={resolved.fontWeight}
      letterSpacing={resolved.letterSpacing}
      textTransform={resolved.textTransform}
      style={[
        tabularNums && { fontVariant: ['tabular-nums'] },
        style,
      ]}
      {...props}
    />
  );
}