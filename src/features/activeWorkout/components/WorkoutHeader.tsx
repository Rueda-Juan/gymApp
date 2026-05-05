import React from 'react';
import { XStack, YStack, useTheme } from 'tamagui';
import { X, PenLine } from 'lucide-react-native';
import { AppText, AppIcon, IconButton } from '@/shared/ui';
import { useWindowDimensions, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, withTiming, withSequence, useSharedValue } from 'react-native-reanimated';
import { motion } from '@/shared/ui/theme/motion';
import { triggerLightHaptic, triggerSelectionHaptic } from '@/shared/lib/haptics';

const PRIMARY_FALLBACK = '#6366f1';

const PROGRESS_BAR_HEIGHT = 4;
const ROUTINE_NAME_MAX_WIDTH = 180;
const EXERCISE_COUNTER_MARGIN_TOP = 2;
const FLASH_BRIGHTNESS_PEAK = 0.6;

interface WorkoutHeaderProps {
  formattedTime: string;
  routineName: string;
  currentExerciseIndex: number;
  totalExercises: number;
  onCancel: () => void;
  onNotePress?: () => void;
  isFocusMode?: boolean;
  sessionNote?: string;
}

export function WorkoutHeader({
  formattedTime,
  routineName,
  currentExerciseIndex,
  totalExercises,
  onCancel,
  onNotePress,
  isFocusMode = false,
  sessionNote = '',
}: WorkoutHeaderProps) {
  const { width: containerWidth } = useWindowDimensions();
  const theme = useTheme();
  const primaryColor = (theme.primary?.val as string | undefined) ?? PRIMARY_FALLBACK;

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
          accessibilityLabel="Cancelar entrenamiento"
          testID="cancel-workout-button"
        />

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
            testID="workout-options-button"
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
        <Animated.View
          style={[
            styles.progressBar,
            { backgroundColor: primaryColor },
            progressAnimStyle,
          ]}
        >
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              styles.progressFlash,
              flashStyle,
            ]}
          />
        </Animated.View>
      </YStack>
    </YStack>
  );
}

const styles = StyleSheet.create({
  progressBar: {
    height: '100%',
  },
  progressFlash: {
    backgroundColor: 'white',
  },
});
