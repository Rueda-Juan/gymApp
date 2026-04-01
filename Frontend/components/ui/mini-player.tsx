import React, { useEffect, useState } from 'react';
import { XStack, YStack } from 'tamagui';
import { useActiveWorkout } from '@/store/useActiveWorkout';
import { useRestTimer } from '@/store/useRestTimer';
import { router } from 'expo-router';
import { Activity } from 'lucide-react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { getExerciseName } from '@/utils/exercise';
import { formatRestDuration } from '@/utils/time';
import { AppText } from './AppText';
import { AppIcon } from './AppIcon';
import { AppButton } from './AppButton';
import { Platform } from 'react-native';

export function MiniPlayer() {
  const insets = useSafeAreaInsets();

  const isActive = useActiveWorkout(s => s.isActive);
  const workoutId = useActiveWorkout(s => s.workoutId);
  const currentExerciseName = useActiveWorkout(s => {
    const ex = s.exercises[s.currentExerciseIndex];
    return ex ? getExerciseName(ex) : 'Entrenamiento libre';
  });

  const restIsActive = useRestTimer(s => s.isActive);
  const restEndTime = useRestTimer(s => s.endTime);
  const [restSecondsLeft, setRestSecondsLeft] = useState(0);

  useEffect(() => {
    if (!restIsActive || !restEndTime) {
      setRestSecondsLeft(0);
      return;
    }
    const update = () => setRestSecondsLeft(Math.max(0, Math.ceil((restEndTime - Date.now()) / 1000)));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [restIsActive, restEndTime]);

  if (!isActive) return null;

  const handleRetomar = () => {
    if (Platform.OS !== 'web') {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (workoutId) {
      router.push({ pathname: '/(workouts)/[active]', params: { active: workoutId } } as any);
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      exiting={FadeOutDown.duration(300)}
      style={{
        position: 'absolute',
        left: 12,
        right: 12,
        bottom: insets.bottom + 60,
        zIndex: 100,
      }}
    >
      <XStack
        height="$miniPlayerHeight"
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
        elevation={Platform.OS === 'android' ? 6 : 0}
      >
        <YStack
          width="$iconButton"
          height="$iconButton"
          borderRadius="$md"
          borderCurve="continuous"
          alignItems="center"
          justifyContent="center"
          backgroundColor="$primarySubtle"
        >
          <AppIcon icon={Activity} size={20} color="primary" />
        </YStack>

        <AppText variant="bodyMd" color="color" numberOfLines={1} fontWeight="600" flex={1}>
          {currentExerciseName}
        </AppText>

        {restIsActive && (
          <AppText variant="titleSm" color="success" tabularNums>
            {formatRestDuration(restSecondsLeft)}
          </AppText>
        )}

        <AppButton
          appVariant="ghost"
          size="sm"
          label="Retomar"
          fullWidth={false}
          height={32}
          onPress={handleRetomar}
        />
      </XStack>
    </Animated.View>
  );
}
