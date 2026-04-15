import React, { useMemo, useCallback } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { FONT_SCALE } from '@/tamagui.config';
import { Play, Flame, Dumbbell, Clock, Activity } from 'lucide-react-native';
import { XStack, YStack, useTheme } from 'tamagui';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

import { CardBase as Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { AppIcon } from '@/components/ui/AppIcon';
import { PressableCard } from '@/components/ui/PressableCard';
import HomeHeader from '@/components/home/HomeHeader';
import HomeCTA from '@/components/home/HomeCTA';
import LastWorkoutCard from '@/components/home/LastWorkoutCard';
import AnimatedViewShared from '@/components/ui/AnimatedViewShared';
import { ContentReveal } from '@/components/feedback/ContentReveal';
import { DashboardSkeleton } from '@/components/layout/Loaders';
import { useActiveWorkout } from '@/store/useActiveWorkout';
import { useUser } from '@/store/useUser';
import { getWeeklyTrainingDays } from '@/utils/trainingWeek';
import { useStartWorkout } from '@/hooks/domain/useStartWorkout';
import { useHomeData, formatRoutineExercises } from '@/hooks/application/useHomeData';
import { ProfileSetupForm } from '@/components/onboarding/ProfileSetupForm';
import { elevation } from '@/constants/elevation';
import { ROUTES } from '@/constants/routes';

const WEEK_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const STAGGER_DELAY_MS = 80;
const MAX_STAGGER_MS = 320;
const BOTTOM_SPACER_HEIGHT = 100;
const CTA_HEIGHT = 80;

export default function HomeScreen() {
  const theme = useTheme();
  const isActive = useActiveWorkout(s => s.isActive);
  const routineName = useActiveWorkout(s => s.routineName);
  const user = useUser(s => s.user);
  const setUser = useUser(s => s.setUser);

  const { loading, data, lastWorkout } = useHomeData();
  const handleStartWorkout = useStartWorkout();

  const weeklyDays = useMemo(() => getWeeklyTrainingDays(data?.history ?? []), [data?.history]);

  const navigateToStats = useCallback(() => router.push(ROUTES.STATS), []);

  // `AnimatedViewShared` is a typed alias for Animated.View that accepts
  // the runtime-only `sharedTransitionTag` prop.

  if (!user?.name) {
    return <ProfileSetupForm onComplete={setUser} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background?.val }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <HomeHeader userName={user?.name} onEditProfile={() => router.push(ROUTES.SETTINGS_PROFILE)} />

        {/* CTA */}
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
          {/* Stats Row */}
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

          {/* Weekly Streak Circles */}
          <Animated.View entering={FadeInDown.delay(Math.min(STAGGER_DELAY_MS * 2, MAX_STAGGER_MS)).springify()}>
            <YStack paddingHorizontal="$xl" marginTop="$lg" marginBottom="$lg">
              <XStack justifyContent="center" gap="$sm">
                {weeklyDays.map((trained, i) => (
                  <YStack key={i} alignItems="center" gap={4} accessibilityLabel={`${WEEK_LABELS[i]}: ${trained ? 'entrenado' : 'sin actividad'}`}>
                    <YStack
                      width={28}
                      height={28}
                      borderRadius={14}
                      backgroundColor={trained ? '$primary' : '$surfaceSecondary'}
                      borderWidth={trained ? 0 : 1}
                      borderColor="$borderColor"
                    />
                    <AppText variant="label" color="textTertiary" fontSize={FONT_SCALE.sizes[1]}>
                      {WEEK_LABELS[i]}
                    </AppText>
                  </YStack>
                ))}
              </XStack>
            </YStack>
          </Animated.View>

          {/* Last Workout */}
          {lastWorkout && (
            <Animated.View entering={FadeInDown.delay(Math.min(STAGGER_DELAY_MS * 3, MAX_STAGGER_MS)).springify()}>
              <LastWorkoutCard
                lastWorkout={lastWorkout}
                onViewAll={() => router.push(ROUTES.HISTORY)}
                onViewLast={() => router.push(`/(workouts)/summary?id=${lastWorkout.id}`)}
              />
            </Animated.View>
          )}

          {/* Routines Carousel */}
          <Animated.View entering={FadeInDown.delay(Math.min(STAGGER_DELAY_MS * 4, MAX_STAGGER_MS)).springify()}>
            <YStack marginTop="$xl">
              <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$xl" marginBottom="$md">
                <AppText variant="titleSm">Mis Rutinas</AppText>
                <Pressable onPress={() => router.push(ROUTES.ROUTINES)} accessibilityLabel="Ver todas las rutinas" accessibilityRole="button">
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
                    onPress={() => handleStartWorkout(routine)}
                    accessibilityLabel={`Iniciar rutina ${routine.name}`}
                  >
                    <Card padding="$md" minHeight={88} borderWidth={1} borderColor="$borderColor" {...elevation.flat}>
                      <XStack alignItems="center" gap="$md">
                        <YStack flex={1}>
                          <AnimatedViewShared sharedTransitionTag={`routine-title-${routine.id}`}>
                            <AppText variant="titleSm" numberOfLines={1}>{routine.name}</AppText>
                          </AnimatedViewShared>
                          <AppText variant="label" color="textTertiary" marginTop="$xs">
                            {routine.lastPerformed ? `Hace ${routine.lastPerformed}` : 'Nunca'}
                          </AppText>
                          <AppText variant="bodySm" color="textSecondary" marginTop="$xs" numberOfLines={1}>
                            {formatRoutineExercises(routine)}
                          </AppText>
                        </YStack>
                        <YStack
                          width={64}
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
  );
}