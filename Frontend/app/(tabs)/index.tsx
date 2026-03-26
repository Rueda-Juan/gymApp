import { XStack, YStack } from 'tamagui';
import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '@tamagui/core';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { Play, Flame, Dumbbell, Clock, Activity, MoreHorizontal } from 'lucide-react-native';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AppText } from '@/components/ui/AppText';
import { AppButton, IconButton } from '@/components/ui/AppButton';
import { useWorkout } from '@/hooks/useWorkout';
import { useRoutines } from '@/hooks/useRoutines';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useActiveWorkout } from '@/store/useActiveWorkout';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { getExerciseName } from '@/utils/exercise';

export default function HomeScreen() {
  const theme = useTheme();
  const workoutService = useWorkout();
  const routineService = useRoutines();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    history: [] as any[],
    routines: [] as any[],
    stats: { streak: 0, weeklyCount: 0 },
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [history, routines] = await Promise.all([
        workoutService.getHistory(5),
        routineService.getAll(),
      ]);
      setData({
        history,
        routines,
        stats: {
          streak: history.length > 0 ? history.length : 0,
          weeklyCount: history.filter((w: any) => new Date(w.date) > new Date(Date.now() - 7 * 86400000)).length,
        },
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const activeWorkout = useActiveWorkout();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.background?.val }}>
        <ActivityIndicator size="large" color={theme.primary?.val} />
      </View>
    );
  }

  const lastWorkout = data.history[0];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background?.val }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$xl" paddingTop="$xl" paddingBottom="$lg">
          <YStack>
            <AppText variant="bodyLg" color="textSecondary">Hola de nuevo,</AppText>
            <AppText variant="titleLg">Juanchi</AppText>
          </YStack>
          <IconButton icon={<Dumbbell color={theme.primary?.val} size={24} />} />
        </XStack>

        {/* CTA */}
        <YStack paddingHorizontal="$xl" paddingBottom="$xl">
          {activeWorkout.isActive ? (
            <Animated.View entering={FadeInUp.springify()}>
              <TouchableOpacity
                activeOpacity={0.9}
                style={{
                  backgroundColor: theme.primary?.val,
                  height: 80, borderRadius: 12,
                  paddingHorizontal: 20, justifyContent: 'center',
                }}
                onPress={() => router.push('/(workouts)/active')}
              >
                <XStack alignItems="center" gap="$sm">
                  <Activity color="#fff" size={20} />
                  <AppText variant="bodySm" style={{ color: 'rgba(255,255,255,0.8)', fontWeight: '700' }}>
                    ENTRENAMIENTO EN CURSO
                  </AppText>
                </XStack>
                <AppText variant="titleSm" style={{ color: '#fff', marginTop: 4 }}>
                  Continuar {activeWorkout.routineName}
                </AppText>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <AppButton
              label="Nueva SesiÃ³n"
              icon={<Play fill="#fff" color="#fff" size={24} />}
              onPress={() => router.push('/routines')}
            />
          )}
        </YStack>

        {/* Stats Row */}
        <XStack paddingHorizontal="$xl" gap="$md">
          <Card style={{ flex: 1, padding: 12 }}>
            <XStack alignItems="center" gap="$xs" marginBottom="$sm">
              <Flame color={theme.primary?.val} size={16} />
              <AppText variant="label" color="textTertiary">RACHA</AppText>
            </XStack>
            <AppText variant="titleMd">
              {data.stats.streak} <AppText variant="bodySm" color="textTertiary">dÃ­as</AppText>
            </AppText>
          </Card>

          <Card style={{ flex: 1, padding: 12 }}>
            <XStack alignItems="center" gap="$xs" marginBottom="$sm">
              <Activity color={theme.primary?.val} size={16} />
              <AppText variant="label" color="textTertiary">ESTA SEMANA</AppText>
            </XStack>
            <AppText variant="titleMd">
              {data.stats.weeklyCount} <AppText variant="bodySm" color="textTertiary">entrenos</AppText>
            </AppText>
          </Card>
        </XStack>

        {/* Last Workout */}
        {lastWorkout && (
          <YStack gap="$md" marginBottom="$xl" paddingHorizontal="$xl" marginTop="$xl">
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$md">
              <AppText variant="titleSm">Ãšltimo Entrenamiento</AppText>
              <TouchableOpacity onPress={() => router.push('/history')}>
                <AppText variant="bodyMd" color="primary" style={{ fontWeight: '600' }}>Ver todo</AppText>
              </TouchableOpacity>
            </XStack>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push({ pathname: '/(workouts)/summary', params: { id: lastWorkout.id } } as any)}
            >
              <Card padding="none">
                <XStack justifyContent="space-between" alignItems="center" style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: theme.borderColor?.val }}>
                  <YStack>
                    <AppText variant="bodyLg" style={{ fontWeight: '700' }}>SesiÃ³n de Entrenamiento</AppText>
                    <AppText variant="bodySm" color="textSecondary" style={{ marginTop: 2 }}>
                      {formatDistanceToNow(new Date(lastWorkout.date), { addSuffix: true, locale: es })}
                    </AppText>
                  </YStack>
                  <Badge label="Completado" variant="primary" />
                </XStack>
                <XStack justifyContent="space-between" style={{ padding: 16 }}>
                  <YStack gap="$xs">
                    <XStack alignItems="center">
                      <Clock size={16} color={theme.textTertiary?.val} />
                      <AppText variant="bodySm" color="textSecondary" style={{ marginLeft: 8 }}>
                        {Math.floor(lastWorkout.durationSeconds / 60)} min
                      </AppText>
                    </XStack>
                    <XStack alignItems="center">
                      <Dumbbell size={16} color={theme.textTertiary?.val} />
                      <AppText variant="bodySm" color="textSecondary" style={{ marginLeft: 8 }}>
                        {lastWorkout.exercises.length} ejercicios
                      </AppText>
                    </XStack>
                  </YStack>
                </XStack>
              </Card>
            </TouchableOpacity>
          </YStack>
        )}

        {/* Routines Carousel */}
        <YStack marginTop="$xl">
          <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$xl" marginBottom="$md">
            <AppText variant="titleSm">Mis Rutinas</AppText>
            <Link href="/routines" asChild>
              <TouchableOpacity>
                <AppText variant="bodyMd" color="primary" style={{ fontWeight: '600' }}>Ver todas</AppText>
              </TouchableOpacity>
            </Link>
          </XStack>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
            snapToInterval={280 + 12}
            decelerationRate="fast"
          >
            {data.routines.map((routine: any) => (
              <Card key={routine.id} style={{ width: 280, padding: 16 }}>
                <XStack justifyContent="space-between" alignItems="center" marginBottom="$xs">
                  <AppText variant="titleSm" style={{ flex: 1 }} numberOfLines={1}>{routine.name}</AppText>
                  <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <MoreHorizontal color={theme.textTertiary?.val} size={20} />
                  </TouchableOpacity>
                </XStack>

                <AppText variant="bodySm" color="textSecondary" style={{ marginBottom: 12 }} numberOfLines={2}>
                  {routine.exercises.map((e: any) => getExerciseName(e.exercise || e)).join(' â€¢ ')}
                </AppText>

                <XStack justifyContent="space-between" alignItems="center" style={{ marginTop: 'auto' }}>
                  <AppText variant="label" color="textTertiary">{routine.exercises.length} Ejercicios</AppText>
                  <IconButton
                    icon={<Play color={theme.primary?.val} fill={theme.primary?.val} size={14} />}
                    size={32}
                    backgroundColor={theme.primarySubtle?.val}
                    onPress={() => router.push({ pathname: '/(workouts)/active', params: { routineId: routine.id } } as any)}
                  />
                </XStack>
              </Card>
            ))}
          </ScrollView>
        </YStack>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
