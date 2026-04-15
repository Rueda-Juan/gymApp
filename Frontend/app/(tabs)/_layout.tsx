import React, { useMemo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';
import { useTheme } from 'tamagui';
import { BlurView } from 'expo-blur';
import { Home, ClipboardList, History, BarChart3, Settings } from 'lucide-react-native';
import { HapticTab } from '@/components/HapticTab';
import { MiniPlayer } from '@/components/ui/MiniPlayer';
import { useSettings } from '@/store/useSettings';
import { FONT_SCALE } from '@/tamagui.config';
import { useColorScheme } from '@/hooks/ui/use-color-scheme';
import { useMotion } from '@/hooks/ui/useMotion';


// --- Icon Components ---

type TabIconProps = {
  color: string;
  focused: boolean;
  theme: ReturnType<typeof useTheme>;
};

const HomeTabIcon = ({ color, focused, theme }: TabIconProps) => (
  <Home size={24} color={color} fill={focused ? theme.primarySubtle?.val : 'none'} />
);
const RoutinesTabIcon = ({ color, focused, theme }: TabIconProps) => (
  <ClipboardList size={24} color={color} fill={focused ? theme.primarySubtle?.val : 'none'} />
);
const HistoryTabIcon = ({ color, focused, theme }: TabIconProps) => (
  <History size={24} color={color} fill={focused ? theme.primarySubtle?.val : 'none'} />
);
const StatsTabIcon = ({ color, focused, theme }: TabIconProps) => (
  <BarChart3 size={24} color={color} fill={focused ? theme.primarySubtle?.val : 'none'} />
);
const SettingsTabIcon = ({ color, focused, theme }: TabIconProps) => (
  <Settings size={24} color={color} fill={focused ? theme.primarySubtle?.val : 'none'} />
);

// --- TabBarBackground as external component ---
type TabBarBackgroundProps = {
  isReduced: boolean;
  effectiveScheme: 'light' | 'dark';
  theme: ReturnType<typeof useTheme>;
};
function TabBarBackground({ isReduced, effectiveScheme, theme }: TabBarBackgroundProps) {
  if (isReduced) {
    return (
      <View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: theme.surfaceSecondary?.val },
        ]}
      />
    );
  }
  if (Platform.OS === 'ios') {
    return (
      <BlurView
        tint={effectiveScheme === 'dark' ? 'dark' : 'light'}
        intensity={80}
        style={StyleSheet.absoluteFillObject}
      />
    );
  }
  return (
    <View
      style={[
        StyleSheet.absoluteFillObject,
        { backgroundColor: theme.surfaceSecondary?.val },
      ]}
    />
  );
}

// --- Tab config array ---
const TABS = [
  {
    name: 'index',
    title: 'Inicio',
    Icon: HomeTabIcon,
  },
  {
    name: 'routines',
    title: 'Rutinas',
    Icon: RoutinesTabIcon,
  },
  {
    name: 'history',
    title: 'Historial',
    Icon: HistoryTabIcon,
  },
  {
    name: 'stats',
    title: 'Progreso',
    Icon: StatsTabIcon,
  },
  {
    name: 'settings',
    title: 'Ajustes',
    Icon: SettingsTabIcon,
  },
];

export default function TabLayout() {
  const theme = useTheme();
  const systemScheme = useColorScheme();
  const themeMode = useSettings(s => s.themeMode);
  const effectiveScheme: 'light' | 'dark' =
  themeMode === 'system'
    ? (systemScheme ?? 'light')
    : themeMode;
  const { isReduced } = useMotion();


  const screenOptions = useMemo(() => ({
    // Usar string vacío como fallback para evitar hardcode y dejar que el theme controle el color
    tabBarActiveTintColor: String(theme.primary?.val ?? ''),
    tabBarInactiveTintColor: String(theme.textTertiary?.val ?? ''),
    headerShown: false,
    tabBarButton: HapticTab,
    tabBarBackground: () => (
      <TabBarBackground isReduced={isReduced} effectiveScheme={effectiveScheme} theme={theme} />
    ),
    tabBarStyle: Platform.select({
      ios: {
        position: 'absolute',
        borderTopWidth: 0,
        elevation: 0,
      },
      default: {
        borderTopColor: String(theme.borderColor?.val ?? ''),
        backgroundColor: String(theme.background?.val ?? ''),
        borderTopWidth: 1, // Añadido para separación clara en Android
        elevation: 0,
      },
    }),
    tabBarLabelStyle: ({
      fontSize: FONT_SCALE.sizes['micro'],
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginTop: 0,
    } as any),
  }) as any, [isReduced, effectiveScheme, theme]);

  return (
    <>
      <Tabs screenOptions={screenOptions}>
        {TABS.map(({ name, title, Icon }) => (
          <Tabs.Screen
            key={name}
            name={name}
            options={{
              title,
              tabBarIcon: ({ color, focused }) => <Icon color={color} focused={focused} theme={theme} />,
            }}
          />
        ))}
      </Tabs>
      {/* MiniPlayer renderiza condicionalmente por dentro usando Zustand.
        Como usa position: absolute, flotará correctamente sobre los tabs
        sin necesidad de Views contenedores que rompan el layout nativo.
      */}
      <MiniPlayer />
    </>
  );
}