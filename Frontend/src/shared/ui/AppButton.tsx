import React, { useCallback, useEffect } from 'react';
import { Button as TamaguiButton, ButtonProps, XStack, useTheme } from 'tamagui';
import { AppText } from './AppText';
import { ActivityIndicator, GestureResponderEvent } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { FONT_SCALE } from '@/tamagui.config';
import { triggerLightHaptic } from '@/utils/haptics';
import { usePressScale } from '@/ui/hooks/usePressScale';

const BUTTON_CONFIG = {
  primary: {
    bg: '$color.primary',
    textColor: '$color.onPrimary',
    borderWidth: 0,
    borderColor: 'transparent',
  },
  ghost: {
    bg: 'transparent',
    textColor: '$color.primary',
    borderWidth: 1,
    borderColor: '$color.primary',
  },
};

const SIZE_CONFIG = {
  lg: { height: 56, borderRadius: 16, fontSize: FONT_SCALE.sizes[4] },
  sm: { height: 36, borderRadius: 8, fontSize: FONT_SCALE.sizes[2] },
};

export function AppButton({
  appVariant = 'primary',
  size = 'lg',
  label,
  icon,
  iconRight,
  children,
  fullWidth = true,
  loading = false,
  thermalBreathing = false,
  disabled,
  onPress,
  flex,
  ...rest
}: ButtonProps & {
  appVariant?: keyof typeof BUTTON_CONFIG;
  size?: keyof typeof SIZE_CONFIG;
  label?: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  children?: React.ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  thermalBreathing?: boolean;
  flex?: number;
}) {
  const isDisabled = disabled || loading;
  const theme = useTheme();
  const { handlePressIn, handlePressOut, animatedScale } = usePressScale(isDisabled);
  const breathingOpacity = useSharedValue(1);
  const styleToken = BUTTON_CONFIG[appVariant];
  const sizeToken = SIZE_CONFIG[size];
  const spinnerColor = theme[styleToken.textColor]?.val ?? theme.color?.val;
  const leftElement = loading
    ? <ActivityIndicator size="small" color={spinnerColor} />
    : icon;

  const handlePress = useCallback((e: GestureResponderEvent) => {
    if (!isDisabled) {
      triggerLightHaptic();
      onPress?.(e);
    }
  }, [isDisabled, onPress]);

  useEffect(() => {
    if (thermalBreathing && !isDisabled) {
      breathingOpacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 1500 }),
          withTiming(1, { duration: 1500 })
        ),
        -1,
        true
      );
    } else {
      breathingOpacity.value = 1;
    }
  }, [thermalBreathing, isDisabled, breathingOpacity]);

  const breathingStyle = useAnimatedStyle(() => ({
    opacity: thermalBreathing && !isDisabled ? breathingOpacity.value : 1
  }));

  // testID para testing robusto
  const testID = rest.testID || 'AppButton';

  const outerStyle = [
    fullWidth ? { width: '100%' } : undefined,
    animatedScale,
    breathingStyle,
    flex ? { flex: flex as any } : undefined,
  ];

  return (
    <Animated.View style={outerStyle}>
      <TamaguiButton
        disabled={isDisabled}
        pointerEvents={isDisabled ? 'none' : 'auto'}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        height={sizeToken.height}
        borderRadius={sizeToken.borderRadius}
        borderWidth={styleToken.borderWidth}
        borderColor={styleToken.borderColor}
        backgroundColor={styleToken.bg}
        width={fullWidth ? '100%' : undefined}
        flex={flex}
        opacity={isDisabled ? 0.6 : 1}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: isDisabled }}
        testID={testID}
        {...rest}
      >
        <XStack alignItems="center" justifyContent="center" gap="$sm" flex={1} minWidth={0}>
          {leftElement && (
            <XStack minWidth={20} alignItems="center" justifyContent="center">
              {leftElement}
            </XStack>
          )}
          {label ? (
            <AppText
              variant="bodyMd"
              // Mejorar tipado: AppText debe aceptar string | ThemeColorKey
              color={styleToken.textColor as any}
              style={{ fontSize: sizeToken.fontSize, fontWeight: '700' }}
              numberOfLines={1}
              ellipsizeMode="tail"
              testID="AppButtonLabel"
            >
              {label}
            </AppText>
          ) : (
            loading ? null : children
          )}
          {iconRight && !loading && (
            <XStack minWidth={20} alignItems="center" justifyContent="center">
              {iconRight}
            </XStack>
          )}
        </XStack>
      </TamaguiButton>
    </Animated.View>
  );
}

type IconButtonProps = Omit<ButtonProps, 'icon'> & {
  icon: React.ReactNode;
  size?: number;
  backgroundColor?: string;
  accessibilityLabel: string;
  disabled?: boolean;
};

export function IconButton({
  icon,
  size = 40,
  backgroundColor = '$surfaceSecondary',
  accessibilityLabel,
  disabled,
  ...props
}: IconButtonProps) {
  const { handlePressIn, handlePressOut, animatedScale } = usePressScale(!!disabled);

  return (
    <Animated.View style={animatedScale}>
      <TamaguiButton
        {...props}
        disabled={disabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        width={size}
        height={size}
        borderRadius={typeof size === 'number' ? size / 2 : 20}
        backgroundColor={backgroundColor}
        padding={0}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      >
        {icon}
      </TamaguiButton>
    </Animated.View>
  );
}

