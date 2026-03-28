import { XStack, YStack } from 'tamagui';
import React, { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import { useTheme } from '@tamagui/core';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useLocalSearchParams, router } from 'expo-router';
import { Trophy, Clock, Dumbbell, Share2 } from 'lucide-react-native';

import { CardBase } from '@/components/ui/card';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { AppIcon } from '@/components/ui/AppIcon';
import { Screen } from '@/components/ui/Screen';
import { useWorkout } from '@/hooks/useWorkout';
import { getExerciseName } from '@/utils/exercise';

export default function WorkoutSummaryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const workoutService = useWorkout();

  const [workout, setWorkout] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWorkout = async () => {
      try { 
        setWorkout(await workoutService.getWorkoutById(id as string)); 
      } catch (e) { 
        console.error(e); 
      } finally { 
        setLoading(false); 
      }
    };

    if (id) loadWorkout();
  }, [id, workoutService]);

  const calculateTotalVolume = () => {
    if (!workout) return 0;
    return workout.exercises.reduce((acc: number, ex: any) =>
      acc + ex.sets.reduce((sAcc: number, s: any) => sAcc + (s.weight * s.reps), 0), 0);
  };

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator size="large" color={theme.primary?.val as string} />
      </Screen>
    );
  }

  return (
    <Screen safeAreaEdges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>

        <Animated.View entering={FadeInDown.delay(200).duration(800)}>
          <YStack alignItems="center" marginVertical="$3xl">
            <YStack
              width={120}
              height={120}
              borderRadius="$circle"
              justifyContent="center"
              alignItems="center"
              backgroundColor="$goldSubtle"
              marginBottom="$md"
            >
              <AppIcon icon={Trophy} size={60} color="gold" />
            </YStack>
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

        <Animated.View entering={FadeIn.delay(800)}>
          <AppText variant="titleSm" marginBottom="$md">Resumen de Ejercicios</AppText>

          <YStack gap="$md">
            {workout.exercises.map((ex: any, exIdx: number) => (
              <Animated.View key={ex.id} entering={FadeInDown.delay(900 + (exIdx * 100)).springify()}>
                <CardBase padding="$md" marginBottom="$md">
                  <AppText variant="titleSm" marginBottom="$md">{getExerciseName(ex)}</AppText>

                  <YStack gap="$sm">
                    <XStack paddingBottom="$xs" borderBottomWidth={1} borderBottomColor="$borderColor">
                      <AppText variant="label" color="textTertiary" flex={1}>SET</AppText>
                      <AppText variant="label" color="textTertiary" flex={2} textAlign="center">PESO</AppText>
                      <AppText variant="label" color="textTertiary" flex={2} textAlign="center">REPS</AppText>
                      <AppText variant="label" color="textTertiary" flex={2} textAlign="right">VOL</AppText>
                    </XStack>

                    {ex.sets.map((set: any, sIdx: number) => (
                      <XStack key={sIdx} paddingVertical="$xs">
                        <AppText variant="bodySm" color="textSecondary" flex={1} fontWeight="700">{sIdx + 1}</AppText>
                        <AppText variant="bodySm" flex={2} textAlign="center">{set.weight} kg</AppText>
                        <AppText variant="bodySm" flex={2} textAlign="center">{set.reps}</AppText>
                        <AppText variant="bodySm" color="textSecondary" flex={2} textAlign="right">{set.weight * set.reps} kg</AppText>
                      </XStack>
                    ))}
                  </YStack>
                </CardBase>
              </Animated.View>
            ))}
          </YStack>
        </Animated.View>

        <YStack flex={1} />

        <YStack gap="$md" marginVertical="$3xl">
          <AppButton
            appVariant="outline"
            label="Compartir Progreso"
            icon={<AppIcon icon={Share2} size={20} color="color" />}
          />
          <AppButton
            label="Listo"
            onPress={() => router.replace('/(tabs)')}
          />
        </YStack>
      </ScrollView>
    </Screen>
  );
}