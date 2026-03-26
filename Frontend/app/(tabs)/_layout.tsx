import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { useTheme } from '@tamagui/core';
import { Home, ClipboardList, History, BarChart3, Settings } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { MiniPlayer } from '@/components/ui/mini-player';
import { useActiveWorkout } from '@/store/useActiveWorkout';

export default function TabLayout() {
  const theme = useTheme();
  const { isActive } = useActiveWorkout();

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.primary?.val as string,
          tabBarInactiveTintColor: theme.textTertiary?.val as string,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: () => {
            if (Platform.OS === 'ios') {
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
                  { backgroundColor: theme.surfaceSecondary?.val as string },
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
              borderTopColor: theme.borderColor?.val as string,
              backgroundColor: theme.background?.val as string,
              elevation: 0,
            },
          }),
          tabBarLabelStyle: {
            fontFamily: 'system-ui',
            fontSize: 10,
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            marginTop: -4,
          },
        }}>
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
      {isActive && <MiniPlayer />}
    </View>
  );
}
