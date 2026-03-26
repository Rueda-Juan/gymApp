import { XStack, YStack } from 'tamagui';
import React, { useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTheme } from '@tamagui/core';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRestTimer } from '@/store/useRestTimer';
import { Square, Play, Plus, Minus } from 'lucide-react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { AppText } from '@/components/ui/AppText';

export default function RestTimerScreen() {
  const theme = useTheme();
  const { isActive, durationSeconds, getRemainingSeconds, stopTimer, adjustTimer, startTimer } = useRestTimer();
  const remaining = getRemainingSeconds();
  const progress = useSharedValue(1);

  useEffect(() => {
    if (isActive && durationSeconds > 0) {
      const remainingPercent = getRemainingSeconds() / durationSeconds;
      progress.value = remainingPercent;
      progress.value = withTiming(0, {
        duration: getRemainingSeconds() * 1000,
        easing: Easing.linear,
      });
    }
  }, [isActive, durationSeconds]);

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'flex-end' }} edges={['bottom']}>
      <TouchableOpacity
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)' }}
        activeOpacity={1}
        onPress={() => router.back()}
      />

      <View
        style={{
          backgroundColor: theme.surface?.val,
          borderTopLeftRadius: 24, borderTopRightRadius: 24,
          paddingBottom: 20,
        }}
      >
        {/* Progress Bar */}
        <View style={{ height: 4, backgroundColor: theme.surfaceSecondary?.val, overflow: 'hidden', borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
          <Animated.View style={[{ height: '100%', backgroundColor: theme.primary?.val }, animatedProgressStyle]} />
        </View>

        <YStack alignItems="center" justifyContent="center" padding="$xl" gap="$lg">
          <AppText variant="label" color="textSecondary" style={{ letterSpacing: 1 }}>TIEMPO DE DESCANSO</AppText>
          <AppText variant="titleLg" style={{ fontSize: 64, fontVariant: ['tabular-nums'] as const }}>
            {formatTime(remaining)}
          </AppText>

          <XStack alignItems="center" gap="$xl" marginTop="$sm">
            <TouchableOpacity
              style={{
                width: 56, height: 56, borderRadius: 28,
                alignItems: 'center', justifyContent: 'center', gap: 4,
                backgroundColor: theme.surfaceSecondary?.val,
              }}
              onPress={() => adjustTimer(-10)}
            >
              <Minus color={theme.color?.val} size={24} />
              <AppText variant="label" color="textSecondary" style={{ fontSize: 12 }}>10s</AppText>
            </TouchableOpacity>

            {isActive ? (
              <TouchableOpacity
                style={{
                  width: 80, height: 80, borderRadius: 40,
                  alignItems: 'center', justifyContent: 'center',
                  backgroundColor: theme.dangerSubtle?.val,
                }}
                onPress={() => { stopTimer(); router.back(); }}
              >
                <Square color={theme.danger?.val} size={32} fill={theme.danger?.val} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  width: 80, height: 80, borderRadius: 40,
                  alignItems: 'center', justifyContent: 'center',
                  backgroundColor: theme.primary?.val,
                }}
                onPress={() => startTimer(90)}
              >
                <Play color="#FFF" size={32} fill="#FFF" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={{
                width: 56, height: 56, borderRadius: 28,
                alignItems: 'center', justifyContent: 'center', gap: 4,
                backgroundColor: theme.surfaceSecondary?.val,
              }}
              onPress={() => adjustTimer(10)}
            >
              <Plus color={theme.color?.val} size={24} />
              <AppText variant="label" color="textSecondary" style={{ fontSize: 12 }}>10s</AppText>
            </TouchableOpacity>
          </XStack>
        </YStack>
      </View>
    </SafeAreaView>
  );
}
