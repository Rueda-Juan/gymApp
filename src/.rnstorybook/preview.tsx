import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TamaguiProvider } from 'tamagui';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, NavigationIndependentTree, DarkTheme } from '@react-navigation/native';
import type { Preview } from '@storybook/react-native';

import config from '../shared/ui/theme/tamagui.config';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => (
      <GestureHandlerRootView style={styles.container}>
        <SafeAreaProvider>
          <TamaguiProvider config={config} defaultTheme="dark">
            <NavigationIndependentTree>
              <NavigationContainer theme={DarkTheme}>
                <View style={styles.storyWrapper}>
                  <Story />
                </View>
              </NavigationContainer>
            </NavigationIndependentTree>
          </TamaguiProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    ),
  ],
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  storyWrapper: {
    flex: 1,
    padding: 16,
    backgroundColor: '#000', // Match app background if possible
  },
});

export default preview;
