import React, { useCallback } from 'react';
import { Pressable, ViewStyle } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { motion } from '@/constants/motion';
import { usePressScale } from '@/hooks/ui/usePressScale';
import { triggerLightHaptic } from '@/utils/haptics';
import { elevation } from '@/constants/elevation';

const PRESS_TRANSLATE_Y = 1;
const CARD_BORDER_RADIUS = 12;

interface PressableCardProps {
  onPress: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
  disabled?: boolean;
  accessibilityLabel?: string;
}

export function PressableCard({ onPress, children, style, disabled, accessibilityLabel }: PressableCardProps) {
  const { handlePressIn: scaleIn, handlePressOut: scaleOut, animatedScale } = usePressScale(disabled);
  const shadowOpacity = useSharedValue(elevation.card.shadowOpacity as number);
  const translateY = useSharedValue(0);

  const handlePressIn = useCallback(() => {
    scaleIn();
    shadowOpacity.value = withTiming(0, { duration: motion.duration.instant });
    translateY.value = withTiming(PRESS_TRANSLATE_Y, { duration: motion.duration.instant });
  }, [scaleIn, shadowOpacity, translateY]);

  const handlePressOut = useCallback(() => {
    scaleOut();
    shadowOpacity.value = withTiming(elevation.card.shadowOpacity, { duration: motion.duration.fast });
    translateY.value = withTiming(0, { duration: motion.duration.fast });
  }, [scaleOut, shadowOpacity, translateY]);

  const shadowAndTranslateStyle = useAnimatedStyle(() => ({
    shadowOpacity: shadowOpacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const handlePress = useCallback(() => {
    if (disabled) return;
    triggerLightHaptic();
    onPress();
  }, [disabled, onPress]);

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
    >
      <Animated.View
        style={[
          {
            borderRadius: CARD_BORDER_RADIUS,
            borderCurve: 'continuous',
            shadowColor: elevation.card.shadowColor,
            shadowRadius: elevation.card.shadowRadius,
            shadowOffset: elevation.card.shadowOffset,
            shadowOpacity: elevation.card.shadowOpacity,
          },
          style,
          animatedScale,
          shadowAndTranslateStyle,
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}
