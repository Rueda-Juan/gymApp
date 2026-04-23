import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Dumbbell, History, Settings, Search } from 'lucide-react-native';
import { useTheme } from 'tamagui';
import { AppIcon } from '@/shared/ui/AppIcon';

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary.get(),
        tabBarInactiveTintColor: theme.color11?.get?.() ?? '#888',
        tabBarStyle: {
          backgroundColor: theme.background.get(),
          borderTopColor: theme.borderColor.get(),
          elevation: 0,
          shadowOpacity: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="dashboard/index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <AppIcon icon={Home} color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="routines/index"
        options={{
          title: 'Rutinas',
          tabBarIcon: ({ color }) => <AppIcon icon={Dumbbell} color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="stats/index"
        options={{
          title: 'Progreso',
          tabBarIcon: ({ color }) => <AppIcon icon={History} color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="exercise/index"
        options={{
          title: 'Ejercicios',
          tabBarIcon: ({ color }) => <AppIcon icon={Search} color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color }) => <AppIcon icon={Settings} color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
