import { XStack, YStack, useTheme } from 'tamagui';
import React, { useEffect, useRef } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Square, Play, Plus, Minus } from 'lucide-react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue,
  FadeIn,
  FadeOut,
  SlideInUp,
} from 'react-native-reanimated';

import { useRestTimer } from '@/store/useRestTimer';
import { useSettings } from '@/store/useSettings';
import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { FONT_SCALE } from '@/tamagui.config';

const PRESETS = [
  { label: '30s', value: 30 },
  { label: '60s', value: 60 },
  { label: '90s', value: 90 },
  { label: '2m',  value: 120 },
  { label: '3m',  value: 180 },
];

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
  const hasNavigatedBackRef = useRef(false);
  const containerWidthSV = useSharedValue(0);
  const progress = useSharedValue(1);

  useEffect(() => {
    hasNavigatedBackRef.current = false;
  }, []);

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

  const handleAdjust = (delta: number) => {
    adjustTimer(delta);
    const currentRemaining = getRemainingSeconds();
    const safeMax = Math.max(progressMaxRef.current, 1);
    setRemaining(currentRemaining);
    progress.value = Math.min(1, Math.max(0, currentRemaining / safeMax));
    if (currentRemaining > progressMaxRef.current) {
      setProgressMax(currentRemaining);
    }
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
        if (!hasNavigatedBackRef.current) {
          hasNavigatedBackRef.current = true;
          router.back();
        }
        clearInterval(interval);
        return;
      }
      syncProgress();
    }, 200);

    return () => {
      clearInterval(interval);
    };
  }, [isActive, getRemainingSeconds, stopTimer, progress]);

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: containerWidthSV.value * progress.value,
  }));

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      {/* Backdrop */}
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(150)}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.65)' }}
          onPress={() => router.back()}
        />
      </Animated.View>

      {/* Floating card */}
      <Animated.View
        entering={SlideInUp.springify().damping(18).stiffness(200)}
        exiting={FadeOut.duration(150)}
        style={{ width: '100%', maxWidth: 380 }}
      >
        <YStack
          backgroundColor="$surface"
          borderRadius="$xl"
          overflow="hidden"
        >
        <YStack height={6} backgroundColor="$surfaceSecondary" width="100%"
          onLayout={(e) => { containerWidthSV.value = e.nativeEvent.layout.width; }}
        >
          <Animated.View 
            style={[
              { height: '100%', backgroundColor: theme.primary?.val as string },
              animatedProgressStyle
            ]} 
          />
        </YStack>

        <YStack alignItems="center" justifyContent="center" padding="$xl" gap="$lg">
          <AppText variant="label" color="textTertiary" style={{ letterSpacing: 2 }}>
            DESCANSO
          </AppText>
          
          <AppText variant="titleLg" fontSize={FONT_SCALE.sizes.hero} style={{ fontVariant: ['tabular-nums'] }}>
            {formatTime(remaining)}
          </AppText>

          <XStack gap="$sm" justifyContent="center" marginBottom="$md">
            {PRESETS.map(preset => {
              const isPresetActive = durationSeconds === preset.value;
              return (
                <Pressable
                  key={preset.value}
                  onPress={() => {
                    stopTimer();
                    startTimer(preset.value);
                    setProgressMax(preset.value);
                    setRemaining(preset.value);
                    progress.value = 1;
                  }}
                >
                  <YStack
                    paddingHorizontal="$sm"
                    paddingVertical={6}
                    borderRadius={100}
                    borderWidth={1}
                    backgroundColor={isPresetActive ? '$primarySubtle' : '$surfaceSecondary'}
                    borderColor={isPresetActive ? '$primary' : '$borderColor'}
                  >
                    <AppText
                      variant="label"
                      fontSize={FONT_SCALE.sizes[1]}
                      color={isPresetActive ? 'primary' : 'textSecondary'}
                      fontWeight={isPresetActive ? '700' : '500'}
                    >
                      {preset.label}
                    </AppText>
                  </YStack>
                </Pressable>
              );
            })}
          </XStack>

          <XStack alignItems="center" gap="$xl" marginTop="$md">
            <Pressable onPress={() => handleAdjust(-15)}>
              <YStack
                width={60} 
                height={60} 
                borderRadius={30}
                alignItems="center" 
                justifyContent="center"
                backgroundColor="$surfaceSecondary"
              >
                <AppIcon icon={Minus} color="color" size={24} />
                <AppText variant="label" color="textSecondary" fontSize={FONT_SCALE.sizes[1]}>-15s</AppText>
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

            <Pressable onPress={() => handleAdjust(15)}>
              <YStack
                width={60} 
                height={60} 
                borderRadius={30}
                alignItems="center" 
                justifyContent="center"
                backgroundColor="$surfaceSecondary"
              >
                <AppIcon icon={Plus} color="color" size={24} />
                <AppText variant="label" color="textSecondary" fontSize={FONT_SCALE.sizes[1]}>+15s</AppText>
              </YStack>
            </Pressable>
          </XStack>
        </YStack>
      </YStack>
        </Animated.View>
      </View>
  );
}