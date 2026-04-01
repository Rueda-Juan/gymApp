import { XStack, YStack } from 'tamagui';
import React, { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { X, Check } from 'lucide-react-native';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { AppButton, IconButton } from '@/components/ui/AppButton';
import { AppIcon } from '@/components/ui/AppIcon';
import { AppInput } from '@/components/ui/AppInput';
import { useBodyWeight } from '@/hooks/useBodyWeight';
import type { BodyWeightEntry } from 'backend/shared/types';
import { FONT_SCALE } from '@/tamagui.config';

export default function LogWeightScreen() {
  const weightService = useBodyWeight();

  const [weight, setWeight] = useState('');
  const [loading, setLoading] = useState(false);

  const MAX_BODY_WEIGHT_KG = 500;

  const handleSave = useCallback(async () => {
    const parsedWeight = parseFloat(weight);
    if (isNaN(parsedWeight) || parsedWeight <= 0 || parsedWeight > MAX_BODY_WEIGHT_KG) {
      Alert.alert('Error', `Por favor ingresa un peso válido (máx. ${MAX_BODY_WEIGHT_KG} kg)`);
      return;
    }

    try {
      setLoading(true);
      const entry: Omit<BodyWeightEntry, 'id' | 'createdAt'> = {
        weight: parsedWeight,
        date: new Date().toISOString().split('T')[0] ?? '',
        notes: null,
      };
      await weightService.logBodyWeight(entry);
      router.back();
    } catch {
      Alert.alert('Error', 'No se pudo guardar el peso');
    } finally {
      setLoading(false);
    }
  }, [weight, weightService]);

  return (
    <Screen>
      <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$xl" paddingVertical="$md">
        <IconButton icon={<AppIcon icon={X} size={24} color="color" />} onPress={() => router.back()} />
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
            fontSize={FONT_SCALE.sizes[7]}
            height={60}
            fontWeight="800"
            minWidth={150}
          />
          <AppText variant="titleLg" color="textSecondary" marginTop="$xl">kg</AppText>
        </XStack>
      </YStack>

      <YStack paddingHorizontal="$xl" paddingBottom="$3xl">
        <AppButton
          label={loading ? 'Guardando...' : 'Guardar'}
          icon={<AppIcon icon={Check} size={20} color="background" />}
          onPress={handleSave}
          disabled={loading}
          loading={loading}
        />
      </YStack>
    </Screen>
  );
}
