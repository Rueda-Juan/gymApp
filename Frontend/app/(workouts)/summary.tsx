import { XStack, YStack } from 'tamagui';
import React, { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import { useTheme } from '@tamagui/core';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useLocalSearchParams, router } from 'expo-router';
import { Trophy, Clock, Dumbbell, Share2 } from 'lucide-react-native';
import { Card } from '@/components/ui/card';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { Screen } from '@/components/ui/Screen';
import { useWorkout } from '@/hooks/useWorkout';

export default function WorkoutSummaryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const workoutService = useWorkout();

  const [workout, setWorkout] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (id) loadWorkout(); }, [id]);

  const loadWorkout = async () => {
    try { setWorkout(await workoutService.getById(id as string)); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const calculateTotalVolume = () => {
    if (!workout) return 0;
    return workout.exercises.reduce((acc: number, ex: any) =>
      acc + ex.sets.reduce((sAcc: number, s: any) => sAcc + (s.weight * s.reps), 0), 0);
  };

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator size="large" color={theme.primary?.val} />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>

        {/* Celebration Header */}
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
              <Trophy size={60} color={theme.gold?.val} />
            </YStack>
            <AppText variant="titleLg" marginTop="$lg">¡Entrenamiento Completo!</AppText>
            <AppText variant="bodyMd" color="textSecondary" marginTop="$sm">
              Has hecho un excelente trabajo hoy
            </AppText>
          </YStack>
        </Animated.View>

        {/* Highlight Stats */}
        <XStack gap="$md" marginBottom="$lg">
          <Animated.View entering={FadeInUp.delay(400)} style={{ flex: 1 }}>
            <Card style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={20} color={theme.primary?.val} />
              <AppText variant="titleMd" style={{ marginTop: 8 }}>
                {Math.floor(workout.durationSeconds / 60)}:{(workout.durationSeconds % 60).toString().padStart(2, '0')}
              </AppText>
              <AppText variant="label" color="textTertiary">DURACIÃ“N</AppText>
            </Card>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(600)} style={{ flex: 1 }}>
            <Card style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Dumbbell size={20} color={theme.primary?.val} />
              <AppText variant="titleMd" style={{ marginTop: 8 }}>{calculateTotalVolume()} kg</AppText>
              <AppText variant="label" color="textTertiary">VOLUMEN TOTAL</AppText>
            </Card>
          </Animated.View>
        </XStack>

        {/* Exercise Summary */}
        <Animated.View entering={FadeIn.delay(800)}>
          <AppText variant="titleSm" style={{ marginBottom: 12 }}>Resumen de Ejercicios</AppText>

          <YStack gap="$md">
            {workout.exercises.map((ex: any, exIdx: number) => (
              <Animated.View key={ex.id} entering={FadeInDown.delay(900 + (exIdx * 100)).springify()}>
                <Card style={{ padding: 16, marginBottom: 12 }}>
                  <AppText variant="titleSm" style={{ marginBottom: 12 }}>{ex.exerciseId}</AppText>

                  <YStack gap="$sm">
                    <XStack style={{ paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: theme.borderColor?.val }}>
                      <AppText variant="label" color="textTertiary" style={{ flex: 1 }}>SET</AppText>
                      <AppText variant="label" color="textTertiary" style={{ flex: 2, textAlign: 'center' }}>PESO</AppText>
                      <AppText variant="label" color="textTertiary" style={{ flex: 2, textAlign: 'center' }}>REPS</AppText>
                      <AppText variant="label" color="textTertiary" style={{ flex: 2, textAlign: 'right' }}>VOL</AppText>
                    </XStack>

                    {ex.sets.map((set: any, sIdx: number) => (
                      <XStack key={sIdx} style={{ paddingVertical: 4 }}>
                        <AppText variant="bodySm" color="textSecondary" style={{ flex: 1, fontWeight: '700' }}>{sIdx + 1}</AppText>
                        <AppText variant="bodySm" style={{ flex: 2, textAlign: 'center' }}>{set.weight} kg</AppText>
                        <AppText variant="bodySm" style={{ flex: 2, textAlign: 'center' }}>{set.reps}</AppText>
                        <AppText variant="bodySm" color="textSecondary" style={{ flex: 2, textAlign: 'right' }}>{set.weight * set.reps} kg</AppText>
                      </XStack>
                    ))}
                  </YStack>
                </Card>
              </Animated.View>
            ))}
          </YStack>
        </Animated.View>

        <YStack flex={1} />

        <YStack gap="$md" marginVertical="$3xl">
          <AppButton
            variant="outline"
            label="Compartir Progreso"
            icon={<Share2 size={20} color={theme.color?.val} />}
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
