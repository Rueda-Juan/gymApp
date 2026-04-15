

import React from 'react';
import { Pressable, Text, StyleSheet, AccessibilityRole } from 'react-native';

const SecondaryButton = ({ title, onPress, accessibilityLabel }: { title: string; onPress: () => void; accessibilityLabel?: string }) => (
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
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
  } as const,
  text: {
    color: '#fff',
    fontWeight: 'bold' as const,
    textAlign: 'center' as const,
    fontSize: 16,
  },
  pressed: {
    opacity: 0.7,
  },
});

export default SecondaryButton;
