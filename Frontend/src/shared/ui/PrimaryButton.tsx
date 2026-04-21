

import React from 'react';
import { Pressable, Text, StyleSheet, AccessibilityRole } from 'react-native';
import { primitives } from '../../app/design/tokens/primitives';
import { componentTokens } from '../../app/design/tokens/components';

const PrimaryButton = ({ title, onPress, accessibilityLabel }: { title: string; onPress: () => void; accessibilityLabel?: string }) => (
  <Pressable
    style={({ pressed }) => [
      styles.button,
      pressed && styles.pressed,
    ]}
    onPress={onPress}
    accessibilityRole={"button" as AccessibilityRole}
    accessibilityLabel={accessibilityLabel || title}
    accessible={true}
    focusable={true}
  >
    <Text style={styles.text}>{title}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: primitives.primary,
    borderRadius: componentTokens.button.borderRadius,
    paddingVertical: componentTokens.button.padding / 2,
    paddingHorizontal: componentTokens.button.padding,
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
  } as const,
  text: {
    color: primitives.surface,
    fontWeight: componentTokens.button.fontWeight as 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | undefined,
    textAlign: 'center' as const,
    fontSize: 16,
  },
  pressed: {
    opacity: 0.7,
  },
});

export default PrimaryButton;
