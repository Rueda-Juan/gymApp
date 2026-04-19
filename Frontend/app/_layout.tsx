import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { TamaguiProvider } from '@tamagui/core';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <TamaguiProvider config={config} defaultTheme={tamaguiTheme}>
          <DIProvider>
            <BottomSheetModalProvider>
              <ThemeProvider value={effectiveScheme === 'dark' ? DarkTheme : DefaultTheme}>
                
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="(workouts)" />
                  <Stack.Screen name="exercise/[id]" />
                  <Stack.Screen name="exercise/create" />
                  <Stack.Screen name="history/[id]" />
                  <Stack.Screen name="routine/[id]" />
                  <Stack.Screen name="routine/create" />
                  <Stack.Screen name="settings/notifications" />
                  <Stack.Screen name="settings/privacy" />
                  <Stack.Screen name="settings/profile" />
                  <Stack.Screen name="stats/weight" />
                  <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
                </Stack>

                <TextureOverlay />
                <StatusBar style="auto" translucent />
                <Toast />

              </ThemeProvider>
            </BottomSheetModalProvider>
          </DIProvider>
        </TamaguiProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});