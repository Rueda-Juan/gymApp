
import React from 'react';
import { View, StyleSheet, AccessibilityRole } from 'react-native';

const ScreenContainer: React.FC<{ children: React.ReactNode; accessibilityLabel?: string }> = ({ children, accessibilityLabel }) => (
  <View
    style={styles.container}
    accessibilityRole={"main" as AccessibilityRole}
    accessible={true}
    accessibilityLabel={accessibilityLabel || 'Pantalla principal'}
  >
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    minHeight: 1, // Layout estable
  },
});

export default ScreenContainer;
