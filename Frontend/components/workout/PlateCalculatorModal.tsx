import React, { useMemo } from 'react';
import { XStack, YStack, useTheme } from 'tamagui';
import { X } from 'lucide-react-native';
import { Modal, Pressable } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { calculatePlates } from '@/utils/plateMath';
import { useSettings } from '@/store/useSettings';

export function PlateCalculatorModal({ 
  visible, 
  onClose, 
  targetWeight 
}: { 
  visible: boolean, 
  onClose: () => void, 
  targetWeight: number 
}) {
  
  const barWeight = useSettings(s => s.defaultBarWeight);
  const availablePlates = useSettings(s => s.availablePlates);
  const theme = useTheme();
  
  const calculation = useMemo(
    () => calculatePlates(targetWeight, barWeight, availablePlates),
    [targetWeight, barWeight, availablePlates]
  );

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable 
        style={{ flex: 1, backgroundColor: theme.overlay?.val ?? 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 }}
        onPress={onClose}
      >
        <Pressable>
          <YStack 
            backgroundColor="$surface" 
            borderRadius="$xl" 
            padding="$xl" 
            gap="$lg"
          >
          <XStack justifyContent="space-between" alignItems="center">
            <AppText variant="titleSm">Calculadora de Discos</AppText>
            <Pressable onPress={onClose}>
              <AppIcon icon={X} color="textSecondary" size={20} />
            </Pressable>
          </XStack>

          <YStack alignItems="center" paddingVertical="$xl">
            <XStack alignItems="center" gap="$1">
              {/* Lado Izquierdo */}
              <XStack gap={2} flexDirection="row-reverse" alignItems="center">
                {calculation.plates.map((p) => 
                  Array.from({ length: p.count }).map((_, i) => (
                    <YStack 
                      key={`l-${p.weight}-${i}`}
                      width={Math.min(20, 6 + p.weight * 0.2)} 
                      height={Math.min(70, 30 + p.weight * 2)} 
                      backgroundColor="$primary" 
                      borderRadius={2}
                    />
                  ))
                )}
              </XStack>

              {/* Centro de la barra */}
              <YStack width={40} height={10} backgroundColor="$borderColor" borderRadius={1} />

              {/* Lado Derecho */}
              <XStack gap={2} alignItems="center">
                {calculation.plates.map((p) => 
                  Array.from({ length: p.count }).map((_, i) => (
                    <YStack 
                      key={`r-${p.weight}-${i}`}
                      width={Math.min(20, 6 + p.weight * 0.2)} 
                      height={Math.min(70, 30 + p.weight * 2)} 
                      backgroundColor="$primary" 
                      borderRadius={2}
                    />
                  ))
                )}
              </XStack>
            </XStack>
          </YStack>

          <YStack gap="$sm">
            <XStack justifyContent="space-between">
              <AppText variant="bodyMd" color="textSecondary">Peso Objetivo:</AppText>
              <AppText variant="bodyMd" fontWeight="700">{targetWeight} kg</AppText>
            </XStack>
            <XStack justifyContent="space-between">
              <AppText variant="bodyMd" color="textSecondary">Peso en Barra:</AppText>
              <AppText variant="bodyMd" fontWeight="700">{calculation.actualTotalWeight} kg</AppText>
            </XStack>
            {calculation.remainder > 0 && (
              <AppText variant="label" color="danger" textAlign="right">
                Faltan {calculation.remainder} kg (ajusta tus discos)
              </AppText>
            )}
          </YStack>

          <YStack borderTopWidth={1} borderTopColor="$borderColor" paddingTop="$md">
            <AppText variant="label" color="textTertiary" marginBottom="$sm">DISCOS POR LADO:</AppText>
            <XStack flexWrap="wrap" gap="$sm">
              {calculation.plates.map((p) => (
                <YStack 
                  key={p.weight} 
                  backgroundColor="$surfaceSecondary" 
                  paddingHorizontal="$sm" 
                  paddingVertical="$xs" 
                  borderRadius="$md"
                >
                  <AppText variant="bodySm">{p.count} x {p.weight}kg</AppText>
                </YStack>
              ))}
            </XStack>
          </YStack>
          </YStack>
        </Pressable>
      </Pressable>
    </Modal>
  );
}