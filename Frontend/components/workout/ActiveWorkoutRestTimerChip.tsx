import React from 'react';
import { Pressable } from 'react-native';
import { XStack, YStack, useTheme } from 'tamagui';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { AppText } from '@/components/ui/AppText';

interface ActiveWorkoutRestTimerChipProps {
  isVisible: boolean;
  restDisplaySeconds: number;
  restProgressStyle: AnimatedStyle<object>;
  onDecrease: () => void;
  onIncrease: () => void;
}

export function ActiveWorkoutRestTimerChip({
  isVisible,
  restDisplaySeconds,
  restProgressStyle,
  onDecrease,
  onIncrease,
}: ActiveWorkoutRestTimerChipProps) {
  const theme = useTheme();

  if (!isVisible) return null;

  return (
    <XStack
      alignSelf="center"
      marginTop="$sm"
      alignItems="center"
      gap="$xs"
      backgroundColor="$primarySubtle"
      borderRadius="$xl"
      borderWidth={1}
      borderColor="$primary"
      paddingHorizontal="$xs"
      overflow="hidden"
    >
      <Pressable onPress={onDecrease} hitSlop={8} accessibilityLabel="Restar 15 segundos">
        <AppText variant="label" color="primary" fontWeight="700" paddingHorizontal="$sm" paddingVertical="$xs">−15s</AppText>
      </Pressable>

      <YStack
        width={112}
        height={28}
        borderRadius="$md"
        overflow="hidden"
        backgroundColor="$surface"
        justifyContent="center"
      >
        <Animated.View
          style={[
            { position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, backgroundColor: theme.primarySubtle?.val },
            restProgressStyle as any,
          ]}
        />
        <AppText variant="label" color="primary" fontWeight="700" textAlign="center">
          DESCANSO {Math.max(0, restDisplaySeconds)}s
        </AppText>
      </YStack>

      <Pressable onPress={onIncrease} hitSlop={8} accessibilityLabel="Añadir 15 segundos">
        <AppText variant="label" color="primary" fontWeight="700" paddingHorizontal="$sm" paddingVertical="$xs">+15s</AppText>
      </Pressable>
    </XStack>
  );
}