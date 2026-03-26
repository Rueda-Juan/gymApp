import { YStack, YStackProps } from 'tamagui';
import React from 'react';

type CardVariant = 'default' | 'outlined' | 'ghost';

type CardPadding = 'none' | 'sm' | 'md' | 'lg';

const PADDING_MAP: Record<CardPadding, number> = {
  none: 0,
  sm: 8,
  md: 16,
  lg: 24,
};

interface CardProps extends Omit<YStackProps, 'padding' | 'variant'> {
  children: React.ReactNode;
  padding?: CardPadding;
  variant?: CardVariant;
}

export function CardBase({ children, padding = 'md', variant = 'default', ...props }: CardProps) {
  const isGhost = variant === 'ghost';

  return (
    <YStack
      borderRadius="$lg"
      overflow="hidden"
      backgroundColor={isGhost ? 'transparent' : '$surface'}
      borderColor={isGhost ? 'transparent' : '$borderColor'}
      borderWidth={isGhost ? 0 : 1}
      padding={PADDING_MAP[padding]}
      {...props}
    >
      {children}
    </YStack>
  );
}
