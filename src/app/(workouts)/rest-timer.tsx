import { XStack, YStack, useTheme } from 'tamagui';
import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Square, Play, Plus, Minus } from 'lucide-react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue,
  FadeIn,
  FadeOut,
  SlideInUp,
} from 'react-native-reanimated';

import { useRestTimer, type RestTimerStore } from '@/features/activeWorkout';
import { useSettings } from '@/entities/settings';
import { AppText } from '@/shared/ui/AppText';
import { AppIcon } from '@/shared/ui/AppIcon';
import { FONT_SCALE } from '@/shared/ui/theme/tamagui.config';
import { motion } from '@/shared/constants/motion';
import { useMotion } from '@/shared/lib/hooks/useMotion';
import { formatRestDuration } from '@/shared/lib/time';

const TIMER_ADJUST_SECONDS = 15;
const PROGRESS_SYNC_INTERVAL_MS = 200;
const BACKDROP_COLOR = 'rgba(0,0,0,0.65)';

const PRESETS = [
  { label: '30s', value: 30 },
  { label: '60s', value: 60 },
  { label: '90s', value: 90 },
  { label: '2m',  value: 120 },
  { label: '3m',  value: 180 },
];

export default function RestTimerScreen() {
  const theme = useTheme();
  const m = useMotion();
  const isActive = useRestTimer((s: RestTimerStore) => s.isActive);
  const durationSeconds = useRestTimer((s: RestTimerStore) => s.durationSeconds);
  const getRemainingSeconds = useRestTimer((s: RestTimerStore) => s.getRemainingSeconds);
  const stopTimer = useRestTimer((s: RestTimerStore) => s.stopTimer);
  const adjustTimer = useRestTimer((s: RestTimerStore) => s.adjustTimer);
  const startTimer = useRestTimer((s: RestTimerStore) => s.startTimer);
  const restTimerSeconds = useSettings(s => s.restTimerSeconds);

  const [remaining, setRemaining] = useState(getRemainingSeconds());
  const progressMaxRef = useRef(Math.max(restTimerSeconds, durationSeconds || 0));
  const hasNavigatedBackRef = useRef(false);
  const containerWidthSV = useSharedValue(0);
  const progress = useSharedValue(1);

  useEffect(() => {
    hasNavigatedBackRef.current = false;
  }, []);

  useEffect(() => {
    if (!isActive) {
      progressMaxRef.current = restTimerSeconds;
      return;
    }

    if (durationSeconds > 0) {
      progressMaxRef.current = Math.max(progressMaxRef.current, durationSeconds);
    }
  }, [isActive, durationSeconds, restTimerSeconds]);

  const startManualTimer = useCallback(() => {
    startTimer(restTimerSeconds);
    progressMaxRef.current = restTimerSeconds;
    setRemaining(restTimerSeconds);
    progress.value = 1;
  }, [restTimerSeconds, startTimer, progress]);

  // Toast fallback
  const showToast = (msg: string) => {
    if (typeof window !== 'undefined' && window.alert) window.alert(msg);
    // Si tienes un Toast global, reemplaza esto
  };

  const MIN_SECONDS = 15;

  const handleAdjust = useCallback((delta: number) => {
    const current = getRemainingSeconds();
    const next = current + delta;
    if (next < MIN_SECONDS) {
      showToast(`El tiempo mínimo es ${MIN_SECONDS} segundos.`);
      return;
    }
    adjustTimer(delta);
    const currentRemaining = getRemainingSeconds();
    const safeMax = Math.max(progressMaxRef.current, 1);
    setRemaining(currentRemaining);
    progress.value = Math.min(1, Math.max(0, currentRemaining / safeMax));
    if (currentRemaining > progressMaxRef.current) {
      progressMaxRef.current = currentRemaining;
    }
  }, [adjustTimer, getRemainingSeconds, progress]);

  const handleDecrease = useCallback(() => handleAdjust(-TIMER_ADJUST_SECONDS), [handleAdjust]);
  const handleIncrease = useCallback(() => handleAdjust(TIMER_ADJUST_SECONDS), [handleAdjust]);

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
    }, PROGRESS_SYNC_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, [isActive, getRemainingSeconds, stopTimer, progress]);

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: containerWidthSV.value * progress.value,
  }));

  return (
    <View style={styles.container}>
      {/* Backdrop */}
      <Animated.View
        entering={FadeIn.duration(motion.duration.normal)}
        exiting={FadeOut.duration(motion.duration.fast)}
        style={styles.absoluteFill}
      >
        <Pressable
          style={styles.backdrop}
          onPress={() => router.back()}
          accessibilityLabel="Cerrar temporizador"
        />
      </Animated.View>

      {/* Floating card */}
      <Animated.View
        entering={m.entering(SlideInUp.springify().damping(motion.spring.heavy.damping).stiffness(motion.spring.heavy.stiffness))}
        exiting={FadeOut.duration(motion.duration.fast)}
        style={styles.card}
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
              { height: '100%', backgroundColor: theme.primary?.val ?? '#007AFF' },
              animatedProgressStyle
            ]} 
          />
        </YStack>

        <YStack alignItems="center" justifyContent="center" padding="$xl" gap="$lg">
          <AppText variant="label" color="textTertiary" style={{ letterSpacing: 2 }}>
            DESCANSO
          </AppText>
          
          <AppText variant="titleLg" fontSize={FONT_SCALE.sizes.hero} style={{ fontVariant: ['tabular-nums'] }}>
            {formatRestDuration(remaining)}
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
                    progressMaxRef.current = preset.value;
                    setRemaining(preset.value);
                    progress.value = 1;
                  }}
                  accessibilityLabel={`Establecer temporizador en ${preset.label}`}
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
            <Pressable onPress={handleDecrease} accessibilityLabel={`Disminuir ${TIMER_ADJUST_SECONDS} segundos`}>
              <YStack
                width={60} 
                height={60} 
                borderRadius={30}
                alignItems="center" 
                justifyContent="center"
                backgroundColor="$surfaceSecondary"
              >
                <AppIcon icon={Minus} color="color" size={24} />
                <AppText variant="label" color="textSecondary" fontSize={FONT_SCALE.sizes[1]}>-{TIMER_ADJUST_SECONDS}s</AppText>
              </YStack>
            </Pressable>

            {isActive ? (
              <Pressable onPress={() => { stopTimer(); router.back(); }} accessibilityLabel="Detener temporizador">
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
              <Pressable onPress={startManualTimer} accessibilityLabel="Iniciar temporizador">
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

            <Pressable onPress={handleIncrease} accessibilityLabel={`Aumentar ${TIMER_ADJUST_SECONDS} segundos`}>
              <YStack
                width={60} 
                height={60} 
                borderRadius={30}
                alignItems="center" 
                justifyContent="center"
                backgroundColor="$surfaceSecondary"
              >
                <AppIcon icon={Plus} color="color" size={24} />
                <AppText variant="label" color="textSecondary" fontSize={FONT_SCALE.sizes[1]}>+{TIMER_ADJUST_SECONDS}s</AppText>
              </YStack>
            </Pressable>
          </XStack>
        </YStack>
      </YStack>
        </Animated.View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  absoluteFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  backdrop: { flex: 1, backgroundColor: BACKDROP_COLOR },
  card: { width: '100%', maxWidth: 380 },
});

