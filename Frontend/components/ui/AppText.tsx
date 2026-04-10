import React from 'react';
import { Text as TamaguiText, TextProps as TamaguiTextProps } from 'tamagui';
import { ThemeColorKey } from '@/theme/types';
import { FONT_SCALE } from '@/tamagui.config';

export type AppTextVariant = 'titleLg' | 'titleMd' | 'titleSm' | 'subtitle' | 'bodyLg' | 'bodyMd' | 'bodySm' | 'label';

interface AppTextProps extends Omit<TamaguiTextProps, 'color'> {
  variant?: AppTextVariant;
  color?: ThemeColorKey;
  tabularNums?: boolean;
}

const variantMapping: Record<AppTextVariant, {
  fontSize: number;
  fontWeight: '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  letterSpacing?: number;
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
}> = {
  titleLg: { fontSize: FONT_SCALE.sizes[7], fontWeight: FONT_SCALE.weights.bold,    letterSpacing: -0.5 },
  titleMd: { fontSize: FONT_SCALE.sizes[6], fontWeight: FONT_SCALE.weights.bold,    letterSpacing: -0.5 },
  titleSm: { fontSize: FONT_SCALE.sizes[5], fontWeight: FONT_SCALE.weights.bold },
  subtitle: { fontSize: FONT_SCALE.sizes[4], fontWeight: FONT_SCALE.weights.bold },
  bodyLg:  { fontSize: FONT_SCALE.sizes[4], fontWeight: FONT_SCALE.weights.medium },
  bodyMd:  { fontSize: FONT_SCALE.sizes[3], fontWeight: FONT_SCALE.weights.regular },
  bodySm:  { fontSize: FONT_SCALE.sizes[2], fontWeight: FONT_SCALE.weights.regular },
  label:   { fontSize: FONT_SCALE.sizes[1], fontWeight: FONT_SCALE.weights.bold, letterSpacing: 0.5 },
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