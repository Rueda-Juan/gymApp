import React from 'react';
import { XStack, YStack } from 'tamagui';
import { X, PenLine } from 'lucide-react-native';
import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { IconButton } from '@/components/ui/AppButton';
import { Pressable, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';

const AnimatedYStack = Animated.createAnimatedComponent(YStack);

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

  React.useEffect(() => {
    progressAnim.value = withSpring(progressWidth, { damping: 20, stiffness: 90 });
  }, [progressWidth, progressAnim]);

  const progressAnimStyle = useAnimatedStyle(() => ({
    width: (progressAnim.value / 100) * containerWidth,
  }));

  return (
    <YStack backgroundColor="$background" zIndex={10}>
      <XStack 
        justifyContent="space-between" 
        alignItems="center" 
        paddingHorizontal="$xl" 
        paddingVertical="$sm"
      >
        <IconButton 
          icon={<AppIcon icon={X} color="color" size={24} />} 
          onPress={onCancel} 
        />

        {onNotePress && !isFocusMode && (
          <IconButton
            icon={<AppIcon icon={PenLine} color={sessionNote ? 'primary' : 'textTertiary'} size={20} />}
            backgroundColor="transparent"
            onPress={onNotePress}
          />
        )}

        <YStack alignItems="center">
          <AppText variant="bodySm" color="textTertiary" tabularNums fontWeight="600">
            {formattedTime}
          </AppText>
          <AppText variant="titleSm" maxWidth={180} numberOfLines={1}>
            {routineName}
          </AppText>
          <AppText variant="label" color="primary" marginTop={2}>
            EJERCICIO {currentExerciseIndex + 1} DE {totalExercises}
          </AppText>
        </YStack>

        <XStack alignItems="center" gap="$sm">
          <Pressable onPress={onFinish}>
            <YStack
              paddingHorizontal="$md"
              paddingVertical="$sm"
              borderRadius="$lg"
              backgroundColor={allSetsCompleted ? '$primarySubtle' : '$surfaceSecondary'}
            >
              <AppText
                variant="bodySm"
                color={allSetsCompleted ? 'primary' : 'textSecondary'}
                fontWeight="700"
              >
                {allSetsCompleted ? 'Finalizar' : 'Cerrar'}
              </AppText>
            </YStack>
          </Pressable>
        </XStack>
      </XStack>

      <YStack height={4} backgroundColor="$borderColor" width="100%">
        <AnimatedYStack
          height="100%"
          backgroundColor="$primary"
          style={progressAnimStyle}
        />
      </YStack>
    </YStack>
  );
}