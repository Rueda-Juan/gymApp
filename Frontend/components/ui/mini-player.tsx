import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from '@tamagui/core';
import { useActiveWorkout } from '@/store/useActiveWorkout';
import { router } from 'expo-router';
import { ChevronRight, Activity } from 'lucide-react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getExerciseName } from '@/utils/exercise';
import { AppText } from './AppText';

export function MiniPlayer() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const { isActive, routineName, startTime, currentExerciseIndex, exercises } = useActiveWorkout();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive && startTime) {
      interval = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, startTime]);

  if (!isActive) return null;

  const currentExerciseObj = exercises[currentExerciseIndex];
  const currentExercise = currentExerciseObj ? getExerciseName(currentExerciseObj) : 'Entrenamiento en curso';

  const formatElapsedTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? hrs + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const bottomOffset = Platform.OS === 'ios' ? insets.bottom + 50 : 60;

  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      exiting={FadeOutDown.duration(300)}
      style={{
        position: 'absolute',
        left: 12,
        right: 12,
        bottom: bottomOffset,
        height: 56,
        borderRadius: 16,
        borderWidth: 1,
        backgroundColor: theme.surfaceSecondary?.val,
        borderColor: theme.borderColor?.val,
        shadowColor: theme.primary?.val,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
        overflow: 'hidden',
      }}
    >
      <TouchableOpacity
        style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 }}
        activeOpacity={0.8}
        onPress={() => router.push('/(workouts)/[active]')}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.primarySubtle?.val,
          }}
        >
          <Activity size={20} color={theme.primary?.val} />
        </View>

        <View style={{ flex: 1, marginHorizontal: 12, justifyContent: 'center' }}>
          <AppText variant="bodySm" color="textSecondary" style={{ fontWeight: '600' }} numberOfLines={1}>
            {routineName || 'Entrenamiento libre'}
          </AppText>
          <AppText variant="bodyMd" style={{ fontWeight: '700' }} numberOfLines={1}>
            {currentExercise}
          </AppText>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <AppText variant="bodySm" color="primary" tabularNums style={{ fontWeight: '700' }}>
            {formatElapsedTime(elapsedSeconds)}
          </AppText>
          <ChevronRight size={20} color={theme.textTertiary?.val} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
