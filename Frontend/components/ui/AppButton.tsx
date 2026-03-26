import React from 'react';
import { Button as TamaguiButton, ButtonProps, XStack } from 'tamagui';
import { AppText } from './AppText';

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface AppButtonProps extends ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  label?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  fullWidth?: boolean;
}

const BUTTON_CONFIG: Record<ButtonVariant, { bg: string; color: string; borderWidth: number; borderColor: string }> = {
  primary: { bg: '$primary', color: '$white', borderWidth: 0, borderColor: 'transparent' },
  outline: { bg: 'transparent', color: '$primary', borderWidth: 1, borderColor: '$borderColor' },
  ghost: { bg: '$surfaceSecondary', color: '$color', borderWidth: 0, borderColor: 'transparent' },
  danger: { bg: '$danger', color: '$white', borderWidth: 0, borderColor: 'transparent' },
};

const SIZE_CONFIG: Record<ButtonSize, { height: number; borderRadius: number; fontSize: number }> = {
  sm: { height: 36, borderRadius: 8, fontSize: 14 },
  md: { height: 44, borderRadius: 12, fontSize: 16 },
  lg: { height: 56, borderRadius: 16, fontSize: 18 },
};

export function AppButton({ variant = 'primary', size = 'lg', label, icon, children, fullWidth = true, ...props }: AppButtonProps) {
  const theme = useTheme();
  const styleToken = BUTTON_CONFIG[variant];
  const sizeToken = SIZE_CONFIG[size];

  return (
    <TamaguiButton
      {...props}
      height={sizeToken.height}
      borderRadius={sizeToken.borderRadius}
      borderWidth={styleToken.borderWidth}
      borderColor={styleToken.borderColor}
      backgroundColor={styleToken.bg}
      width={fullWidth ? '100%' : undefined}
      opacity={props.disabled ? 0.5 : 1}
    >
      <XStack alignItems="center" justifyContent="center" space="$sm">
        {icon}
        {label ? (
          <AppText variant="bodyMd" color={variant === 'ghost' ? 'color' : variant === 'outline' ? 'primary' : variant === 'danger' ? 'white' : 'white'} style={{ fontSize: sizeToken.fontSize, fontWeight: '700' }}>
            {label}
          </AppText>
        ) : (
          children
        )}
      </XStack>
    </TamaguiButton>
  );
}

interface IconButtonProps extends ButtonProps {
  icon: React.ReactNode;
  size?: number;
  backgroundColor?: string;
}

export function IconButton({ icon, size = 40, backgroundColor = '$surfaceSecondary', ...props }: IconButtonProps) {
  return (
    <TamaguiButton
      {...props}
      width={size}
      height={size}
      borderRadius={size / 2}
      backgroundColor={backgroundColor}
      p={0}
    >
      {icon}
    </TamaguiButton>
  );
}
