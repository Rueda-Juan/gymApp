import React from 'react';
import { YStack, YStackProps } from 'tamagui';
import { elevation } from '@/constants/elevation';

type CardVariant = 'default' | 'outlined' | 'ghost';

// $none kept for backwards compatibility with existing screens
type CardPadding = '$0' | '$none' | '$sm' | '$md' | '$lg';

interface CardProps extends Omit<YStackProps, 'padding'> {
  children: React.ReactNode;
  padding?: CardPadding;
  variant?: CardVariant;
}

const CARD_VARIANT_CONFIG: Record<CardVariant, {
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  elevationProps: object;
}> = {
  default:  { backgroundColor: '$surface', borderColor: 'transparent',  borderWidth: 0, elevationProps: elevation.card },
  outlined: { backgroundColor: '$surface', borderColor: '$borderColor', borderWidth: 1, elevationProps: elevation.flat },
  ghost:    { backgroundColor: 'transparent', borderColor: 'transparent', borderWidth: 0, elevationProps: elevation.flat },
};

export function CardBase({
  children,
  padding = '$md',
  variant = 'default',
  ...props
}: CardProps) {
  const { backgroundColor, borderColor, borderWidth, elevationProps } = CARD_VARIANT_CONFIG[variant];

  return (
    <YStack
      borderRadius="$lg"
      borderCurve="continuous"
      overflow="hidden"
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      borderWidth={borderWidth}
      padding={padding}
      {...elevationProps}
      {...props}
    >
      {children}
    </YStack>
  );
}