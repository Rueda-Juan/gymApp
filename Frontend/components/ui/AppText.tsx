import { Text as TamaguiText, TextProps as TamaguiTextProps, useTheme } from 'tamagui';
import React from 'react';

type TextVariant = 'titleLg' | 'titleMd' | 'titleSm' | 'bodyLg' | 'bodyMd' | 'bodySm' | 'label' | 'subtitle';

type ThemeColorKey =
  | 'color'
  | 'textSecondary'
  | 'textTertiary'
  | 'primary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'gold'
  | 'error';

interface AppTextProps extends TamaguiTextProps {
  variant?: TextVariant;
  color?: ThemeColorKey;
  tabularNums?: boolean;
  children: React.ReactNode;
}

const variantMapping: Record<TextVariant, { fontSize: number; fontWeight: number; letterSpacing?: number; textTransform?: 'uppercase' }> = {
  titleLg: { fontSize: 32, fontWeight: 700, letterSpacing: -0.5 },
  titleMd: { fontSize: 24, fontWeight: 700, letterSpacing: -0.5 },
  titleSm: { fontSize: 18, fontWeight: 700 },
  subtitle: { fontSize: 16, fontWeight: 700 },
  bodyLg: { fontSize: 16, fontWeight: 500 },
  bodyMd: { fontSize: 14, fontWeight: 400 },
  bodySm: { fontSize: 12, fontWeight: 400 },
  label: { fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' },
};

export function AppText({ variant = 'bodyMd', color = 'color', tabularNums, ...props }: AppTextProps) {
  const theme = useTheme();
  const resolved = variantMapping[variant];

  return (
    <TamaguiText
      color={theme[color] ?? theme.color}
      fontSize={resolved.fontSize}
      fontWeight={resolved.fontWeight}
      letterSpacing={resolved.letterSpacing}
      textTransform={resolved.textTransform}
      fontVariant={tabularNums ? ['tabular-nums'] : undefined}
      {...props}
    />
  );
}
