import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { TamaguiProvider } from '@tamagui/core';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';

import { useColorScheme } from '@/hooks/ui/use-color-scheme';
import { useSettings } from '@/store/useSettings';
import { DIProvider } from '../context/DIContext';
import config from '../tamagui.config';

import { TextureOverlay } from '@/components/ui/TextureOverlay';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const themeMode = useSettings((state) => state.themeMode);
  const effectiveScheme = themeMode === 'system' ? systemColorScheme : themeMode;
  const tamaguiTheme = effectiveScheme === 'dark' ? 'dark' : 'light';

  return (
    <TamaguiProvider config={config} defaultTheme={tamaguiTheme}>
      <GestureHandlerRootView style={styles.flex}>
        <DIProvider>
          <BottomSheetModalProvider>
            <ThemeProvider value={effectiveScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(workouts)" options={{ headerShown: false }} />
                <Stack.Screen name="exercise/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="exercise/create" options={{ headerShown: false }} />
                <Stack.Screen name="history/[id]" options={{ headerShown: false }} />
                <Stack.Screen name="routine/[id]" options={{ headerShown: false }} />
                <Stack.Screen name="routine/create" options={{ headerShown: false }} />
                <Stack.Screen name="settings/notifications" options={{ headerShown: false }} />
                <Stack.Screen name="settings/privacy" options={{ headerShown: false }} />
                <Stack.Screen name="settings/profile" options={{ headerShown: false }} />
                <Stack.Screen name="stats/weight" options={{ headerShown: false }} />
                <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
              </Stack>
              <TextureOverlay />
              <StatusBar style="auto" />
              <Toast />
            </ThemeProvider>
          </BottomSheetModalProvider>
        </DIProvider>
      </GestureHandlerRootView>
    </TamaguiProvider>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
