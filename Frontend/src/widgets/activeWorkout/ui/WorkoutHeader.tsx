import React from 'react';
import { XStack, YStack } from 'tamagui';
import { X, PenLine } from 'lucide-react-native';
import { AppText } from '@/shared/ui/AppText';
import { AppIcon } from '@/shared/ui/AppIcon';
import { IconButton } from '@/shared/ui/AppButton';
import { Pressable, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, withTiming, withSequence, useSharedValue } from 'react-native-reanimated';
import { motion } from '@/shared/ui/theme/motion';
import { triggerLightHaptic, triggerSelectionHaptic } from '@/shared/lib/haptics';

const AnimatedYStack = Animated.createAnimatedComponent(YStack);

const PROGRESS_BAR_HEIGHT = 4;
const ROUTINE_NAME_MAX_WIDTH = 180;
const EXERCISE_COUNTER_MARGIN_TOP = 2;
const FLASH_BRIGHTNESS_PEAK = 0.6;

interface WorkoutHeaderProps {
  formattedTime: string;
  routineName: string;
  currentExerciseIndex: number;
  totalExercises: number;
  isFocusMode: boolean;
  allSetsCompleted?: boolean;
  sessionNote?: string;
  onToggleFocus: () => void;
  onCancel: () => void;
  onFinish: () => void;
  onNotePress?: () => void;
}

export function WorkoutHeader({
  formattedTime,
  routineName,
  currentExerciseIndex,
  totalExercises,
  isFocusMode,
  allSetsCompleted = false,
  sessionNote,
  onToggleFocus,
  onCancel,
  onFinish,
  onNotePress,
}: WorkoutHeaderProps) {
  const { width: containerWidth } = useWindowDimensions();

  const progressWidth = totalExercises > 0 
    ? ((currentExerciseIndex + 1) / totalExercises) * 100 
    : 0;

  const progressAnim = useSharedValue(progressWidth);
  const flashOpacity = useSharedValue(0);
  const prevExerciseIndex = React.useRef(currentExerciseIndex);

  React.useEffect(() => {
    progressAnim.value = withSpring(progressWidth, motion.spring.bounce);

    const exerciseAdvanced = currentExerciseIndex > prevExerciseIndex.current;
    if (exerciseAdvanced) {
      flashOpacity.value = withSequence(
        withTiming(FLASH_BRIGHTNESS_PEAK, { duration: motion.duration.instant }),
        withTiming(0, { duration: motion.duration.normal })
      );
    }
    prevExerciseIndex.current = currentExerciseIndex;
  }, [progressWidth, progressAnim, currentExerciseIndex, flashOpacity]);

  const progressAnimStyle = useAnimatedStyle(() => ({
    width: (progressAnim.value / 100) * containerWidth,
  }));

  const flashStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
  }));

  return (
    <YStack backgroundColor="$background" zIndex={10}>
      <XStack
        alignItems="center"
        paddingHorizontal="$xl"
        paddingVertical="$sm"
      >
        {/* Botón cancelar a la izquierda */}
        <IconButton
          icon={<AppIcon icon={X} color="color" size={24} />}
          onPress={() => {
            triggerLightHaptic();
            onCancel();
          }}
          accessibilityLabel="Cancelar entrenamiento"          testID="Cancelar entrenamiento"        />

        {/* Centro: nombre, tiempo y cantidad de ejercicios */}
        <YStack flex={1} alignItems="center" justifyContent="center">
          <AppText variant="bodySm" color="textTertiary" tabularNums fontWeight="600">
            {formattedTime}
          </AppText>
          <AppText variant="titleSm" maxWidth={ROUTINE_NAME_MAX_WIDTH} numberOfLines={1}>
            {routineName}
          </AppText>
          <AppText variant="label" color="primary" marginTop={EXERCISE_COUNTER_MARGIN_TOP}>
            EJERCICIO {currentExerciseIndex + 1} DE {totalExercises}
          </AppText>
        </YStack>

        {/* Botón editar/nota a la derecha */}
        {onNotePress && !isFocusMode && (
          <IconButton
            icon={<AppIcon icon={PenLine} color={sessionNote ? 'primary' : 'textTertiary'} size={20} />}
            backgroundColor="transparent"
            onPress={() => {
              triggerSelectionHaptic();
              onNotePress();
            }}
            accessibilityLabel="Nota de sesión"
          />
        )}
      </XStack>

      <YStack height={PROGRESS_BAR_HEIGHT} backgroundColor="$borderColor" width="100%" accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: totalExercises, now: currentExerciseIndex + 1 }}>
        <AnimatedYStack
          height="100%"
          backgroundColor="$primary"
          style={progressAnimStyle}
        >
          <Animated.View
            style={[
              { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'white' },
              flashStyle,
            ]}
          />
        </AnimatedYStack>
      </YStack>
    </YStack>
  );
}
