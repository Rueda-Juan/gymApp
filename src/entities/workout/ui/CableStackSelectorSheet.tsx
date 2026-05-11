import React, { useCallback } from 'react';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView, BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { YStack, XStack, useTheme } from 'tamagui';
import { Pressable } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { AppText } from '@/shared/ui/AppText';
import { AppIcon } from '@/shared/ui/AppIcon';
import { X } from 'lucide-react-native';
import { useWeightEngine } from '../lib/useWeightEngine';

export type CableStackSelectorSheetRef = BottomSheetModal;

export interface CableStackSelectorSheetProps {
  value: number;
  onChange: (blocks: number) => void;
  maxStack: number;
  unitWeight: number;
  onClose: () => void;
}

export function computeNextSelected(current: number, index: number) {
  return index + 1 === current ? index : index + 1;
}

export const CableStackSelectorSheet = React.forwardRef<
  CableStackSelectorSheetRef,
  CableStackSelectorSheetProps
>(({ value, onChange, maxStack, unitWeight, onClose }, ref) => {
  const theme = useTheme();

  const { result } = useWeightEngine({
    type: 'cable',
    config: { unitWeight, maxStack },
    input: { selectedBlocks: value },
  });

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={['45%']}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      onDismiss={onClose}
      backgroundStyle={{ backgroundColor: theme.surface?.val }}
      handleIndicatorStyle={{ backgroundColor: theme.borderColor?.val }}
    >
      <BottomSheetView style={{ flex: 1 }}>
        <YStack padding="$xl" gap="$lg">
          {/* Header */}
          <XStack justifyContent="space-between" alignItems="center">
            <AppText variant="titleSm">Selector de Stack</AppText>
            <Pressable onPress={onClose} hitSlop={12} accessibilityLabel="Cerrar selector">
              <AppIcon icon={X} color="textSecondary" size={20} />
            </Pressable>
          </XStack>

          {/* Stack blocks */}
          <YStack alignItems="center" gap="$md">
            <XStack alignItems="flex-end" gap={8} flexWrap="wrap" justifyContent="center">
              {result.type === 'cable' &&
                Array.from({ length: maxStack }).map((_, i) => (
                  <CableStackBlock
                    key={`block-${i}`}
                    index={i}
                    selected={i < value}
                    currentValue={value}
                    onPress={() => onChange(computeNextSelected(value, i))}
                    unitWeight={unitWeight}
                    maxStack={maxStack}
                  />
                ))}
            </XStack>

            {result.type === 'cable' && (
              <AppText variant="bodyMd" fontWeight="700" tabularNums>
                {result.actualTotalWeight} kg
              </AppText>
            )}
          </YStack>
        </YStack>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

CableStackSelectorSheet.displayName = 'CableStackSelectorSheet';

// ---------------------------
// BLOCK
// ---------------------------
interface CableStackBlockProps {
  index: number;
  selected: boolean;
  currentValue: number;
  onPress: () => void;
  unitWeight: number;
  maxStack: number;
}

const CableStackBlock: React.FC<CableStackBlockProps> = React.memo(
  ({ index, selected, currentValue, onPress, unitWeight, maxStack }) => {
    const anim = useSharedValue(selected ? 1 : 0);

    React.useEffect(() => {
      anim.value = withTiming(selected ? 1 : 0, { duration: 120 });
    }, [selected, anim]);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        { translateY: -8 * anim.value },
        { scale: 1 + 0.05 * anim.value },
      ],
    }));

    const theme = useTheme();

    return (
      <Pressable
        onPress={onPress}
        accessibilityLabel={`Bloque ${index + 1} de ${maxStack}, ${
          selected ? 'seleccionado' : 'no seleccionado'
        }`}
        accessibilityState={{ selected }}
        style={{ alignItems: 'center' }}
        disabled={index > currentValue}
      >
        <Animated.View
          style={[
            {
              width: 32,
              height: 36,
              marginBottom: 2,
              borderRadius: 6,
              backgroundColor: selected
                ? theme.primary?.val
                : theme.surfaceSecondary?.val,
              borderWidth: 2,
              borderColor: selected
                ? theme.primary?.val
                : theme.borderColor?.val,
              justifyContent: 'center',
              alignItems: 'center',
            },
            animatedStyle,
          ]}
        >
          <AppText
            variant="bodySm"
            color={selected ? 'background' : 'textSecondary'}
            fontWeight="700"
          >
            {unitWeight}
          </AppText>
        </Animated.View>
      </Pressable>
    );
  }
);

CableStackBlock.displayName = 'CableStackBlock';
