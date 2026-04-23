import React from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { XStack, YStack } from 'tamagui';
import { FONT_SCALE } from '@/shared/ui/theme/tamagui.config';
import Animated from 'react-native-reanimated';
import { X } from 'lucide-react-native';
import { AppText } from '@/shared/ui/AppText';
import { AppIcon } from '@/shared/ui/AppIcon';

const AnimatedXStack = Animated.createAnimatedComponent(XStack);

const RIR_OPTIONS = [0, 1, 2, 3, 4] as const;

const RIR_CHIP_SIZE = 32;
const RIR_CHIP_RADIUS = 16;
const CLOSE_BUTTON_PADDING = 4;

interface SetRowRirSelectorProps {
  value?: number | null;
  style?: StyleProp<ViewStyle>;
  pointerEvents?: 'auto' | 'none';
  onSelect: (value: number) => void;
  onClose: () => void;
}

export function SetRowRirSelector({
  value,
  style,
  pointerEvents,
  onSelect,
  onClose,
}: SetRowRirSelectorProps) {
  return (
    <AnimatedXStack
      style={[{ position: 'absolute', inset: 0, justifyContent: 'space-between', alignItems: 'center' }, style]}
      pointerEvents={pointerEvents}
    >
      {RIR_OPTIONS.map((rirValue) => (
        <YStack
          key={rirValue}
          onPress={() => onSelect(rirValue)}
          accessibilityRole="button"
          accessibilityLabel={`RIR ${rirValue}${rirValue === 4 ? ' o m\u00e1s' : ''}, repeticiones en reserva`}
          cursor="pointer"
          pressStyle={{ opacity: 0.7 }}
        >
          <XStack
            width={RIR_CHIP_SIZE}
            height={RIR_CHIP_SIZE}
            borderRadius={RIR_CHIP_RADIUS}
            backgroundColor={value === rirValue ? '$primary' : '$surfaceSecondary'}
            justifyContent="center"
            alignItems="center"
          >
            <AppText color={value === rirValue ? 'background' : 'color'} fontWeight="700" fontSize={FONT_SCALE.sizes[1]}>
              {rirValue}{rirValue === 4 ? '+' : ''}
            </AppText>
          </XStack>
        </YStack>
      ))}
      <YStack
        onPress={onClose}
        style={{ padding: CLOSE_BUTTON_PADDING }}
        accessibilityRole="button"
        accessibilityLabel="Cerrar selector RIR"
        cursor="pointer"
        pressStyle={{ opacity: 0.7 }}
      >
        <AppIcon icon={X} size={14} color="textTertiary" />
      </YStack>
    </AnimatedXStack>
  );
}
