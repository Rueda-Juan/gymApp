import React, { useEffect, useRef } from 'react';
import { TextInput, TextStyle } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedProps } from 'react-native-reanimated';
import { motion } from '@/constants/motion';
import { useMotion } from '@/hooks/ui/useMotion';
import { useTheme } from 'tamagui';
import { ThemeColorKey } from '@/theme/types';
import { FONT_SCALE } from '@/tamagui.config';
import { AppTextVariant } from '@/components/ui/AppText';

const ANIMATED_NUMBER_DURATION = 500;
const PLACEHOLDER_TEXT = '—';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const VARIANT_STYLES: Record<AppTextVariant, TextStyle> = {
  titleLg: { fontSize: FONT_SCALE.sizes[7], fontWeight: FONT_SCALE.weights.bold,    lineHeight: FONT_SCALE.sizes[7] * 1.2, letterSpacing: -0.5 },
  titleMd: { fontSize: FONT_SCALE.sizes[6], fontWeight: FONT_SCALE.weights.bold,    lineHeight: FONT_SCALE.sizes[6] * 1.2, letterSpacing: -0.5 },
  titleSm: { fontSize: FONT_SCALE.sizes[5], fontWeight: FONT_SCALE.weights.bold,    lineHeight: FONT_SCALE.sizes[5] * 1.2 },
  subtitle: { fontSize: FONT_SCALE.sizes[4], fontWeight: FONT_SCALE.weights.bold,   lineHeight: FONT_SCALE.sizes[4] * 1.3 },
  bodyLg:  { fontSize: FONT_SCALE.sizes[4], fontWeight: FONT_SCALE.weights.medium,  lineHeight: FONT_SCALE.sizes[4] * 1.4 },
  bodyMd:  { fontSize: FONT_SCALE.sizes[3], fontWeight: FONT_SCALE.weights.regular, lineHeight: FONT_SCALE.sizes[3] * 1.4 },
  bodySm:  { fontSize: FONT_SCALE.sizes[2], fontWeight: FONT_SCALE.weights.regular, lineHeight: FONT_SCALE.sizes[2] * 1.4 },
  label:   { fontSize: FONT_SCALE.sizes[1], fontWeight: FONT_SCALE.weights.bold,    letterSpacing: 0.5, textTransform: 'uppercase' },
};

interface AnimatedNumberProps {
  value: number | null | undefined;
  duration?: number;
  formatter?: (n: number) => string;
  style?: TextStyle;
  variant?: AppTextVariant;
  color?: ThemeColorKey;
}

export function AnimatedNumber({
  value,
  duration = ANIMATED_NUMBER_DURATION,
  formatter = defaultFormatter,
  style,
  variant = 'titleMd',
  color = 'color',
}: AnimatedNumberProps) {
  const { isReduced } = useMotion();
  const theme = useTheme();
  const previousValue = useRef(0);
  const animated = useSharedValue(value ?? 0);

  const formatterRef = useRef(formatter);
  formatterRef.current = formatter;

  useEffect(() => {
    const targetValue = value ?? 0;
    const hasNoDelta = targetValue === previousValue.current;

    if (isReduced || hasNoDelta) {
      animated.value = targetValue;
    } else {
      animated.value = withTiming(targetValue, {
        duration,
        easing: motion.easing.decelerate,
      });
    }
    previousValue.current = targetValue;
  }, [value, duration, isReduced, animated]);

  const animatedProps = useAnimatedProps(() => {
    'worklet';
    const rounded = Math.round(animated.value);
    const text = String(rounded);
    return { text, defaultValue: text };
  });

  const resolvedColor = theme[color]?.val ?? theme.color?.val;
  const variantStyle = VARIANT_STYLES[variant];

  if (value == null) {
    return (
      <TextInput
        editable={false}
        value={PLACEHOLDER_TEXT}
        style={[variantStyle, { color: resolvedColor, padding: 0 }, style]}
      />
    );
  }

  return (
    <AnimatedTextInput
      editable={false}
      underlineColorAndroid="transparent"
      animatedProps={animatedProps}
      defaultValue={formatterRef.current(value ?? 0)}
      style={[variantStyle, { color: resolvedColor, padding: 0, fontVariant: ['tabular-nums'] }, style]}
    />
  );
}

function defaultFormatter(n: number): string {
  return n.toLocaleString('es-ES');
}
