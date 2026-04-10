import React from 'react';
import { Pressable } from 'react-native';
import { XStack, YStack, useTheme } from 'tamagui';
import { useBottomBarHeightContext } from '@/context/BottomBarHeightContext';
import Animated, { type AnimatedStyle, FadeInDown } from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import { ChevronLeft, ChevronRight, Hourglass, PenLine } from 'lucide-react-native';
import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { FONT_SCALE } from '@/tamagui.config';
import { motion } from '@/constants/motion';
import { useMotion } from '@/hooks/ui/useMotion';
import { useBottomBarGestureAndAnimation } from '@/hooks/ui/useBottomBarGestureAndAnimation';
import { triggerLightHaptic, triggerSelectionHaptic } from '@/utils/haptics';
import { logEvent } from '@/utils/instrumentation';
import { elevation } from '@/constants/elevation';

const ACTION_BUTTON_SIZE = 52;
const BOUNCE_INTERVAL_MS = 8000;
const BOUNCE_OFFSET = -3;
const BOUNCE_DURATION_MS = 300;
const SWIPE_UP_THRESHOLD = -60;
const GESTURE_ACTIVE_OFFSET_Y: [number, number] = [-10, 10];
const GESTURE_FAIL_OFFSET_X: [number, number] = [-30, 30];
const HANDLE_WIDTH = 32;
const HANDLE_HEIGHT = 4;
const REST_BADGE_SIZE = 18;
const MAX_REST_DISPLAY = 99;
const SAFE_AREA_PADDING_BUFFER = 8;
const MIN_BOTTOM_PADDING = 24;

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
  onOpenPlateCalculator: () => void;
  nextExerciseName?: string | null;
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
  onOpenPlateCalculator,
  nextExerciseName,
}: ActiveWorkoutBottomBarProps) {
  const theme = useTheme();
  const { setBottomBarHeight } = useBottomBarHeightContext();
  const { handleAnimStyle, swipeUpGesture, handleColor } = useBottomBarGestureAndAnimation({
    insetsBottom,
    onOpenPlateCalculator
  });

  return (
    <YStack
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      backgroundColor="$surface"
      borderTopWidth={1}
      borderTopColor="$borderColor"
      paddingBottom={Math.max(insetsBottom + SAFE_AREA_PADDING_BUFFER, MIN_BOTTOM_PADDING)}
      paddingTop={0}
      paddingHorizontal="$xl"
      onLayout={(e) => {
        const measured = e.nativeEvent.layout.height;
        // include safe area inset supplied by parent
        setBottomBarHeight(Math.round(measured + insetsBottom));
      }}
    >
      {/* Forge Handle — tap or swipe up to open plate calculator */}
      <GestureDetector gesture={swipeUpGesture}>
        <Pressable
          onPress={onOpenPlateCalculator}
          style={{ alignItems: 'center', paddingVertical: 10 }}
          accessibilityLabel="Calculadora de discos"
          accessibilityHint="Toca o desliza hacia arriba para abrir"
          hitSlop={8}
        >
          <Animated.View
            style={[
              {
                width: HANDLE_WIDTH,
                height: HANDLE_HEIGHT,
                borderRadius: 99,
                backgroundColor: handleColor,
              },
              handleAnimStyle,
            ]}
          />
        </Pressable>
      </GestureDetector>

      <XStack alignItems="center" gap="$sm">
        <Pressable 
          onPress={() => {
            triggerLightHaptic();
            onPrev();
          }} 
          disabled={isFirst} 
          accessibilityLabel="Ejercicio anterior"
        >
          <YStack
            width={ACTION_BUTTON_SIZE}
            height={ACTION_BUTTON_SIZE}
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

        <Pressable 
          onPress={() => {
            triggerSelectionHaptic();
            onOpenNote();
          }} 
          accessibilityLabel="Nota de sesión"
        >
          <YStack
            width={ACTION_BUTTON_SIZE}
            height={ACTION_BUTTON_SIZE}
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

        <Pressable 
          onPress={() => {
            triggerSelectionHaptic();
            onOpenRestTimer();
          }} 
          accessibilityLabel="Abrir timer de descanso"
        >
          <YStack
            width={ACTION_BUTTON_SIZE}
            height={ACTION_BUTTON_SIZE}
            borderRadius="$lg"
            borderCurve="continuous"
            alignItems="center"
            justifyContent="center"
            backgroundColor={restTimerIsActive ? '$successSubtle' : '$surfaceSecondary'}
            borderWidth={1}
            borderColor={restTimerIsActive ? '$success' : '$borderColor'}
          >
            {/* Reanimated AnimatedStyle type workaround — style types don't match View */}
            <Animated.View style={hourglassAnimatedStyle as any}>
              <AppIcon icon={Hourglass} color={restTimerIsActive ? 'success' : 'color'} size={22} />
            </Animated.View>
            {restTimerIsActive && restDisplaySeconds > 0 && (
              <YStack
                position="absolute"
                top={2}
                right={2}
                width={REST_BADGE_SIZE}
                height={REST_BADGE_SIZE}
                borderRadius={REST_BADGE_SIZE / 2}
                backgroundColor="$success"
                alignItems="center"
                justifyContent="center"
              >
                <AppText variant="label" color="background" fontSize={FONT_SCALE.sizes[1]} fontWeight="700">
                  {Math.min(restDisplaySeconds, MAX_REST_DISPLAY)}
                </AppText>
              </YStack>
            )}
          </YStack>
        </Pressable>

        <AppButton
          flex={1}
          height={ACTION_BUTTON_SIZE}
          minWidth={120}
          maxWidth={320}
          appVariant={isFinishing ? 'ghost' : 'primary'}
          borderRadius="$lg"
          onPress={onNext}
          disabled={isFinishing}
          accessibilityLabel={isLast ? 'Finalizar entrenamiento' : 'Siguiente ejercicio'}
          label={isFinishing ? 'Guardando...' : isLast ? 'Finalizar' : 'Sig. Ejercicio'}
          iconRight={!isFinishing && !isLast ? <AppIcon icon={ChevronRight} color="background" size={20} /> : undefined}
          thermalBreathing={isLast && !isFinishing}
          fullWidth={false}
        />
      </XStack>

      {nextExerciseName && !isLast && (
        <YStack position="absolute" top={-32} left={0} right={0} alignItems="center">
          <Animated.View 
            key={nextExerciseName}
            entering={FadeInDown.duration(motion.duration.normal)}
          >
            <XStack 
              backgroundColor="$surface" 
              paddingHorizontal="$md" 
              paddingVertical={2} 
              borderRadius="$lg"
              borderWidth={1}
              borderColor="$borderColor"
              {...elevation.flat}
            >
              <AppText variant="label" color="textTertiary" fontSize={FONT_SCALE.sizes.micro} fontWeight="700">
                PRÓXIMO: <AppText variant="label" color="textSecondary">{nextExerciseName.toUpperCase()}</AppText>
              </AppText>
            </XStack>
          </Animated.View>
        </YStack>
      )}
    </YStack>
  );
}