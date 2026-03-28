import React from 'react';
import { Button as TamaguiButton, ButtonProps, XStack, useTheme } from 'tamagui';
import { AppText } from './AppText';
import { ActivityIndicator, GestureResponderEvent } from 'react-native';
import { ThemeColorKey } from '@/theme/types';
import * as Haptics from 'expo-haptics';

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface AppButtonProps extends Omit<ButtonProps, 'variant' | 'icon'> {
  appVariant?: ButtonVariant;
  size?: ButtonSize;
  label?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
}

const BUTTON_CONFIG: Record<ButtonVariant, { bg: string; textColor: ThemeColorKey; borderWidth: number; borderColor: string }> = {
  primary: { bg: '$primary', textColor: 'color', borderWidth: 0, borderColor: 'transparent' },
  outline: { bg: 'transparent', textColor: 'primary', borderWidth: 1, borderColor: '$borderColor' },
  ghost: { bg: '$surfaceSecondary', textColor: 'color', borderWidth: 0, borderColor: 'transparent' },
  danger: { bg: '$danger', textColor: 'color', borderWidth: 0, borderColor: 'transparent' },
};

const SIZE_CONFIG: Record<ButtonSize, { height: number; borderRadius: number; fontSize: number }> = {
  sm: { height: 36, borderRadius: 8, fontSize: 14 },
  md: { height: 44, borderRadius: 12, fontSize: 16 },
  lg: { height: 56, borderRadius: 16, fontSize: 18 },
};

export function AppButton({ appVariant = 'primary', size = 'lg', label, icon, children, fullWidth = true, loading = false,
  disabled, ...props }: AppButtonProps) {
  const styleToken = BUTTON_CONFIG[appVariant];
  const sizeToken = SIZE_CONFIG[size];
  const isDisabled = disabled || loading;
  const theme = useTheme();
  const spinnerColor = theme[styleToken.textColor]?.val ?? theme.color?.val;
  const leftElement = loading
    ? <ActivityIndicator size="small" color={spinnerColor} />
    : icon;
  const handlePress = async (e: GestureResponderEvent) => {
    if (!isDisabled) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      props.onPress?.(e);
    }
  };

  return (
    <TamaguiButton
      disabled={isDisabled}
      pointerEvents={isDisabled ? 'none' : 'auto'}
      onPress={handlePress}
      height={sizeToken.height}
      borderRadius={sizeToken.borderRadius}
      borderWidth={styleToken.borderWidth}
      borderColor={styleToken.borderColor}
      backgroundColor={styleToken.bg}
      width={fullWidth ? '100%' : undefined}
      opacity={isDisabled ? 0.6 : 1}
      {...props}
    >
      <XStack alignItems="center" justifyContent="center" gap="$sm">
        {leftElement && (
          <XStack minWidth={20} alignItems="center" justifyContent="center">
            {leftElement}
          </XStack>
        )}
        {label ? (
          <AppText variant="bodyMd"
            color={styleToken.textColor}
            style={{ fontSize: sizeToken.fontSize, fontWeight: '$7' }}>
            {label}
          </AppText>
        ) : (
          loading ? null : children
        )}
      </XStack>
    </TamaguiButton>
  );
}

interface IconButtonProps extends Omit<ButtonProps, 'icon'> {
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
      padding={0}
    >
      {icon}
    </TamaguiButton>
  );
}
