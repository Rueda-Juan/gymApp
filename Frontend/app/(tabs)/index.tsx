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

import { CardBase as Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { AppIcon } from '@/components/ui/AppIcon';
import { PressableCard } from '@/components/ui/PressableCard';
import { ContentReveal } from '@/components/feedback/ContentReveal';
import { DashboardSkeleton } from '@/components/layout/Loaders';
import { useActiveWorkout } from '@/store/useActiveWorkout';
import { useUser } from '@/store/useUser';
import { getWeeklyTrainingDays } from '@/utils/trainingWeek';
import { useStartWorkout } from '@/hooks/useStartWorkout';
import { useHomeData, formatRoutineExercises } from '@/hooks/useHomeData';
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

  const weeklyDays = useMemo(() => getWeeklyTrainingDays(data.history), [data.history]);

  const navigateToStats = useCallback(() => router.push(ROUTES.STATS), []);

  if (!user?.name) {
    return <ProfileSetupForm onComplete={setUser} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background?.val }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$xl" paddingTop="$xl" paddingBottom="$lg">
          <Pressable onPress={() => router.push(ROUTES.SETTINGS_PROFILE)} accessibilityLabel="Editar perfil">
            <YStack>
              <AppText variant="bodyLg" color="textSecondary">Bienvenido</AppText>
              <AppText variant="titleLg">{user?.name}</AppText>
            </YStack>
          </Pressable>
        </XStack>

        {/* CTA */}
        <Animated.View entering={FadeInDown.springify()}>
          <YStack paddingHorizontal="$xl" paddingBottom="$xl">
            {isActive ? (
              <Pressable
                onPress={() => router.push(ROUTES.ACTIVE_WORKOUT)}
                accessibilityLabel="Continuar entrenamiento en curso"
              >
                <YStack
                  backgroundColor="$primarySubtle"
                  borderWidth={1.5}
                  borderColor="$primary"
                  height={CTA_HEIGHT}
                  borderRadius="$lg"
                  borderCurve="continuous"
                  paddingHorizontal="$lg"
                  justifyContent="center"
                >
                  <XStack alignItems="center" gap="$sm">
                    <AppIcon icon={Activity} color="primary" size={20} />
                    <AppText variant="bodySm" color="primary" fontWeight="700">
                      ENTRENAMIENTO EN CURSO
                    </AppText>
                  </XStack>
                  <AppText variant="titleSm" color="primary" marginTop="$xs">
                    Continuar {routineName}
                  </AppText>
                </YStack>
              </Pressable>
            ) : (
              <AppButton
                label="Nueva Sesión"
                icon={<AppIcon icon={Play} color="surface" fill='surface' size={24} />}
                onPress={() => router.push(ROUTES.ROUTINES_FROM_HOME)}
                thermalBreathing
              />
            )}
          </YStack>
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
                    {data.stats.streak} <AppText variant="bodySm" color="textTertiary">días</AppText>
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
                    {data.stats.weeklyCount} <AppText variant="bodySm" color="textTertiary">entrenos</AppText>
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
              <YStack gap="$md" marginBottom="$xl" paddingHorizontal="$xl" marginTop="$xl">
                <XStack justifyContent="space-between" alignItems="center" marginBottom="$md">
                  <AppText variant="titleSm">Último Entrenamiento</AppText>
                  <Pressable onPress={() => router.push(ROUTES.HISTORY)} accessibilityLabel="Ver historial completo">
                    <AppText variant="bodyMd" color="primary" fontWeight="600">Ver todo</AppText>
                  </Pressable>
                </XStack>

                <PressableCard
                  onPress={() => router.push(`/(workouts)/summary?id=${lastWorkout.id}`)}
                  accessibilityLabel="Ver último entrenamiento"
                >
                  <Card padding="$none" {...elevation.flat}>
                    <XStack justifyContent="space-between" alignItems="center" padding="$md" borderBottomWidth={1} borderBottomColor="$borderColor">
                      <YStack>
                        <AppText variant="subtitle">Sesión de Entrenamiento</AppText>
                        <AppText variant="bodySm" color="textTertiary" marginTop="$xs">
                          {formatDistanceToNow(new Date(lastWorkout.date), { addSuffix: true, locale: es })}
                        </AppText>
                      </YStack>
                      <Badge label="ENTRENADO" variant="success" />
                    </XStack>
                    <XStack justifyContent="space-between" padding="$md">
                      <YStack gap="$xs">
                        <XStack alignItems="center" gap="$xs">
                          <AppIcon icon={Clock} color="textSecondary" strokeWidth={2} size={16} />
                          <AppText variant="bodySm" color="textSecondary">
                            {Math.floor(lastWorkout.durationSeconds / 60)}
                          </AppText>
                          <AppText variant="bodySm" color="textTertiary"> min</AppText>
                        </XStack>
                        <XStack alignItems="center" gap="$xs">
                          <AppIcon icon={Dumbbell} color="textSecondary" size={16} />
                          <AppText variant="bodySm" color="textSecondary">
                            {lastWorkout.exercises.length}
                          </AppText>
                          <AppText variant="bodySm" color="textTertiary"> ejercicios</AppText>
                        </XStack>
                      </YStack>
                    </XStack>
                  </Card>
                </PressableCard>
              </YStack>
            </Animated.View>
          )}

          {/* Routines Carousel */}
          <Animated.View entering={FadeInDown.delay(Math.min(STAGGER_DELAY_MS * 4, MAX_STAGGER_MS)).springify()}>
            <YStack marginTop="$xl">
              <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$xl" marginBottom="$md">
                <AppText variant="titleSm">Mis Rutinas</AppText>
                <Pressable onPress={() => router.push(ROUTES.ROUTINES)} accessibilityLabel="Ver todas las rutinas">
                  <AppText variant="bodyMd" color="primary" fontWeight="600">Ver todas</AppText>
            </Pressable>
          </XStack>

          {data.routines.length === 0 ? (
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
              {data.routines.map((routine, index) => (
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
                          {/* @ts-ignore - sharedTransitionTag exists at runtime */}
                          <Animated.View sharedTransitionTag={`routine-title-${routine.id}`}>
                            <AppText variant="titleSm" numberOfLines={1}>{routine.name}</AppText>
                          </Animated.View>
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