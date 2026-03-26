import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { TamaguiProvider } from '@tamagui/core';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { DIProvider } from '../context/DIContext';
import config from '../tamagui.config';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const tamaguiTheme = colorScheme === 'dark' ? 'dark' : 'light';

  return (
    <TamaguiProvider config={config} defaultTheme={tamaguiTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <DIProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
            <StatusBar style="auto" />
            <Toast />
          </ThemeProvider>
        </DIProvider>
      </GestureHandlerRootView>
    </TamaguiProvider>
  );
}
