import { XStack, YStack } from 'tamagui';
import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, ActivityIndicator, Share } from 'react-native';
import { useTheme } from '@tamagui/core';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useLocalSearchParams, router } from 'expo-router';
import { Trophy, Clock, Dumbbell, Share2, TrendingUp, TrendingDown } from 'lucide-react-native';

import { CardBase } from '@/components/ui/card';
import { AppText } from '@/components/ui/AppText';
import { AppButton, IconButton } from '@/components/ui/AppButton';
import { AppIcon } from '@/components/ui/AppIcon';
import { Screen } from '@/components/ui/Screen';
import { useWorkout } from '@/hooks/useWorkout';
import { useRoutines } from '@/hooks/useRoutines';
import { useWorkoutSummary } from '../../store/useWorkoutSummary';
import { calculateExercisesVolume } from '@/utils/workout';
import { useStartWorkout } from '@/hooks/useStartWorkout';
import { getExerciseName } from '@/utils/exercise';
import { WorkoutExerciseSummaryList } from '@/components/workout/WorkoutExerciseSummaryList';

interface SummaryPersonalRecord {
  exerciseId: string;
  recordType: string;
  value: number;
}

interface SummarySet {
  id: string;
  weight: number;
  reps: number;
  isCompleted?: boolean;
}

interface SummaryExercise {
  id: string;
  exerciseId: string;
  name?: string;
  nameEs?: string | null;
  supersetGroup?: number | null;
  sets: SummarySet[];
}

interface SummaryWorkout {
  id: string;
  routineId: string | null;
  date: string | Date;
  durationSeconds: number;
  exercises: SummaryExercise[];
}

const SUMMARY_VOLUME_OPTIONS = { completedOnly: true, defaultCompleted: true } as const;

export default function WorkoutSummaryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const workoutService = useWorkout();
  const routineService = useRoutines();
  const startWorkoutFromRoutine = useStartWorkout('replace');
  const newRecords = useWorkoutSummary(s => s.newRecords) as SummaryPersonalRecord[];
  const clearNewRecords = useWorkoutSummary(s => s.clearNewRecords);

  const [workout, setWorkout] = useState<SummaryWorkout | null>(null);
  const [previousWorkout, setPreviousWorkout] = useState<SummaryWorkout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWorkout = async () => {
      try { 
        setWorkout((await workoutService.getWorkoutById(id as string)) as SummaryWorkout | null); 
      } catch (e) { 
        console.error(e); 
      } finally { 
        setLoading(false); 
      }
    };

    if (id) loadWorkout();
  }, [id, workoutService]);

  useEffect(() => () => clearNewRecords(), [clearNewRecords]);

  useEffect(() => {
    const loadPreviousWorkout = async () => {
      try {
        if (!workout?.date) return;

        const history = await workoutService.getHistory(200);
        const currentWorkoutDate = new Date(workout.date).getTime();
        const previous = (history as SummaryWorkout[])
          .filter((entry) => entry.id !== workout.id)
          .filter((entry) => new Date(entry.date).getTime() < currentWorkoutDate)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] ?? null;

        setPreviousWorkout(previous);
      } catch (e) {
        console.warn('[Summary] failed to load previous workout:', e);
      }
    };
    if (id && workout) loadPreviousWorkout();
  }, [id, workout, workoutService]);

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
    } catch {}
  }, [buildShareMessage, workout]);

  const handleRepeat = useCallback(async () => {
    if (!workout?.routineId) return;
    try {
      const routine = await routineService.getRoutineById(workout.routineId);
      if (!routine) return;
      await startWorkoutFromRoutine(routine);
    } catch (e) {
      console.error(e);
    }
  }, [workout, routineService, startWorkoutFromRoutine]);

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator size="large" color={theme.primary?.val as string} />
      </Screen>
    );
  }

  if (!workout) {
    return (
      <Screen>
        <YStack flex={1} alignItems="center" justifyContent="center" padding="$xl">
          <AppText variant="titleSm" color="textSecondary">No se encontró el entrenamiento</AppText>
          <AppButton label="Volver" onPress={() => router.replace('/(tabs)/')} style={{ marginTop: 16 }} />
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
        />
      </XStack>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>

        <Animated.View entering={FadeInDown.delay(200).duration(800)}>
          <YStack alignItems="center" marginVertical="$3xl">
            <Animated.View
              entering={FadeInDown.delay(300).duration(600).springify()}
              style={{
                width: 140,
                height: 140,
                borderRadius: 70,
                borderWidth: 2,
                borderColor: theme.gold?.val as string,
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
              }}
            >
              <YStack
                width={112}
                height={112}
                borderRadius="$circle"
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
          <Animated.View entering={FadeInUp.delay(400)} style={{ flex: 1 }}>
            <CardBase alignItems="center" justifyContent="center" padding="$md">
              <AppIcon icon={Clock} size={20} color="primary" />
              <AppText variant="titleMd" marginTop="$sm">
                {Math.floor(workout.durationSeconds / 60)}:{(workout.durationSeconds % 60).toString().padStart(2, '0')}
              </AppText>
              <AppText variant="label" color="textTertiary">DURACIÓN</AppText>
            </CardBase>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(600)} style={{ flex: 1 }}>
            <CardBase alignItems="center" justifyContent="center" padding="$md">
              <AppIcon icon={Dumbbell} size={20} color="primary" />
              <AppText variant="titleMd" marginTop="$sm">{calculateTotalVolume()} kg</AppText>
              <AppText variant="label" color="textTertiary">VOLUMEN TOTAL</AppText>
            </CardBase>
          </Animated.View>
        </XStack>

        {previousWorkout && (() => {
          const prevVolume = calculateExercisesVolume(previousWorkout.exercises, SUMMARY_VOLUME_OPTIONS);
          const currVolume = calculateTotalVolume();
          const prevMins = Math.floor(previousWorkout.durationSeconds / 60);
          const currMins = Math.floor(workout.durationSeconds / 60);
          const volumeDelta = currVolume - prevVolume;
          const minsDelta = currMins - prevMins;
          const isVolumeUp = volumeDelta >= 0;
          return (
            <Animated.View entering={FadeIn.delay(700)}>
              <XStack alignItems="center" gap="$sm" marginBottom="$lg" paddingHorizontal="$xs">
                <AppIcon
                  icon={isVolumeUp ? TrendingUp : TrendingDown}
                  size={16}
                  color={isVolumeUp ? 'success' : 'danger'}
                />
                <AppText variant="bodySm" color="textSecondary">
                  {`vs sesión anterior: ${volumeDelta >= 0 ? '+' : ''}${volumeDelta} kg · ${minsDelta >= 0 ? '+' : ''}${minsDelta} min`}
                </AppText>
              </XStack>
            </Animated.View>
          );
        })()}

        <WorkoutExerciseSummaryList exercises={workout.exercises} newRecords={newRecords} />

        <YStack flex={1} />

        <YStack gap="$md" marginVertical="$3xl">
          <AppButton
            label="Listo"
            onPress={() => router.replace('/(tabs)')}
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
    </Screen>
  );
}