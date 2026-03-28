import React from 'react';
import { Pressable, Switch, Alert } from 'react-native';
import { XStack, YStack, useTheme } from 'tamagui';
import { User, Bell, Lock, CircleHelp, Info, LogOut, ChevronRight, Moon } from 'lucide-react-native';

import { Screen } from '@/components/ui/Screen';
import { CardBase } from '@/components/ui/card';
import { AppText } from '@/components/ui/AppText';
import { AppInput } from '@/components/ui/AppInput';
import { AppIcon } from '@/components/ui/AppIcon';
import { useSettings, STANDARD_PLATES, BAR_WEIGHTS } from '@/store/useSettings';
import { router } from 'expo-router';

const SettingItem = React.memo(function SettingItem({ icon, label, value, type = 'link', onValueChange, onPress }: any) {
  const theme = useTheme();
  
  return (
    <Pressable
      disabled={type === 'switch'}
      onPress={type === 'link' ? onPress : undefined}
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
            <AppIcon icon={icon} size={18} color="primary" />
          </YStack>
          <AppText variant="bodyMd" fontWeight="500">{label}</AppText>
        </XStack>

        {type === 'link' && <AppIcon icon={ChevronRight} size={18} color="textTertiary" />}
        {type === 'switch' && (
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: theme.surfaceSecondary?.val as string, true: theme.primary?.val as string }}
            thumbColor="#FFF"
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
  const themeMode = useSettings(s => s.themeMode);
  const setThemeMode = useSettings(s => s.setThemeMode);
  const togglePlate = useSettings(s => s.togglePlate);
  const setBarWeight = useSettings(s => s.setBarWeight);

  return (
    <Screen safeAreaEdges={['top', 'left', 'right']}>
      <XStack paddingHorizontal="$xl" paddingTop="$lg" paddingBottom="$md">
        <AppText variant="titleLg">Ajustes</AppText>
      </XStack>

      <YStack paddingHorizontal="$lg" paddingBottom="$10">

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
                        fontWeight={isActive ? '700' : '400'}
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
                        fontWeight={isActive ? '700' : '500'}
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
            <SettingItem
              icon={Moon}
              label="Modo Oscuro"
              type="switch"
              value={themeMode === 'dark'}
              onValueChange={(value: boolean) => setThemeMode(value ? 'dark' : 'light')}
            />
            <SettingItem icon={CircleHelp} label="Ayuda y Soporte" />
            <SettingItem icon={Info} label="Información de la App" />
          </CardBase>

          <AppText variant="label" color="textTertiary" marginBottom="$xs">TIMER DE DESCANSO</AppText>
          <CardBase padding="$md">
            <YStack gap="$sm">
              <AppText variant="bodyMd">Duración actual: {restTimerSeconds} seg</AppText>
              <AppInput
                keyboardType="numeric"
                placeholder="Segundos"
                value={String(restTimerSeconds)}
                onChangeText={(val) => {
                  const numberVal = Number(val);
                  if (!Number.isNaN(numberVal) && numberVal > 0) useSettings.getState().setRestTimerSeconds(numberVal);
                }}
              />
            </YStack>
          </CardBase>
        </YStack>

        <Pressable
          onPress={() => Alert.alert('Cerrar Sesión', '¿Estás seguro?', [{ text: 'Cancelar' }, { text: 'Salir', style: 'destructive' }])}
          accessibilityLabel="Cerrar sesión"
        >
          <XStack alignItems="center" justifyContent="center" gap="$sm" padding="$md">
            <AppIcon icon={LogOut} size={20} color="danger" />
            <AppText variant="bodyMd" color="danger" fontWeight="700">Cerrar Sesión</AppText>
          </XStack>
        </Pressable>

        <YStack alignItems="center" marginTop="$xl">
          <AppText variant="bodySm" color="textTertiary">Versión 1.0.0 (Premium)</AppText>
        </YStack>
      </YStack>
    </Screen>
  );
}