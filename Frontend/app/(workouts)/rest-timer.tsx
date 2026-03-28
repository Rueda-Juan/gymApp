import { XStack, YStack, useTheme } from 'tamagui';
import React, { useEffect } from 'react';
import { Pressable } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Square, Play, Plus, Minus } from 'lucide-react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  Easing, 
  cancelAnimation 
} from 'react-native-reanimated';

import { useRestTimer } from '@/store/useRestTimer';
import { useSettings } from '@/store/useSettings';
import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';

export default function RestTimerScreen() {
  const theme = useTheme();
  const isActive = useRestTimer(s => s.isActive);
  const durationSeconds = useRestTimer(s => s.durationSeconds);
  const getRemainingSeconds = useRestTimer(s => s.getRemainingSeconds);
  const stopTimer = useRestTimer(s => s.stopTimer);
  const adjustTimer = useRestTimer(s => s.adjustTimer);
  const startTimer = useRestTimer(s => s.startTimer);
  const restTimerSeconds = useSettings(s => s.restTimerSeconds);

  const [remaining, setRemaining] = React.useState(getRemainingSeconds());
  const [progressMax, setProgressMax] = React.useState(() => Math.max(restTimerSeconds, durationSeconds || 0));
  const progressMaxRef = React.useRef(progressMax);
  const progress = useSharedValue(1);

  useEffect(() => {
    progressMaxRef.current = progressMax;
  }, [progressMax]);

  useEffect(() => {
    if (!isActive) {
      setProgressMax(restTimerSeconds);
      return;
    }

    if (durationSeconds > 0) {
      setProgressMax(prev => Math.max(prev, durationSeconds));
    }
  }, [isActive, durationSeconds, restTimerSeconds]);

  const startManualTimer = () => {
    const initialDuration = restTimerSeconds;
    startTimer(initialDuration);
    setProgressMax(initialDuration);
    setRemaining(initialDuration);
    progress.value = 1;
  };

  useEffect(() => {
    if (!isActive) {
      setRemaining(0);
      progress.value = 1;
      return;
    }

    const syncProgress = () => {
      const currentRemaining = getRemainingSeconds();
      const safeMax = Math.max(progressMaxRef.current, 1);
      const ratio = currentRemaining / safeMax;

      setRemaining(Math.max(0, currentRemaining));
      progress.value = Math.min(1, Math.max(0, ratio));
    };

    syncProgress();

    const interval = setInterval(() => {
      const currentRemaining = getRemainingSeconds();
      if (currentRemaining <= 0) {
        setRemaining(0);
        progress.value = 0;
        stopTimer();
        router.back();
        clearInterval(interval);
        return;
      }
      syncProgress();
    }, 200);

    return () => {
      clearInterval(interval);
    };
  }, [isActive, getRemainingSeconds, stopTimer, progress]);

  const animatedProgressStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scaleX: progress.value },
        { translateX: -0.5 } 
      ] as any, // El cast a 'any' aquí es la forma más rápida de evitar el conflicto de tipos de TS en transforms de Reanimated
    };
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'flex-end' }} edges={['bottom']}>
      <Pressable
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)' }}
        onPress={() => router.back()}
      />

      <YStack
        backgroundColor="$surface"
        borderTopLeftRadius="$xl" 
        borderTopRightRadius="$xl"
        paddingBottom="$xl"
        overflow="hidden"
      >
        <YStack height={6} backgroundColor="$surfaceSecondary" width="100%">
          <Animated.View 
            style={[
              { height: '100%', backgroundColor: theme.primary?.val as string, width: '100%' },
              animatedProgressStyle
            ]} 
          />
        </YStack>

        <YStack alignItems="center" justifyContent="center" padding="$xl" gap="$lg">
          <AppText variant="label" color="textTertiary" style={{ letterSpacing: 2 }}>
            DESCANSO
          </AppText>
          
          <AppText variant="titleLg" fontSize={72} style={{ fontVariant: ['tabular-nums'] }}>
            {formatTime(remaining)}
          </AppText>

          <XStack alignItems="center" gap="$xl" marginTop="$md">
            <Pressable onPress={() => {
              adjustTimer(-10);

              const currentRemaining = getRemainingSeconds();
              const safeMax = Math.max(progressMaxRef.current, 1);
              setRemaining(currentRemaining);
              progress.value = Math.min(1, Math.max(0, currentRemaining / safeMax));

              if (currentRemaining > progressMaxRef.current) {
                setProgressMax(currentRemaining);
              }
            }}>
              <YStack
                width={60} 
                height={60} 
                borderRadius={30}
                alignItems="center" 
                justifyContent="center"
                backgroundColor="$surfaceSecondary"
              >
                <AppIcon icon={Minus} color="color" size={24} />
                <AppText variant="label" color="textSecondary" fontSize={10}>-10s</AppText>
              </YStack>
            </Pressable>

            {isActive ? (
              <Pressable onPress={() => { stopTimer(); router.back(); }}>
                <YStack
                  width={84} 
                  height={84} 
                  borderRadius={42}
                  alignItems="center" 
                  justifyContent="center"
                  backgroundColor="$dangerSubtle"
                >
                  <AppIcon icon={Square} color="danger" fill="danger" size={32} />
                </YStack>
              </Pressable>
            ) : (
              <Pressable onPress={startManualTimer}>
                <YStack
                  width={84} 
                  height={84} 
                  borderRadius={42}
                  alignItems="center" 
                  justifyContent="center"
                  backgroundColor="$primary"
                >
                  <AppIcon icon={Play} color="background" fill="background" size={32} />
                </YStack>
              </Pressable>
            )}

            <Pressable onPress={() => {
              adjustTimer(10);

              const currentRemaining = getRemainingSeconds();
              const safeMax = Math.max(progressMaxRef.current, 1);
              setRemaining(currentRemaining);
              progress.value = Math.min(1, Math.max(0, currentRemaining / safeMax));

              if (currentRemaining > progressMaxRef.current) {
                setProgressMax(currentRemaining);
              }
            }}>
              <YStack
                width={60} 
                height={60} 
                borderRadius={30}
                alignItems="center" 
                justifyContent="center"
                backgroundColor="$surfaceSecondary"
              >
                <AppIcon icon={Plus} color="color" size={24} />
                <AppText variant="label" color="textSecondary" fontSize={10}>+10s</AppText>
              </YStack>
            </Pressable>
          </XStack>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}