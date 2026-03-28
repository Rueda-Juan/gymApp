import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';
import { useTheme } from 'tamagui';
import { BlurView } from 'expo-blur';
import { Home, ClipboardList, History, BarChart3, Settings } from 'lucide-react-native';
import { HapticTab } from '@/components/haptic-tab';
import { MiniPlayer } from '@/components/ui/mini-player';

export default function TabLayout() {
  const theme = useTheme();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.primary?.val,
          tabBarInactiveTintColor: theme.textTertiary?.val,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: () => {
            if (process.env.EXPO_OS === 'ios') {
              return (
                <BlurView
                  tint={theme.background?.val === '#0F0F14' ? 'dark' : 'light'}
                  intensity={80}
                  style={StyleSheet.absoluteFill}
                />
              );
            }
            return (
              <View
                style={[
                  StyleSheet.absoluteFill,
                  { backgroundColor: theme.surfaceSecondary?.val },
                ]}
              />
            );
          },
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
              borderTopWidth: 0,
              elevation: 0,
            },
            default: {
              borderTopColor: theme.borderColor?.val,
              backgroundColor: theme.background?.val,
              borderTopWidth: 1, // Añadido para separación clara en Android
              elevation: 0,
            },
          }),
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            marginTop: -4,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Inicio',
            tabBarIcon: ({ color }) => <Home size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="routines"
          options={{
            title: 'Rutinas',
            tabBarIcon: ({ color }) => <ClipboardList size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'Historial',
            tabBarIcon: ({ color }) => <History size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="stats"
          options={{
            title: 'Progreso',
            tabBarIcon: ({ color }) => <BarChart3 size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Ajustes',
            tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
          }}
        />
      </Tabs>
      
      {/* MiniPlayer renderiza condicionalmente por dentro usando Zustand.
        Como usa position: absolute, flotará correctamente sobre los tabs
        sin necesidad de Views contenedores que rompan el layout nativo.
      */}
      <MiniPlayer />
    </>
  );
}