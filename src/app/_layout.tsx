import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { TamaguiProvider } from 'tamagui';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { StyleSheet, LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';

import { useColorScheme } from '@/shared/lib/hooks/use-color-scheme';
import { useSettings } from '@/entities/settings';
import { DbProvider } from '@/db/DbProvider';
import config from '@/shared/ui/theme/tamagui.config';

import { TextureOverlay } from '@/shared/ui/decor/TextureOverlay';
import { MotionProvider } from '@/shared/ui/context/MotionContext';

import StorybookUIRoot from '../.rnstorybook';
import { useEffect } from "react";

const SHOW_STORYBOOK = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function GlobalLayout() {
  useEffect(() => {
    if (__DEV__) {
      LogBox.ignoreAllLogs();
    }
  }, []);

  if (SHOW_STORYBOOK) {
    return <StorybookUIRoot />;
  }

  const systemColorScheme = useColorScheme();
  const themeMode = useSettings((state) => state.themeMode);
  const motionPreference = useSettings((state) => state.motionPreference);
  const effectiveScheme = themeMode === 'system' ? systemColorScheme : themeMode;
  const tamaguiTheme = effectiveScheme === 'dark' ? 'dark' : 'light';

  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <TamaguiProvider config={config} defaultTheme={tamaguiTheme}>
          <DbProvider>
            <BottomSheetModalProvider>
              <MotionProvider preference={motionPreference}>
                <ThemeProvider value={effectiveScheme === 'dark' ? DarkTheme : DefaultTheme}>
                  
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="(workouts)" />
                    <Stack.Screen name="exercise/create" />
                    <Stack.Screen name="routine/create" />
                    <Stack.Screen name="routine/[id]" />
                    <Stack.Screen name="history/index" />
                    <Stack.Screen name="stats/weight" />
                    <Stack.Screen name="summary/index" />
                  </Stack>
  
                  <TextureOverlay />
                  <StatusBar style="auto" translucent />
                  <Toast />
  
                </ThemeProvider>
              </MotionProvider>

            </BottomSheetModalProvider>
          </DbProvider>
        </TamaguiProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});

