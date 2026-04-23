import { XStack, YStack } from 'tamagui';
import React, { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { X, Check } from 'lucide-react-native';
import { Screen, AppText, AppButton, IconButton, AppIcon, AppInput } from '@/shared/ui';
import type { BodyWeight } from '@kernel';
import { useUser } from '@/entities/settings';
import { useBodyWeight } from '@/entities/stats';
import { FONT_SCALE } from '@/shared/ui/theme/tamagui.config';

const MAX_BODY_WEIGHT_KG = 500;
const WEIGHT_INPUT_FONT_SIZE = FONT_SCALE.sizes[7];
const HEADER_ICON_WIDTH = 40;

export default function LogWeightPage() {
  const weightService = useBodyWeight();
  const user = useUser(s => s.user);

  const [weight, setWeight] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = useCallback(async () => {
    const parsedWeight = parseFloat(weight);
    if (isNaN(parsedWeight) || parsedWeight <= 0 || parsedWeight > MAX_BODY_WEIGHT_KG) {
      Alert.alert('Error', `Por favor ingresa un peso válido (máx. ${MAX_BODY_WEIGHT_KG} kg)`);
      return;
    }

    try {
      setLoading(true);
      const entry: Omit<BodyWeight, 'id' | 'createdAt'> = {
        weight: parsedWeight,
        date: new Date().toISOString().split('T')[0] ?? '',
        userId: user?.id ?? '',
      };
      await weightService.logBodyWeight(entry);
      router.back();
    } catch {
      Alert.alert('Error', 'No se pudo guardar el peso');
    } finally {
      setLoading(false);
    }
  }, [weight, weightService, user?.id]);

  return (
    <Screen
      scroll
      keyboardAvoiding
      keyboardVerticalOffset={0}
      safeAreaEdges={['top','bottom','left','right']}
    >
      <YStack flex={1}>
        <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$xl" paddingVertical="$md">
          <IconButton icon={<AppIcon icon={X} size={24} color="color" />} onPress={() => router.back()} accessibilityLabel="Cerrar" />
          <AppText variant="titleSm">Registrar Peso</AppText>
          <XStack width={HEADER_ICON_WIDTH} />
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
              fontSize={WEIGHT_INPUT_FONT_SIZE}
              accessibilityLabel="Peso corporal en kilogramos"
              height={56}
              fontWeight="800"
              minWidth={160}
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
      </YStack>
    </Screen>
  );
}
