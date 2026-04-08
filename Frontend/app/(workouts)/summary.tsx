import { XStack, YStack } from 'tamagui';
import React, { useEffect, useCallback } from 'react';
import { ScrollView, ActivityIndicator, Share } from 'react-native';
import { useTheme } from '@tamagui/core';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useLocalSearchParams, router } from 'expo-router';
import { Trophy, Clock, Dumbbell, Share2, TrendingUp, TrendingDown } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import { CardBase } from '@/components/ui/card';
import { animatedCardShadow, elevation } from '@/constants/elevation';
import { AppText } from '@/components/ui/AppText';
import { AppButton, IconButton } from '@/components/ui/AppButton';
import { AppIcon } from '@/components/ui/AppIcon';
import { Screen } from '@/components/ui/Screen';
import { useRoutines } from '@/hooks/useRoutines';
import { useWorkoutSummary } from '../../store/useWorkoutSummary';
import { calculateExercisesVolume } from '@/utils/workout';
import { useStartWorkout } from '@/hooks/useStartWorkout';
import { getExerciseName } from '@/utils/exercise';
import { WorkoutExerciseSummaryList } from '@/components/workout/WorkoutExerciseSummaryList';
import { motion } from '@/constants/motion';
import { useMotion } from '@/hooks/useMotion';
import { useWorkoutSummaryData } from '@/hooks/useWorkoutSummaryData';
import type { SummaryWorkout, SummaryPersonalRecord } from '@/hooks/useWorkoutSummaryData';
import { ROUTES } from '@/constants/routes';
import { PRCelebrationOverlay } from '@/components/workout/PRCelebrationOverlay';

const SUMMARY_VOLUME_OPTIONS = { completedOnly: true, defaultCompleted: true } as const;

function PreviousWorkoutComparison({ current, previous }: { current: SummaryWorkout; previous: SummaryWorkout }) {
  const currentVolume = calculateExercisesVolume(current.exercises, SUMMARY_VOLUME_OPTIONS);
  const previousVolume = calculateExercisesVolume(previous.exercises, SUMMARY_VOLUME_OPTIONS);
  const volumeDelta = currentVolume - previousVolume;
  const minsDelta = Math.floor(current.durationSeconds / 60) - Math.floor(previous.durationSeconds / 60);
  const isVolumeUp = volumeDelta >= 0;
  const formatDelta = (val: number) => `${val >= 0 ? '+' : ''}${val}`;

  return (
    <Animated.View entering={FadeIn.delay(700)}>
      <XStack alignItems="center" gap="$sm" marginBottom="$lg" paddingHorizontal="$xs">
        <AppIcon
          icon={isVolumeUp ? TrendingUp : TrendingDown}
          size={16}
          color={isVolumeUp ? 'success' : 'danger'}
        />
        <AppText variant="bodySm" color="textSecondary">
          {`vs sesión anterior: ${formatDelta(volumeDelta)} kg · ${formatDelta(minsDelta)} min`}
        </AppText>
      </XStack>
    </Animated.View>
  );
}

export default function WorkoutSummaryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const m = useMotion();
  const theme = useTheme();
  const routineService = useRoutines();
  const startWorkoutFromRoutine = useStartWorkout('replace');
  const { workout, previousWorkout, loading } = useWorkoutSummaryData(id);
  const newRecords = useWorkoutSummary(s => s.newRecords) as SummaryPersonalRecord[];
  const clearNewRecords = useWorkoutSummary(s => s.clearNewRecords);
  const [showCelebration, setShowCelebration] = React.useState(false);

  useEffect(() => {
    if (!loading && newRecords.length > 0) {
      setTimeout(() => setShowCelebration(true), 500);
    }
  }, [loading, newRecords]);

  useEffect(() => () => clearNewRecords(), [clearNewRecords]);

  const calculateTotalVolume = useCallback(
    () => workout ? calculateExercisesVolume(workout.exercises, SUMMARY_VOLUME_OPTIONS) : 0,
    [workout],
  );

  const buildShareMessage = useCallback((w: SummaryWorkout) => {
    const volume = calculateExercisesVolume(w.exercises, SUMMARY_VOLUME_OPTIONS);
    const mins = Math.floor(w.durationSeconds / 60);
    const exerciseLines = w.exercises
      .map((ex) => {
        const completedSets = ex.sets.filter((s) => s.isCompleted ?? true);
        if (!completedSets.length) return null;
        const setsText = completedSets.map((s) => `${s.weight}kg×${s.reps}`).join(', ');
        const exerciseName = getExerciseName({ name: ex.name ?? '', nameEs: ex.nameEs });
        return `${exerciseName}: ${setsText}`;
      })
      .filter(Boolean)
      .join('\n');
    return `💪 ¡Entrenamiento completo!\n${mins} min · ${volume} kg de volumen total\n\n${exerciseLines}`;
  }, []);

  const handleShare = useCallback(async () => {
    if (!workout) return;
    try {
      await Share.share({ message: buildShareMessage(workout) });
    } catch {
      // Share cancelled or failed — non-critical
    }
  }, [buildShareMessage, workout]);

  const handleRepeat = useCallback(async () => {
    if (!workout?.routineId) return;
    try {
      const routine = await routineService.getRoutineById(workout.routineId);
      if (!routine) return;
      await startWorkoutFromRoutine(routine);
    } catch {
      Toast.show({ type: 'error', text1: 'Error al repetir entrenamiento', position: 'top' });
    }
  }, [workout, routineService, startWorkoutFromRoutine]);

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator size="large" color={theme.primary?.val ?? '#007AFF'} />
      </Screen>
    );
  }

  if (!workout) {
    return (
      <Screen>
        <YStack flex={1} alignItems="center" justifyContent="center" padding="$xl">
          <AppText variant="titleSm" color="textSecondary">No se encontró el entrenamiento</AppText>
          <AppButton label="Volver" onPress={() => router.replace(ROUTES.TABS_HOME)} style={{ marginTop: 16 }} />
        </YStack>
      </Screen>
    );
  }

  return (
    <Screen safeAreaEdges={['top', 'left', 'right']}>
      <XStack justifyContent="flex-end" paddingHorizontal="$lg" height={52} alignItems="center">
        <IconButton
          icon={<AppIcon icon={Share2} size={20} color="color" />}
          onPress={handleShare}
          accessibilityLabel="Compartir resumen"
        />
      </XStack>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>

        <Animated.View entering={m.entering(FadeInDown.delay(200).duration(motion.duration.hero))}>
          <YStack alignItems="center" marginVertical="$3xl">
            <Animated.View
              entering={FadeInDown.delay(300).duration(600).springify()}
              style={{
                width: 140,
                height: 140,
                borderRadius: 70,
                borderWidth: 2,
                borderColor: theme.gold?.val ?? '#FFD700',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
              }}
            >
              <YStack
                width={112}
                height={112}
                borderRadius={9999}
                justifyContent="center"
                alignItems="center"
                backgroundColor="$goldSubtle"
              >
                <AppIcon icon={Trophy} size={56} color="gold" />
              </YStack>
            </Animated.View>
            <AppText variant="titleLg" marginTop="$lg">¡Entrenamiento Completo!</AppText>
            <AppText variant="bodyMd" color="textSecondary" marginTop="$sm">
              Has hecho un excelente trabajo hoy
            </AppText>
          </YStack>
        </Animated.View>

        <XStack gap="$md" marginBottom="$lg">
          <Animated.View entering={FadeInUp.delay(400)} style={[{ flex: 1 }, animatedCardShadow]}>
            <CardBase alignItems="center" justifyContent="center" padding="$md" {...elevation.flat}>
              <AppIcon icon={Clock} size={20} color="primary" />
              <AppText variant="titleMd" marginTop="$sm">
                {Math.floor(workout.durationSeconds / 60)}:{(workout.durationSeconds % 60).toString().padStart(2, '0')}
              </AppText>
              <AppText variant="label" color="textTertiary">DURACIÓN</AppText>
            </CardBase>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(600)} style={[{ flex: 1 }, animatedCardShadow]}>
            <CardBase alignItems="center" justifyContent="center" padding="$md" {...elevation.flat}>
              <AppIcon icon={Dumbbell} size={20} color="primary" />
              <AppText variant="titleMd" marginTop="$sm">{calculateTotalVolume()} kg</AppText>
              <AppText variant="label" color="textTertiary">VOLUMEN TOTAL</AppText>
            </CardBase>
          </Animated.View>
        </XStack>

        {previousWorkout && (
          <PreviousWorkoutComparison current={workout} previous={previousWorkout} />
        )}

        <WorkoutExerciseSummaryList exercises={workout.exercises} newRecords={newRecords} />

        <YStack flex={1} />

        <YStack gap="$md" marginVertical="$3xl">
          <AppButton
            label="Listo"
            onPress={() => router.replace(ROUTES.TABS)}
          />
          {workout?.routineId && (
            <AppButton
              appVariant="ghost"
              label="Repetir este entrenamiento →"
              onPress={handleRepeat}
            />
          )}
        </YStack>
      </ScrollView>
      <PRCelebrationOverlay 
        visible={showCelebration} 
        onFinished={() => setShowCelebration(false)} 
      />
    </Screen>
  );
}