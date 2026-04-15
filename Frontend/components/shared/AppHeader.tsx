
import React from 'react';
import { View, Text, StyleSheet, AccessibilityRole } from 'react-native';
import { primitives } from '../../app/design/tokens/primitives';
import { componentTokens } from '../../app/design/tokens/components';

type AppHeaderProps = {
  title?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
};

const AppHeader = ({ title = 'App Header', children, actions }: AppHeaderProps) => (
  <View
    style={styles.header}
    accessibilityRole={"header" as AccessibilityRole}
    accessible={true}
    accessibilityLabel={title}
  >
    {actions && <View style={styles.actions}>{actions}</View>}
    <Text style={styles.text}>{title}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  header: {
    backgroundColor: primitives.surface, // surface para fondo
    paddingVertical: componentTokens.card.borderRadius,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 56,
    flexDirection: 'row',
  },
  text: {
    color: primitives.text, // text para color de texto
    fontWeight: 'bold',
    fontSize: 20,
    letterSpacing: 0.5,
    flex: 1,
    textAlign: 'center',
  },
  actions: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8,
    zIndex: 1,
  },
});

export default AppHeader;
