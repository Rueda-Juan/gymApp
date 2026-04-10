import React from 'react';
import { Pressable, Switch, Alert, ActivityIndicator } from 'react-native';
import { XStack, YStack, useTheme } from 'tamagui';
import { User, Bell, Lock, CircleHelp, Info, LogOut, Moon, Hourglass, Wind } from 'lucide-react-native';
import useRestTimer from '@/hooks/ui/useRestTimer';

import { Screen } from '@/components/ui/Screen';
import { CardBase } from '@/components/ui/Card';
import { AppText } from '@/components/ui/AppText';
import { AppInput } from '@/components/ui/AppInput';
import { AppIcon } from '@/components/ui/AppIcon';
import { ToggleChip } from '@/components/ui/ToggleChip';
import { SettingItem } from '@/components/settings/SettingItem';
import { SegmentedPicker } from '@/components/settings/SegmentedPicker';
import { useSettings, STANDARD_PLATES, BAR_WEIGHTS } from '@/store/useSettings';
import { useUser } from '@/store/useUser';
import { useDI } from '@/context/DIContext';
import { router } from 'expo-router';
import { ROUTES } from '@/constants/routes';

const REST_TIMER_PRESETS = [60, 90, 120, 180] as const;


const THEME_OPTIONS = ['system', 'light', 'dark'] as const;
const THEME_LABELS: Record<typeof THEME_OPTIONS[number], string> = { system: 'Sistema', light: 'Claro', dark: 'Oscuro' };

const MOTION_OPTIONS = ['system', 'full', 'reduced'] as const;
const MOTION_LABELS: Record<typeof MOTION_OPTIONS[number], string> = { system: 'Sistema', full: 'Completa', reduced: 'Reducida' };

export default function SettingsScreen() {
  const availablePlates = useSettings(s => s.availablePlates);
  const defaultBarWeight = useSettings(s => s.defaultBarWeight);
  const themeMode = useSettings(s => s.themeMode);
  const setThemeMode = useSettings(s => s.setThemeMode);
  const motionPreference = useSettings(s => s.motionPreference);
  const setMotionPreference = useSettings(s => s.setMotionPreference);
  const togglePlate = useSettings(s => s.togglePlate);
  const setBarWeight = useSettings(s => s.setBarWeight);
  const hapticsEnabled = useSettings(s => s.hapticsEnabled);
  const setHapticsEnabled = useSettings(s => s.setHapticsEnabled);
  const resetUser = useUser(s => s.resetUser);
  const { wipeDatabase } = useDI();
  const theme = useTheme();
  const [resetLoading, setResetLoading] = React.useState(false);
  const { restTimerInput, setRestTimerInput, restTimerSeconds, applyRestTimerSeconds, handleRestTimerInputChange } = useRestTimer();

  return (
    <Screen scroll safeAreaEdges={['top', 'left', 'right']}>
      <XStack paddingHorizontal="$xl" paddingTop="$lg" paddingBottom="$md">
        <AppText variant="titleLg">Ajustes</AppText>
      </XStack>

      <YStack paddingHorizontal="$lg" paddingBottom="$5xl">

        <YStack marginBottom="$2xl">
          <AppText variant="label" color="textTertiary" marginBottom="$xs">PERFIL</AppText>
          <CardBase padding="$md">
            <SettingItem icon={User} label="Perfil de Usuario" onPress={() => router.push(ROUTES.SETTINGS_PROFILE)} />
            <SettingItem icon={Bell} label="Notificaciones" onPress={() => router.push(ROUTES.SETTINGS_NOTIFICATIONS)} />
            <SettingItem icon={Lock} label="Privacidad" onPress={() => router.push(ROUTES.SETTINGS_PRIVACY)} />
          </CardBase>
        </YStack>

        <YStack marginBottom="$2xl">
          <AppText variant="label" color="textTertiary" marginBottom="$xs">EQUIPAMIENTO</AppText>

          <AppText variant="bodySm" color="textSecondary" marginBottom="$xs" marginLeft="$xs">
            Discos Disponibles (kg)
          </AppText>
          <CardBase marginBottom="$md" padding="$md">
            <XStack flexWrap="wrap" gap="$sm">
              {STANDARD_PLATES.map(plate => (
                <ToggleChip
                  key={plate}
                  label={String(plate)}
                  isActive={availablePlates.includes(plate)}
                  onPress={() => togglePlate(plate)}
                  accessibilityLabel={`Disco de ${plate} kg`}
                />
              ))}
            </XStack>
          </CardBase>

          <AppText variant="bodySm" color="textSecondary" marginBottom="$xs" marginLeft="$xs">
            Barra por Defecto (kg)
          </AppText>
          <CardBase padding="$md">
            <XStack justifyContent="space-between" gap="$xs">
              {BAR_WEIGHTS.map(bar => (
                <ToggleChip
                  key={bar}
                  label={`${bar} kg`}
                  isActive={defaultBarWeight === bar}
                  onPress={() => setBarWeight(bar)}
                  accessibilityLabel={`Barra de ${bar} kg`}
                />
              ))}
            </XStack>
          </CardBase>
        </YStack>

        <YStack marginBottom="$2xl">
          <AppText variant="label" color="textTertiary" marginBottom="$xs">APLICACIÓN</AppText>
          <CardBase padding="$md" marginBottom="$md">
            <SegmentedPicker
              icon={Moon}
              label="Apariencia"
              options={THEME_OPTIONS}
              labels={THEME_LABELS}
              value={themeMode}
              onValueChange={setThemeMode}
            />
            <SegmentedPicker
              icon={Wind}
              label="Animaciones"
              options={MOTION_OPTIONS}
              labels={MOTION_LABELS}
              value={motionPreference}
              onValueChange={setMotionPreference}
            />
            <SettingItem icon={CircleHelp} label="Ayuda y Soporte" disabled />
            <SettingItem icon={Info} label="Información de la App" disabled />
          </CardBase>
          
          <AppText variant="label" color="textTertiary" marginBottom="$xs">RETROALIMENTACIÓN</AppText>
          <CardBase padding="$md" marginBottom="$md">
            <XStack alignItems="center" justifyContent="space-between" paddingVertical="$sm">
              <XStack alignItems="center" gap="$md">
                <AppIcon icon={Bell} size={20} color="textSecondary" />
                <AppText variant="bodyMd">Vibración (Haptics)</AppText>
              </XStack>
              <Switch 
                value={hapticsEnabled} 
                onValueChange={setHapticsEnabled}
                trackColor={{ true: theme.primary?.val }}
              />
            </XStack>
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
                  {REST_TIMER_PRESETS.map((preset) => (
                    <ToggleChip
                      key={preset}
                      label={`${preset}s`}
                      isActive={restTimerSeconds === preset}
                      onPress={() => applyRestTimerSeconds(preset)}
                    />
                  ))}
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
          <AppText variant="bodySm" color="textTertiary">Versión 1.0.0</AppText>
        </YStack>

        <YStack opacity={0.6} marginTop="$md">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Resetear base de datos"
            onPress={() => {
              if (resetLoading) return;
              Alert.alert('Resetear Base de Datos', 'Esto eliminará todos los datos localmente. Asegurate de crear un backup antes. ¿Querés continuar?', [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Resetear', style: 'destructive', onPress: async () => {
                  try {
                    setResetLoading(true);
                    await wipeDatabase.execute();
                    resetUser();
                    Alert.alert('Listo', 'La base de datos fue reseteada.');
                  } catch (e) {
                    Alert.alert('Error', 'No se pudo resetear la base de datos.');
                  } finally {
                    setResetLoading(false);
                  }
                } }
              ]);
            }}
          >
            <XStack alignItems="center" justifyContent="center" gap="$sm" padding="$md">
              <AppIcon icon={LogOut} size={20} color="danger" />
              {resetLoading ? (
                <ActivityIndicator size="small" color={theme.primary?.val} />
              ) : (
                <AppText variant="bodyMd" color="danger" fontWeight="700">Resetear Base de Datos</AppText>
              )}
            </XStack>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cerrar sesión"
            onPress={() => Alert.alert('Cerrar Sesión', '¿Estás seguro?', [
              { text: 'Cancelar' },
              { text: 'Salir', style: 'destructive', onPress: () => resetUser() }
            ])}
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