import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { TamaguiProvider } from 'tamagui';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';

import { useColorScheme } from '@/shared/lib/hooks/use-color-scheme';
import { useSettings } from '@/entities/settings';
import { DIProvider } from '@/shared/context/DIContext'; // WE WILL MOVE CONTEXT SOON
import config from '@/shared/ui/theme/tamagui.config';

import { TextureOverlay } from '@/shared/ui/decor/TextureOverlay';
import { Screen } from '@/shared/ui/Screen';
import { MotionProvider } from '@/shared/ui/context/MotionContext';


export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function GlobalLayout() {
  const systemColorScheme = useColorScheme();
  const themeMode = useSettings((state) => state.themeMode);
  const motionPreference = useSettings((state) => state.motionPreference);
  const effectiveScheme = themeMode === 'system' ? systemColorScheme : themeMode;
  const tamaguiTheme = effectiveScheme === 'dark' ? 'dark' : 'light';


  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <TamaguiProvider config={config} defaultTheme={tamaguiTheme}>
          <DIProvider>
            <BottomSheetModalProvider>
              <MotionProvider preference={motionPreference}>
                <ThemeProvider value={effectiveScheme === 'dark' ? DarkTheme : DefaultTheme}>
                  
                  <Screen safeAreaEdges={['top', 'left', 'right', 'bottom']}>
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
                  </Screen>
  
                  <TextureOverlay />
                  <StatusBar style="auto" translucent />
                  <Toast />
  
                </ThemeProvider>
              </MotionProvider>

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
