import { XStack, YStack } from 'tamagui';
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useTheme } from '@tamagui/core';
import { router } from 'expo-router';
import { X, Check } from 'lucide-react-native';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { AppButton, IconButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { useBodyWeight } from '@/hooks/useBodyWeight';

export default function LogWeightScreen() {
  const theme = useTheme();
  const weightService = useBodyWeight();

  const [weight, setWeight] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const numWeight = parseFloat(weight);
    if (isNaN(numWeight) || numWeight <= 0) {
      Alert.alert('Error', 'Por favor ingresa un peso vÃ¡lido');
      return;
    }

    try {
      setLoading(true);
      await weightService.logBodyWeight({ weight: numWeight, date: new Date() } as any);
      router.back();
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar el peso');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$xl" paddingVertical="$md">
        <IconButton icon={<X size={24} color={theme.color?.val} />} onPress={() => router.back()} />
        <AppText variant="titleSm">Registrar Peso</AppText>
        <XStack width={40} />
      </XStack>

      <YStack flex={1} alignItems="center" justifyContent="center" paddingHorizontal="$xl">
        <AppText variant="label" color="textTertiary" marginBottom="$md">PESO ACTUAL (KG)</AppText>
        <XStack alignItems="center" gap="$sm">
          <AppInput
            value={weight}
            onChangeText={setWeight}
            placeholder="0.0"
            keyboardType="numeric"
            autoFocus
            textAlign="center"
            fontSize={64}
            fontWeight="800"
            minWidth={150}
          />
          <AppText variant="titleLg" color="textSecondary" marginTop="$xl">kg</AppText>
        </XStack>
      </YStack>

      <YStack paddingHorizontal="$xl" paddingBottom="$3xl">
        <AppButton
          label={loading ? 'Guardando...' : 'Guardar'}
          icon={<Check size={20} color="#FFF" />}
          onPress={handleSave}
          disabled={loading}
          loading={loading}
        />
      </YStack>
    </Screen>
  );
}
