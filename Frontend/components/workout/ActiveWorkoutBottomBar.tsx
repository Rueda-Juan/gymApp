import React from 'react';
import { Pressable } from 'react-native';
import { XStack, YStack } from 'tamagui';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { ChevronLeft, ChevronRight, Hourglass, PenLine } from 'lucide-react-native';
import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { FONT_SCALE } from '@/tamagui.config';

interface ActiveWorkoutBottomBarProps {
  isFirst: boolean;
  isLast: boolean;
  isFinishing: boolean;
  sessionNote: string | undefined;
  restTimerIsActive: boolean;
  restDisplaySeconds: number;
  insetsBottom: number;
  hourglassAnimatedStyle: AnimatedStyle<object>;
  onPrev: () => void;
  onOpenNote: () => void;
  onOpenRestTimer: () => void;
  onNext: () => void;
}

export function ActiveWorkoutBottomBar({
  isFirst,
  isLast,
  isFinishing,
  sessionNote,
  restTimerIsActive,
  restDisplaySeconds,
  insetsBottom,
  hourglassAnimatedStyle,
  onPrev,
  onOpenNote,
  onOpenRestTimer,
  onNext,
}: ActiveWorkoutBottomBarProps) {
  return (
    <YStack
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      backgroundColor="$surface"
      borderTopWidth={1}
      borderTopColor="$borderColor"
      paddingBottom={Math.max(insetsBottom + 8, 24)}
      paddingTop="$md"
      paddingHorizontal="$xl"
    >
      <XStack alignItems="center" gap="$sm">
        <Pressable onPress={onPrev} disabled={isFirst} accessibilityLabel="Ejercicio anterior">
          <YStack
            width={52}
            height={52}
            borderRadius="$lg"
            borderCurve="continuous"
            alignItems="center"
            justifyContent="center"
            backgroundColor="$surfaceSecondary"
            opacity={isFirst ? 0.3 : 1}
          >
            <AppIcon icon={ChevronLeft} color="color" size={22} />
          </YStack>
        </Pressable>

        <Pressable onPress={onOpenNote} accessibilityLabel="Nota de sesión">
          <YStack
            width={52}
            height={52}
            borderRadius="$lg"
            borderCurve="continuous"
            alignItems="center"
            justifyContent="center"
            backgroundColor={sessionNote ? '$primarySubtle' : '$surfaceSecondary'}
            borderWidth={1}
            borderColor={sessionNote ? '$primary' : '$borderColor'}
          >
            <AppIcon icon={PenLine} color={sessionNote ? 'primary' : 'color'} size={20} />
          </YStack>
        </Pressable>

        <Pressable onPress={onOpenRestTimer} accessibilityLabel="Abrir timer de descanso">
          <YStack
            width={52}
            height={52}
            borderRadius="$lg"
            borderCurve="continuous"
            alignItems="center"
            justifyContent="center"
            backgroundColor={restTimerIsActive ? '$successSubtle' : '$surfaceSecondary'}
            borderWidth={1}
            borderColor={restTimerIsActive ? '$success' : '$borderColor'}
          >
            <Animated.View style={hourglassAnimatedStyle as any}>
              <AppIcon icon={Hourglass} color={restTimerIsActive ? 'success' : 'color'} size={22} />
            </Animated.View>
            {restTimerIsActive && restDisplaySeconds > 0 && (
              <YStack
                position="absolute"
                top={2}
                right={2}
                width={18}
                height={18}
                borderRadius={9}
                backgroundColor="$success"
                alignItems="center"
                justifyContent="center"
              >
                <AppText variant="label" color="background" fontSize={FONT_SCALE.sizes[1]} fontWeight="700">
                  {Math.min(restDisplaySeconds, 99)}
                </AppText>
              </YStack>
            )}
          </YStack>
        </Pressable>

        <Pressable onPress={onNext} disabled={isFinishing} style={{ flex: 1 }} accessibilityLabel={isLast ? 'Finalizar entrenamiento' : 'Siguiente ejercicio'}>
          <XStack
            flex={1}
            height={52}
            borderRadius="$lg"
            borderCurve="continuous"
            alignItems="center"
            justifyContent="center"
            backgroundColor={isFinishing ? '$surfaceSecondary' : '$primary'}
            gap="$sm"
          >
            <AppText variant="bodyMd" color={isFinishing ? 'textTertiary' : 'background'} fontWeight="700">
              {isFinishing ? 'Guardando...' : isLast ? 'Finalizar' : 'Sig. Ejercicio'}
            </AppText>
            {!isFinishing && <AppIcon icon={ChevronRight} color="background" size={20} />}
          </XStack>
        </Pressable>
      </XStack>
    </YStack>
  );
}