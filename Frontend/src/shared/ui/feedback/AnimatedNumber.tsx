import React, { useEffect, useRef } from 'react';
import { TextInput, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from 'tamagui';
import { motion } from '../theme/motion';
import { useMotion } from '../../lib/hooks/useMotion';
import { AppTextVariant } from '../../config/types';
import { ThemeColorKey } from '../../config/types';

const ANIMATED_NUMBER_DURATION = 600;
const PLACEHOLDER_TEXT = '--';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

// Variant styles mapping (simplified for this component)
const VARIANT_STYLES: Record<AppTextVariant, TextStyle> = {
  titleLg: { fontSize: 32, fontWeight: '700' },
  titleMd: { fontSize: 24, fontWeight: '700' },
  titleSm: { fontSize: 18, fontWeight: '600' },
  bodyLg: { fontSize: 16, fontWeight: '400' },
  bodyMd: { fontSize: 14, fontWeight: '400' },
  bodySm: { fontSize: 12, fontWeight: '400' },
  label: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase' },
  caption: { fontSize: 12, fontWeight: '400', color: '$textTertiary' },
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
        // @ts-ignore - internal easing helper
        easing: motion.easing?.decelerate || undefined,
      });
    }
    previousValue.current = targetValue;
  }, [value, duration, isReduced, animated]);

  const animatedProps = useAnimatedProps(() => {
    const rounded = Math.round(animated.value);
    const text = String(rounded);
    return { text, defaultValue: text } as any;
  });

  const resolvedColor = (theme[color as keyof typeof theme] as any)?.val ?? theme.color?.val;
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
