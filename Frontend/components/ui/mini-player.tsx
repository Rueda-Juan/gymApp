import React, { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import { XStack, YStack } from 'tamagui';
import { useActiveWorkout } from '@/store/useActiveWorkout';
import { router } from 'expo-router';
import { ChevronRight, Activity } from 'lucide-react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { getExerciseName } from '@/utils/exercise';
import { AppText } from './AppText';
import { AppIcon } from './AppIcon';

const formatElapsedTime = (seconds: number) => {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs > 0 ? hrs + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export function MiniPlayer() {
  const insets = useSafeAreaInsets();

  const isActive = useActiveWorkout(s => s.isActive);
  const routineName = useActiveWorkout(s => s.routineName);
  const startTime = useActiveWorkout(s => s.startTime);
  const currentExerciseIndex = useActiveWorkout(s => s.currentExerciseIndex);
  const exercises = useActiveWorkout(s => s.exercises);
  
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!isActive || !startTime) {
      setElapsedSeconds(0);
      return;
    }

    const updateTimer = () => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [isActive, startTime]);

  if (!isActive) return null;

  const currentExerciseObj = exercises[currentExerciseIndex];
  const currentExercise = currentExerciseObj ? getExerciseName(currentExerciseObj) : 'Entrenamiento libre';
  const displayRoutineName = routineName || 'Sesión actual';

  const bottomOffset = insets.bottom + 60;

  const handlePress = () => {
    if (process.env.EXPO_OS === 'ios') {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/(workouts)/[active]');
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      exiting={FadeOutDown.duration(300)}
      style={{
        position: 'absolute',
        left: 12,
        right: 12,
        bottom: bottomOffset,
        zIndex: 100,
      }}
    >
      <Pressable onPress={handlePress} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
        <XStack
          height={56}
          borderRadius="$xl"
          borderCurve="continuous"
          backgroundColor="$surfaceSecondary"
          borderColor="$borderColor"
          borderWidth={1}
          alignItems="center"
          paddingHorizontal="$md"
          gap="$md"
          shadowColor="$overlay"
          shadowOffset={{ width: 0, height: 4 }}
          shadowOpacity={0.15}
          shadowRadius={12}
        >
          <YStack
            width={40}
            height={40}
            borderRadius="$md"
            borderCurve="continuous"
            alignItems="center"
            justifyContent="center"
            backgroundColor="$primarySubtle"
          >
            <AppIcon icon={Activity} size={20} color="primary" />
          </YStack>

          <YStack flex={1} justifyContent="center">
            <AppText variant="bodySm" color="textSecondary" numberOfLines={1}>
              {displayRoutineName}
            </AppText>
            <AppText variant="subtitle" color="color" numberOfLines={1}>
              {currentExercise}
            </AppText>
          </YStack>

          <XStack alignItems="center" gap="$sm">
            <AppText variant="bodyMd" color="primary" tabularNums>
              {formatElapsedTime(elapsedSeconds)}
            </AppText>
            <AppIcon icon={ChevronRight} size={20} color="textTertiary" />
          </XStack>
        </XStack>
      </Pressable>
    </Animated.View>
  );
}