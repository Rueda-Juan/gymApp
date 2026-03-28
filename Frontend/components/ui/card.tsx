// CardBase.tsx
import React from 'react';
import { YStack, YStackProps } from 'tamagui';

type CardVariant = 'default' | 'outlined' | 'ghost';
// Agregado $none para compatibilidad con las pantallas armadas
type CardPadding = '$0' | '$none' | '$sm' | '$md' | '$lg';

interface CardProps extends Omit<YStackProps, 'padding'> {
  children: React.ReactNode;
  padding?: CardPadding;
  variant?: CardVariant;
}

export function CardBase({
  children,
  padding = '$md',
  variant = 'default',
  ...props
}: CardProps) {
  const isDefault = variant === 'default';
  const isOutlined = variant === 'outlined';
  const isGhost = variant === 'ghost';

  return (
    <YStack
      borderRadius="$lg"
      borderCurve="continuous"
      overflow="hidden"
      backgroundColor={isGhost ? 'transparent' : '$surface'}
      borderColor={isOutlined ? '$borderColor' : 'transparent'}
      borderWidth={isOutlined ? 1 : 0}
      padding={padding}
      shadowColor={isDefault ? '$overlay' : 'transparent'}
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={isDefault ? 0.05 : 0}
      shadowRadius={8}
      {...props}
    >
      {children}
    </YStack>
  );
}