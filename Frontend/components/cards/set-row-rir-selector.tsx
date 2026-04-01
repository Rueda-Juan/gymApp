import React from 'react';
import { Pressable } from 'react-native';
import { XStack } from 'tamagui';
import { FONT_SCALE } from '@/tamagui.config';
import Animated from 'react-native-reanimated';
import { X } from 'lucide-react-native';
import { AppText } from '../ui/AppText';
import { AppIcon } from '../ui/AppIcon';

const AnimatedXStack = Animated.createAnimatedComponent(XStack);

interface SetRowRirSelectorProps {
  value?: number | null;
  style?: object;
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
      {[0, 1, 2, 3, 4].map((rirValue) => (
        <Pressable key={rirValue} onPress={() => onSelect(rirValue)}>
          <XStack
            width={32}
            height={32}
            borderRadius={16}
            backgroundColor={value === rirValue ? '$primary' : '$surfaceSecondary'}
            justifyContent="center"
            alignItems="center"
          >
            <AppText color={value === rirValue ? 'background' : 'color'} fontWeight="700" fontSize={FONT_SCALE.sizes[1]}>
              {rirValue}{rirValue === 4 ? '+' : ''}
            </AppText>
          </XStack>
        </Pressable>
      ))}
      <Pressable onPress={onClose} style={{ padding: 4 }}>
        <AppIcon icon={X} size={14} color="textTertiary" />
      </Pressable>
    </AnimatedXStack>
  );
}