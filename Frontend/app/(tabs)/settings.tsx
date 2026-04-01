import React from 'react';
import { Pressable, Switch, Alert } from 'react-native';
import { XStack, YStack, useTheme } from 'tamagui';
import { User, Bell, Lock, CircleHelp, Info, LogOut, ChevronRight, Moon, Hourglass, type LucideIcon } from 'lucide-react-native';

import { Screen } from '@/components/ui/Screen';
import { CardBase } from '@/components/ui/card';
import { AppText } from '@/components/ui/AppText';
import { AppInput } from '@/components/ui/AppInput';
import { AppIcon } from '@/components/ui/AppIcon';
import { useSettings, STANDARD_PLATES, BAR_WEIGHTS } from '@/store/useSettings';
import { useUser } from '@/store/useUser';
import { router } from 'expo-router';

const REST_TIMER_PRESETS = [60, 90, 120, 180] as const;
const MIN_REST_TIMER_SECONDS = 15;
const MAX_REST_TIMER_SECONDS = 600;

function clampRestTimerSeconds(seconds: number) {
  return Math.min(MAX_REST_TIMER_SECONDS, Math.max(MIN_REST_TIMER_SECONDS, seconds));
}

type SettingItemProps = {
  icon: LucideIcon;
  label: string;
} & (
  | {
      type?: 'link';
      onPress?: () => void;
    }
  | {
      type: 'switch';
      value: boolean;
      onValueChange: (value: boolean) => void;
    }
);

const SettingItem = React.memo(function SettingItem(props: SettingItemProps) {
  const theme = useTheme();
  const isSwitch = props.type === 'switch';
  const handlePress = isSwitch ? () => props.onValueChange(!props.value) : props.onPress;
  const isDisabled = !isSwitch && props.onPress == null;
  
  return (
    <Pressable
      disabled={isDisabled}
      onPress={handlePress}
      accessibilityRole={isSwitch ? 'switch' : 'button'}
      accessibilityState={isSwitch ? { checked: props.value } : undefined}
    >
      <XStack justifyContent="space-between" alignItems="center" paddingVertical="$sm">
        <XStack alignItems="center" gap="$md">
          <YStack
            width={40} 
            height={40} 
            borderRadius={20}
            alignItems="center" 
            justifyContent="center"
            backgroundColor="$surfaceSecondary"
          >
            <AppIcon icon={props.icon} size={18} color="primary" />
          </YStack>
          <AppText variant="bodyMd" fontWeight="500">{props.label}</AppText>
        </XStack>

        {!isSwitch && <AppIcon icon={ChevronRight} size={18} color="textTertiary" />}
        {isSwitch && (
          <Switch
            value={props.value}
            onValueChange={props.onValueChange}
            trackColor={{ false: theme.surfaceSecondary?.val as string, true: theme.primary?.val as string }}
            thumbColor={theme.background?.val as string}
          />
        )}
      </XStack>
    </Pressable>
  );
});

export default function SettingsScreen() {
  const availablePlates = useSettings(s => s.availablePlates);
  const defaultBarWeight = useSettings(s => s.defaultBarWeight);
  const restTimerSeconds = useSettings(s => s.restTimerSeconds);
  const setRestTimerSeconds = useSettings(s => s.setRestTimerSeconds);
  const themeMode = useSettings(s => s.themeMode);
  const setThemeMode = useSettings(s => s.setThemeMode);
  const togglePlate = useSettings(s => s.togglePlate);
  const setBarWeight = useSettings(s => s.setBarWeight);
  const resetUser = useUser(s => s.resetUser);
  const restTimerDebounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [restTimerInput, setRestTimerInput] = React.useState(() => String(restTimerSeconds));

  React.useEffect(() => {
    return () => {
      if (restTimerDebounceRef.current) {
        clearTimeout(restTimerDebounceRef.current);
      }
    };
  }, []);

  const applyRestTimerSeconds = React.useCallback((seconds: number) => {
    const clampedSeconds = clampRestTimerSeconds(seconds);
    setRestTimerSeconds(clampedSeconds);
    setRestTimerInput(String(clampedSeconds));
  }, [setRestTimerSeconds]);

  const handleRestTimerInputChange = React.useCallback((value: string) => {
    setRestTimerInput(value);

    if (restTimerDebounceRef.current) {
      clearTimeout(restTimerDebounceRef.current);
    }

    restTimerDebounceRef.current = setTimeout(() => {
      const nextSeconds = Number(value);
      if (!Number.isNaN(nextSeconds) && nextSeconds > 0) {
        const clampedSeconds = clampRestTimerSeconds(nextSeconds);
        setRestTimerSeconds(clampedSeconds);
        setRestTimerInput(String(clampedSeconds));
      }
    }, 600);
  }, [setRestTimerSeconds]);

  return (
    <Screen scroll safeAreaEdges={['top', 'left', 'right']}>
      <XStack paddingHorizontal="$xl" paddingTop="$lg" paddingBottom="$md">
        <AppText variant="titleLg">Ajustes</AppText>
      </XStack>

      <YStack paddingHorizontal="$lg" paddingBottom="$5xl">

        <YStack marginBottom="$2xl">
          <AppText variant="label" color="textTertiary" marginBottom="$xs">PERFIL</AppText>
          <CardBase padding="$md">
            <SettingItem icon={User} label="Perfil de Usuario" onPress={() => router.push('/settings/profile')} />
            <SettingItem icon={Bell} label="Notificaciones" onPress={() => router.push('/settings/notifications')} />
            <SettingItem icon={Lock} label="Privacidad" onPress={() => router.push('/settings/privacy')} />
          </CardBase>
        </YStack>

        <YStack marginBottom="$2xl">
          <AppText variant="label" color="textTertiary" marginBottom="$xs">EQUIPAMIENTO</AppText>

          <AppText variant="bodySm" color="textSecondary" marginBottom="$xs" marginLeft="$xs">
            Discos Disponibles (kg)
          </AppText>
          <CardBase marginBottom="$md" padding="$md">
            <XStack flexWrap="wrap" gap="$sm">
              {STANDARD_PLATES.map(plate => {
                const isActive = availablePlates.includes(plate);
                return (
                  <Pressable
                    key={plate}
                    onPress={() => togglePlate(plate)}
                  >
                    <YStack
                      alignItems="center" 
                      justifyContent="center"
                      paddingHorizontal="$md" 
                      paddingVertical="$xs"
                      borderRadius="$full" 
                      borderWidth={1}
                      borderColor={isActive ? '$primary' : '$borderColor'}
                      backgroundColor={isActive ? '$primarySubtle' : '$surfaceSecondary'}
                    >
                      <AppText
                        variant="bodyMd"
                        fontWeight="700"
                        color={isActive ? 'primary' : 'textSecondary'}
                      >
                        {plate}
                      </AppText>
                    </YStack>
                  </Pressable>
                );
              })}
            </XStack>
          </CardBase>

          <AppText variant="bodySm" color="textSecondary" marginBottom="$xs" marginLeft="$xs">
            Barra por Defecto (kg)
          </AppText>
          <CardBase padding="$md">
            <XStack justifyContent="space-between" gap="$xs">
              {BAR_WEIGHTS.map(bar => {
                const isActive = defaultBarWeight === bar;
                return (
                  <Pressable
                    key={bar}
                    style={{ flex: 1 }}
                    onPress={() => setBarWeight(bar)}
                    accessibilityLabel={`Barra de ${bar} kg`}
                  >
                    <YStack
                      alignItems="center" 
                      justifyContent="center"
                      paddingVertical="$sm" 
                      borderRadius="$md" 
                      borderCurve="continuous"
                      borderWidth={1}
                      borderColor={isActive ? '$primary' : '$borderColor'}
                      backgroundColor={isActive ? '$primarySubtle' : '$surfaceSecondary'}
                    >
                      <AppText
                        variant="bodyMd"
                        fontWeight="700"
                        color={isActive ? 'primary' : 'textSecondary'}
                      >
                        {bar} kg
                      </AppText>
                    </YStack>
                  </Pressable>
                );
              })}
            </XStack>
          </CardBase>
        </YStack>

        <YStack marginBottom="$2xl">
          <AppText variant="label" color="textTertiary" marginBottom="$xs">APLICACIÓN</AppText>
          <CardBase padding="$md" marginBottom="$md">
            <XStack alignItems="center" justifyContent="space-between" paddingVertical="$sm">
              <XStack alignItems="center" gap="$md">
                <YStack
                  width={40}
                  height={40}
                  borderRadius={20}
                  alignItems="center"
                  justifyContent="center"
                  backgroundColor="$surfaceSecondary"
                >
                  <AppIcon icon={Moon} size={18} color="primary" />
                </YStack>
                <AppText variant="bodyMd" fontWeight="500">Apariencia</AppText>
              </XStack>
              <XStack gap="$xs">
                {(['system', 'light', 'dark'] as const).map((mode) => {
                  const labels = { system: 'Sistema', light: 'Claro', dark: 'Oscuro' };
                  const isActive = themeMode === mode;
                  return (
                    <Pressable key={mode} onPress={() => setThemeMode(mode)}>
                      <YStack
                        paddingHorizontal="$sm"
                        paddingVertical="$xs"
                        borderRadius="$md"
                        borderWidth={1}
                        borderColor={isActive ? '$primary' : '$borderColor'}
                        backgroundColor={isActive ? '$primarySubtle' : '$surfaceSecondary'}
                      >
                        <AppText
                          variant="label"
                          fontWeight="700"
                          color={isActive ? 'primary' : 'textSecondary'}
                        >
                          {labels[mode]}
                        </AppText>
                      </YStack>
                    </Pressable>
                  );
                })}
              </XStack>
            </XStack>
            <YStack opacity={0.4} pointerEvents="none">
              <SettingItem icon={CircleHelp} label="Ayuda y Soporte" />
            </YStack>
            <YStack opacity={0.4} pointerEvents="none">
              <SettingItem icon={Info} label="Información de la App" />
            </YStack>
          </CardBase>

          <AppText variant="label" color="textTertiary" marginBottom="$xs">TIMER DE DESCANSO</AppText>
          <CardBase padding="$md">
            <YStack gap="$md">
              <XStack alignItems="center" justifyContent="space-between" gap="$md">
                <XStack alignItems="center" gap="$md" flex={1}>
                  <YStack
                    width={40}
                    height={40}
                    borderRadius={20}
                    borderWidth={1}
                    borderColor="$primary"
                    alignItems="center"
                    justifyContent="center"
                    backgroundColor="$primarySubtle"
                  >
                    <AppIcon icon={Hourglass} size={18} color="primary" />
                  </YStack>
                  <YStack flex={1}>
                    <AppText variant="bodyMd" fontWeight="600">Descanso por defecto</AppText>
                    <AppText variant="bodySm" color="textSecondary">Se aplica al completar un set</AppText>
                  </YStack>
                </XStack>

                <YStack
                  paddingHorizontal="$sm"
                  paddingVertical="$xs"
                  borderRadius="$full"
                  backgroundColor="$surfaceSecondary"
                >
                  <AppText variant="label" color="textTertiary">15-600s</AppText>
                </YStack>
              </XStack>

              <YStack
                alignItems="center"
                justifyContent="center"
                gap="$xs"
                paddingVertical="$md"
                borderRadius="$xl"
                borderCurve="continuous"
                backgroundColor="$surfaceSecondary"
                borderWidth={1}
                borderColor="$borderColor"
              >
                <AppText variant="label" color="textTertiary">Duración actual</AppText>
                <AppText variant="titleLg" fontWeight="800" fontVariant={['tabular-nums']}>
                  {restTimerSeconds}s
                </AppText>
              </YStack>

              <YStack gap="$xs">
                <AppText variant="label" color="textTertiary">ATAJOS</AppText>
                <XStack gap="$xs" flexWrap="wrap">
                  {REST_TIMER_PRESETS.map((preset) => {
                    const isActive = restTimerSeconds === preset;

                    return (
                      <Pressable key={preset} onPress={() => applyRestTimerSeconds(preset)}>
                        <YStack
                          minWidth={68}
                          alignItems="center"
                          paddingHorizontal="$md"
                          paddingVertical="$sm"
                          borderRadius="$lg"
                          borderCurve="continuous"
                          borderWidth={1}
                          borderColor={isActive ? '$primary' : '$borderColor'}
                          backgroundColor={isActive ? '$primarySubtle' : '$surfaceSecondary'}
                        >
                          <AppText
                            variant="bodyMd"
                            fontWeight="700"
                            color={isActive ? 'primary' : 'textSecondary'}
                            fontVariant={['tabular-nums']}
                          >
                            {preset}s
                          </AppText>
                        </YStack>
                      </Pressable>
                    );
                  })}
                </XStack>
              </YStack>

              <YStack gap="$xs">
                <AppText variant="label" color="textTertiary">EDITAR</AppText>
                <XStack alignItems="center" gap="$sm">
                  <AppInput
                    flex={1}
                    variant="compact"
                    minHeight={46}
                    paddingVertical="$sm"
                    keyboardType="numeric"
                    placeholder="Ej. 90"
                    value={restTimerInput}
                    onChangeText={handleRestTimerInputChange}
                  />
                  <YStack
                    minWidth={52}
                    alignItems="center"
                    justifyContent="center"
                    paddingHorizontal="$sm"
                    paddingVertical="$sm"
                    borderRadius="$md"
                    backgroundColor="$surfaceSecondary"
                  >
                    <AppText variant="label" color="textSecondary">seg</AppText>
                  </YStack>
                </XStack>
              </YStack>
            </YStack>
          </CardBase>
        </YStack>

        <YStack alignItems="center" marginTop="$xl">
          <AppText variant="bodySm" color="textTertiary">Versión 1.0.0 (Premium)</AppText>
        </YStack>

        <YStack opacity={0.6} marginTop="$md">
          <Pressable
            onPress={() => Alert.alert('Cerrar Sesión', '¿Estás seguro?', [
              { text: 'Cancelar' },
              { text: 'Salir', style: 'destructive', onPress: () => resetUser() }
            ])}
            accessibilityLabel="Cerrar sesión"
          >
            <XStack alignItems="center" justifyContent="center" gap="$sm" padding="$md">
              <AppIcon icon={LogOut} size={20} color="danger" />
              <AppText variant="bodyMd" color="danger" fontWeight="700">Cerrar Sesión</AppText>
            </XStack>
          </Pressable>
        </YStack>
      </YStack>
    </Screen>
  );
}