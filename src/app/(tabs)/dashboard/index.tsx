import React, { useMemo, useCallback } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack , XStack } from 'tamagui';
import { router } from 'expo-router';
import { Play, Flame, Activity } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { CardBase as Card, AppText, AppButton, AppIcon, PressableCard, AnimatedViewShared } from '@/shared/ui';
import { HomeHeader, HomeCTA, LastWorkoutCard } from '@/features/home';
import { ContentReveal } from '@/shared/ui/feedback';
import { DashboardSkeleton } from '@/shared/ui/layout/Loaders';
import { ProfileSetupForm } from '@/features/onboarding';

import { useActiveWorkout } from '@/entities/workout';
import { useUser } from '@/entities/settings';
import { getWeeklyTrainingDays } from '@/entities/stats';
import { useRoutineExercisesLabel } from '@/entities/routine';
import { useLastPerformedLabel } from '@/entities/workout';

import { useStartWorkout } from '@/features/activeWorkout';
import { useHomeData } from '@/features/dashboardSummary';

import { FONT_SCALE } from '@/shared/ui/theme/tamagui.config';
import { elevation } from '@/shared/constants/elevation';
import { ROUTES } from '@/shared/constants/routes';

const WEEK_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const STAGGER_DELAY_MS = 80;
const MAX_STAGGER_MS = 320;
const BOTTOM_SPACER_HEIGHT = 100;

export default function DashboardPage() {
  const isActive = useActiveWorkout(s => s.isActive);
  const routineName = useActiveWorkout(s => s.routineName);
  const user = useUser(s => s.user);
  const setUser = useUser(s => s.setUser);

  const { loading, data, lastWorkout } = useHomeData();
  const handleStartWorkoutRaw = useStartWorkout();
  
  const weeklyDays = useMemo(() => getWeeklyTrainingDays(data?.history ?? []), [data?.history]);
  const formatRoutineExercises = useRoutineExercisesLabel();
  const lastPerformedLabel = useLastPerformedLabel();

  const navigateToStats = useCallback(() => {
    Haptics.selectionAsync();
    router.push(ROUTES.STATS);
  }, []);

  if (user === undefined) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
        <AppText variant="titleMd">Cargando usuario...</AppText>
      </YStack>
    );
  }

  if (!user?.name) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
        <ProfileSetupForm onComplete={setUser} />
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <HomeHeader userName={user?.name} onEditProfile={() => router.push(ROUTES.SETTINGS_PROFILE)} />

          <Animated.View entering={FadeInDown.springify()}>
            <HomeCTA
              isActive={isActive}
              routineName={routineName}
              onContinue={() => router.push(ROUTES.ACTIVE_WORKOUT)}
              onNewSession={() => router.push(ROUTES.ROUTINES_FROM_HOME)}
              onFreeSession={() => router.push(ROUTES.ACTIVE_WORKOUT)}
            />
          </Animated.View>

          <ContentReveal
            loading={loading}
            skeleton={<DashboardSkeleton />}
          >
            <Animated.View entering={FadeInDown.delay(STAGGER_DELAY_MS).springify()}>
              <XStack paddingHorizontal="$xl" gap="$md">
                <PressableCard onPress={navigateToStats} accessibilityLabel="Ver estadísticas de racha">
                  <Card variant="outlined" flex={1} padding="$md" {...elevation.flat}>
                    <XStack alignItems="center" gap="$xs" marginBottom="$sm">
                      <AppIcon icon={Flame} color="primary" size={16} />
                      <AppText variant="label" color="textSecondary">RACHA</AppText>
                    </XStack>
                    <AppText variant="titleMd">
                      {data?.stats?.streak ?? 0} <AppText variant="bodySm" color="textTertiary">días</AppText>
                    </AppText>
                  </Card>
                </PressableCard>

                <PressableCard onPress={navigateToStats} accessibilityLabel="Ver estadísticas semanales">
                  <Card variant="outlined" flex={1} padding="$md" {...elevation.flat}>
                    <XStack alignItems="center" gap="$xs" marginBottom="$sm">
                      <AppIcon icon={Activity} color="primary" size={16} />
                      <AppText variant="label" color="textSecondary">ESTA SEMANA</AppText>
                    </XStack>
                    <AppText variant="titleMd">
                      {data?.stats?.weeklyCount ?? 0} <AppText variant="bodySm" color="textTertiary">entrenos</AppText>
                    </AppText>
                  </Card>
                </PressableCard>
              </XStack>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(Math.min(STAGGER_DELAY_MS * 2, MAX_STAGGER_MS)).springify()}>
              <YStack paddingHorizontal="$xl" marginTop="$lg" marginBottom="$lg">
                <XStack justifyContent="center" gap="$sm">
                  {weeklyDays.map((trained, i) => (
                    <YStack
                      key={i}
                      alignItems="center"
                      gap="$xs"
                      accessibilityLabel={`${WEEK_LABELS[i]}: ${trained ? 'entrenado' : 'sin actividad'}`}
                    >
                      <Pressable
                        style={{ minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center' }}
                        accessibilityRole="button"
                        accessibilityLabel={`Día ${WEEK_LABELS[i]}: ${trained ? 'entrenado' : 'sin actividad'}`}
                        hitSlop={8}
                        disabled
                      >
                        <YStack
                          width="$lg"
                          height="$lg"
                          borderRadius="$lg"
                          backgroundColor={trained ? '$primary' : '$surfaceSecondary'}
                          borderWidth={trained ? 0 : 1}
                          borderColor="$borderColor"
                        />
                      </Pressable>
                      <AppText variant="label" color="textTertiary" fontSize={FONT_SCALE.sizes[1]}>
                        {WEEK_LABELS[i]}
                      </AppText>
                    </YStack>
                  ))}
                </XStack>
              </YStack>
            </Animated.View>

            {lastWorkout && (
              <Animated.View entering={FadeInDown.delay(Math.min(STAGGER_DELAY_MS * 3, MAX_STAGGER_MS)).springify()}>
                <LastWorkoutCard
                  lastWorkout={lastWorkout}
                  onViewAll={() => router.push(ROUTES.HISTORY)}
                  onViewLast={() => router.push(`/(workouts)/summary?id=${lastWorkout.id}`)}
                />
              </Animated.View>
            )}

            <Animated.View entering={FadeInDown.delay(Math.min(STAGGER_DELAY_MS * 4, MAX_STAGGER_MS)).springify()}>
              <YStack marginTop="$xl">
                <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$xl" marginBottom="$md">
                  <AppText variant="titleSm">Mis Rutinas</AppText>
                  <Pressable
                    onPress={() => {
                      Haptics.selectionAsync();
                      router.push(ROUTES.ROUTINES);
                    }}
                    accessibilityLabel="Ver todas las rutinas"
                    accessibilityRole="button"
                    hitSlop={8}
                  >
                    <AppText variant="bodyMd" color="primary" fontWeight="600">Ver todas</AppText>
                  </Pressable>
                </XStack>

                {(data?.routines?.length ?? 0) === 0 ? (
                  <YStack alignItems="center" justifyContent="center" padding="$xl" borderRadius="$lg" borderWidth={1} borderColor="$borderColor" backgroundColor="$surfaceSecondary" marginHorizontal="$xl">
                    <AppText variant="bodyMd" color="textSecondary" textAlign="center" marginBottom="$sm">
                      Aún no tienes rutinas guardadas. Empieza creando una para organizar tu entrenamiento.
                    </AppText>
                    <AppButton
                      label="Crear primera rutina"
                      onPress={() => router.push(ROUTES.ROUTINE_CREATE)}
                    />
                  </YStack>
                ) : (
                  <YStack paddingHorizontal="$lg" paddingBottom="$md" gap="$md">
                    {(data?.routines ?? []).map((routine, index) => (
                      <Animated.View
                        key={routine.id}
                        entering={FadeInDown.delay(Math.min(index * STAGGER_DELAY_MS, MAX_STAGGER_MS)).springify()}
                      >
                        <PressableCard
                          onPress={() => handleStartWorkoutRaw({ 
                            id: routine.id,
                            name: routine.name,
                            exercises: (routine.exercises ?? []).map(re => ({
                              exercise: re.exercise,
                              targetSets: re.targetSets ?? 3,
                              maxReps: re.targetReps ?? 10,
                              supersetGroup: re.supersetGroup ? Number(re.supersetGroup) : null
                            }))
                          })}
                          accessibilityLabel={`Iniciar rutina ${routine.name}`}
                        >
                          <Card padding="$md" minHeight="$2xl" borderWidth={1} borderColor="$borderColor" {...elevation.flat}>
                            <XStack alignItems="center" gap="$md">
                              <YStack flex={1}>
                                <AnimatedViewShared sharedTransitionTag={`routine-title-${routine.id}`}>
                                  <AppText variant="titleSm" numberOfLines={1}>{routine.name}</AppText>
                                </AnimatedViewShared>
                                <AppText variant="label" color="textTertiary" marginTop="$xs">
                                  {lastPerformedLabel(routine)}
                                </AppText>
                                <AppText variant="bodySm" color="textSecondary" marginTop="$xs" numberOfLines={1}>
                                  {formatRoutineExercises(routine)}
                                </AppText>
                              </YStack>
                              <YStack
                                width="$2xl"
                                alignSelf="stretch"
                                alignItems="center"
                                justifyContent="center"
                                borderLeftWidth={1}
                                borderLeftColor="$borderColor"
                              >
                                <AppIcon icon={Play} color="primary" size={24} />
                              </YStack>
                            </XStack>
                          </Card>
                        </PressableCard>
                      </Animated.View>
                    ))}
                  </YStack>
                )}
              </YStack>
            </Animated.View>
          </ContentReveal>

          <View style={{ height: BOTTOM_SPACER_HEIGHT }} />
        </ScrollView>
      </SafeAreaView>
    </YStack>
  );
}
