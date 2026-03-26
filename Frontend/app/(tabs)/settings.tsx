import { XStack, YStack } from 'tamagui';
import React from 'react';
import { View, TouchableOpacity, Switch, Alert } from 'react-native';
import { useTheme } from '@tamagui/core';
import { Screen } from '@/components/ui/Screen';
import { User, Bell, Lock, CircleHelp, Info, LogOut, ChevronRight, Moon } from 'lucide-react-native';
import { CardBase } from '@/components/ui/card';
import { AppText } from '@/components/ui/AppText';
import { useSettings, STANDARD_PLATES, BAR_WEIGHTS } from '@/store/useSettings';

export default function SettingsScreen() {
  const theme = useTheme();
  const { availablePlates, defaultBarWeight, togglePlate, setBarWeight } = useSettings();

  const SettingItem = ({ icon: Icon, label, value, type = 'link', onValueChange }: any) => (
    <TouchableOpacity
      style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 }}
      disabled={type === 'switch'}
      onPress={() => type === 'link' && Alert.alert('PrÃ³ximamente', 'Esta funciÃ³n estarÃ¡ disponible pronto')}
    >
      <XStack alignItems="center" gap="$md">
        <View
          style={{
            width: 40, height: 40, borderRadius: 20,
            alignItems: 'center', justifyContent: 'center',
            backgroundColor: theme.surfaceSecondary?.val,
          }}
        >
          <Icon size={18} color={theme.primary?.val} />
        </View>
        <AppText variant="bodyMd" style={{ fontWeight: '500' }}>{label}</AppText>
      </XStack>

      {type === 'link' && <ChevronRight size={18} color={theme.textTertiary?.val} />}
      {type === 'switch' && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: theme.surfaceSecondary?.val, true: theme.primary?.val }}
          thumbColor="#FFF"
        />
      )}
    </TouchableOpacity>
  );

  return (
    <Screen>
      <XStack paddingHorizontal="$xl" paddingTop="$lg" paddingBottom="$md">
        <AppText variant="titleLg">Ajustes</AppText>
      </XStack>

      <YStack paddingHorizontal={20} paddingBottom={100}>

        <YStack marginBottom="$2xl">
          <AppText variant="label" color="textTertiary" style={{ marginBottom: 8 }}>PERFIL</AppText>
          <CardBase>
            <SettingItem icon={User} label="Perfil de Usuario" />
            <SettingItem icon={Bell} label="Notificaciones" />
            <SettingItem icon={Lock} label="Privacidad" />
          </CardBase>
        </YStack>

        <YStack marginBottom="$2xl">
          <AppText variant="label" color="textTertiary" style={{ marginBottom: 8 }}>EQUIPAMIENTO</AppText>

          <AppText variant="bodySm" color="textSecondary" style={{ marginBottom: 4, marginLeft: 4 }}>
            Discos Disponibles (kg)
          </AppText>
          <CardBase marginBottom="$sm">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {STANDARD_PLATES.map(plate => {
                const isActive = availablePlates.includes(plate);
                return (
                  <TouchableOpacity
                    key={plate}
                    style={{
                      alignItems: 'center', justifyContent: 'center',
                      paddingHorizontal: 12, paddingVertical: 8,
                      borderRadius: 9999, borderWidth: 1,
                      borderColor: isActive ? theme.primary?.val : theme.borderColor?.val,
                      backgroundColor: isActive ? theme.primarySubtle?.val : theme.surfaceSecondary?.val,
                    }}
                    onPress={() => togglePlate(plate)}
                  >
                    <AppText
                      variant="bodyMd"
                      style={{
                        fontWeight: isActive ? '700' : '400',
                        color: isActive ? theme.primary?.val : theme.textSecondary?.val,
                      }}
                    >
                      {plate}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </CardBase>

          <AppText variant="bodySm" color="textSecondary" style={{ marginBottom: 4, marginLeft: 4 }}>
            Barra por Defecto (kg)
          </AppText>
          <CardBase>
            <XStack justifyContent="space-between">
              {BAR_WEIGHTS.map(bar => {
                const isActive = defaultBarWeight === bar;
                return (
                  <TouchableOpacity
                    key={bar}
                    style={{
                      flex: 1, alignItems: 'center', justifyContent: 'center',
                      marginHorizontal: 4, paddingVertical: 8, borderRadius: 8,
                      borderWidth: 1,
                      borderColor: isActive ? theme.primary?.val : theme.borderColor?.val,
                      backgroundColor: isActive ? theme.primarySubtle?.val : theme.surfaceSecondary?.val,
                    }}
                    onPress={() => setBarWeight(bar)}
                  >
                    <AppText
                      variant="bodyMd"
                      style={{
                        fontWeight: isActive ? '700' : '500',
                        color: isActive ? theme.primary?.val : theme.textSecondary?.val,
                      }}
                    >
                      {bar} kg
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </XStack>
          </CardBase>
        </YStack>

        <YStack marginBottom="$2xl">
          <AppText variant="label" color="textTertiary" style={{ marginBottom: 8 }}>APLICACIÓN</AppText>
          <CardBase>
            <SettingItem icon={Moon} label="Modo Oscuro" type="switch" value={true} />
            <SettingItem icon={CircleHelp} label="Ayuda y Soporte" />
            <SettingItem icon={Info} label="Información de la App" />
          </CardBase>
        </YStack>

        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, justifyContent: 'center' }}
          onPress={() => Alert.alert('Cerrar SesiÃ³n', 'Â¿EstÃ¡s seguro?', [{ text: 'Cancelar' }, { text: 'Salir', style: 'destructive' }])}
        >
          <LogOut size={20} color={theme.danger?.val} />
          <AppText variant="bodyMd" color="danger" style={{ fontWeight: '700' }}>Cerrar SesiÃ³n</AppText>
        </TouchableOpacity>

        <YStack alignItems="center" marginTop="$xl">
          <AppText variant="bodySm" color="textTertiary">VersiÃ³n 1.0.0 (Premium)</AppText>
        </YStack>
      </YStack>
    </Screen>
  );
}
