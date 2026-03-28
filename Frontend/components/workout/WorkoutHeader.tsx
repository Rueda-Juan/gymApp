import React from 'react';
import { XStack, YStack } from 'tamagui';
import { X, Eye, EyeOff } from 'lucide-react-native';
import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { IconButton } from '@/components/ui/AppButton';
import { Pressable } from 'react-native';

interface WorkoutHeaderProps {
  formattedTime: string;
  routineName: string;
  currentExerciseIndex: number;
  totalExercises: number;
  isFocusMode: boolean;
  onToggleFocus: () => void;
  onCancel: () => void;
  onFinish: () => void;
}

export function WorkoutHeader({
  formattedTime,
  routineName,
  currentExerciseIndex,
  totalExercises,
  isFocusMode,
  onToggleFocus,
  onCancel,
  onFinish
}: WorkoutHeaderProps) {
  // Evitamos división por cero o NaN
  const progressWidth = totalExercises > 0 
    ? ((currentExerciseIndex + 1) / totalExercises) * 100 
    : 0;

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
          <IconButton
            icon={isFocusMode ? <AppIcon icon={Eye} color="primary" size={22} /> : <AppIcon icon={EyeOff} color="textTertiary" size={22} />}
            backgroundColor={isFocusMode ? "$primarySubtle" : "transparent"}
            onPress={onToggleFocus}
          />
          <Pressable onPress={onFinish}>
            <YStack paddingHorizontal="$md" paddingVertical="$sm" borderRadius="$lg" backgroundColor="$primarySubtle">
              <AppText variant="bodySm" color="primary" fontWeight="700">Finalizar</AppText>
            </YStack>
          </Pressable>
        </XStack>
      </XStack>

      <YStack height={4} backgroundColor="$borderColor" width="100%">
        <YStack
          height="100%"
          backgroundColor="$primary"
          width={`${progressWidth}%`}
        />
      </YStack>
    </YStack>
  );
}