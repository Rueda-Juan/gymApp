import React, { useState, useCallback } from 'react';
import { Pressable, ScrollView, View, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { FONT_SCALE } from '@/tamagui.config';
import { Play, Flame, Dumbbell, Clock, Activity } from 'lucide-react-native';
import { XStack, YStack, useTheme } from 'tamagui';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

import { CardBase as Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { AppIcon } from '@/components/ui/AppIcon';
import { useWorkout } from '@/hooks/useWorkout';
import { useRoutines } from '@/hooks/useRoutines';
import { useActiveWorkout } from '@/store/useActiveWorkout';
import { useUser } from '@/store/useUser';
import { getExerciseName } from '@/utils/exercise';
import { getWeeklyTrainingDays, calculateWeeklyStreak } from '@/utils/trainingWeek';
import { useStartWorkout } from '@/hooks/useStartWorkout';
import { ProfileSetupForm } from '@/components/onboarding/ProfileSetupForm';

const WEEK_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export default function HomeScreen() {
  const theme = useTheme();
  const workoutService = useWorkout();
  const routineService = useRoutines();
  const isActive = useActiveWorkout(s => s.isActive);
  const routineName = useActiveWorkout(s => s.routineName);
  const user = useUser((s) => s.user);
  const setUser = useUser((s) => s.setUser);

  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('');
  const [age, setAge] = useState('');

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    history: [] as any[],
    routines: [] as any[],
    stats: { streak: 0, weeklyCount: 0 },
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [history, routines] = await Promise.all([
        workoutService.getHistory(30),
        routineService.getRoutines(),
      ]);

      const routinesWithLastPerformed = routines.map((routine: any) => {
        const routineHistory = history.filter((w: any) => w.routineId === routine.id);
        if (!routineHistory.length) return { ...routine, lastPerformed: null };
        const latest = routineHistory.reduce((a: any, b: any) =>
          new Date(a.date) > new Date(b.date) ? a : b
        );
        return {
          ...routine,
          lastPerformed: formatDistanceToNow(new Date(latest.date), { addSuffix: true, locale: es }),
        };
      });

      setData({
        history: history.slice(0, 5),
        routines: routinesWithLastPerformed,
        stats: {
          streak: calculateWeeklyStreak(history),
          weeklyCount: history.filter((w: any) => new Date(w.date) > new Date(Date.now() - 7 * 86400000)).length,
        },
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [workoutService, routineService]);

  useFocusEffect(
    useCallback(() => {
      void loadData();
    }, [loadData])
  );

  const handleStartWorkout = useStartWorkout();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.background?.val }}>
        <ActivityIndicator size="large" color={theme.primary?.val} />
      </View>
    );
  }

  if (!user?.name) {
    return (
      <ProfileSetupForm
        name={name}
        setName={setName}
        gender={gender}
        setGender={setGender}
        age={age}
        setAge={setAge}
        onSubmit={() => {
          if (!name.trim()) {
            Alert.alert('Datos incompletos', 'Por favor, ingresa tu nombre.');
            return;
          }
          setUser({
            name: name.trim(),
            gender: gender || 'other',
            age: parseInt(age, 10) || null,
            createdAt: Date.now(),
          });
        }}
      />
    );
  }

  const lastWorkout = data.history[0];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background?.val }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$xl" paddingTop="$xl" paddingBottom="$lg">
          <Pressable onPress={() => router.push('/settings/profile')}>
            <YStack>
              <AppText variant="bodyLg" color="textSecondary">Bienvenido</AppText>
              <AppText variant="titleLg">{user.name}</AppText>
            </YStack>
          </Pressable>
        </XStack>

        {/* CTA */}
        <YStack paddingHorizontal="$xl" paddingBottom="$xl">
          {isActive ? (
            <Animated.View entering={FadeInUp.springify()}>
              <Pressable
                onPress={() => router.push('/(workouts)/active')}
                accessibilityLabel="Continuar entrenamiento en curso"
              >
                <YStack
                  backgroundColor="$primarySubtle"
                  borderWidth={1.5}
                  borderColor="$primary"
                  height={80}
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
            </Animated.View>
          ) : (
            <AppButton
              label="Nueva Sesión"
              icon={<AppIcon icon={Play} color="surface" fill='surface' size={24} />}
              onPress={() => router.push('/routines?source=home')}
            />
          )}
        </YStack>

        {/* Stats Row */}
        <XStack paddingHorizontal="$xl" gap="$md">
          <Card variant="outlined" flex={1} padding="$md">
            <XStack alignItems="center" gap="$xs" marginBottom="$sm">
              <AppIcon icon={Flame} color="primary" size={16} />
              <AppText variant="label" color="textSecondary">RACHA</AppText>
            </XStack>
            <AppText variant="titleMd">
              {data.stats.streak} <AppText variant="bodySm" color="textTertiary">días</AppText>
            </AppText>
          </Card>

          <Card variant="outlined" flex={1} padding="$md">
            <XStack alignItems="center" gap="$xs" marginBottom="$sm">
              <AppIcon icon={Activity} color="primary" size={16} />
              <AppText variant="label" color="textSecondary">ESTA SEMANA</AppText>
            </XStack>
            <AppText variant="titleMd">
              {data.stats.weeklyCount} <AppText variant="bodySm" color="textTertiary">entrenos</AppText>
            </AppText>
          </Card>
        </XStack>

        {/* Weekly Streak Circles */}
        <YStack paddingHorizontal="$xl" marginTop="$lg" marginBottom="$lg">
          <XStack justifyContent="center" gap="$sm">
            {getWeeklyTrainingDays(data.history).map((trained, i) => (
              <YStack key={i} alignItems="center" gap={4}>
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

        {/* Last Workout */}
        {lastWorkout && (
          <YStack gap="$md" marginBottom="$xl" paddingHorizontal="$xl" marginTop="$xl">
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$md">
              <AppText variant="titleSm">Último Entrenamiento</AppText>
              <Pressable onPress={() => router.push('/history')}>
                <AppText variant="bodyMd" color="primary" fontWeight="600">Ver todo</AppText>
              </Pressable>
            </XStack>

            <Pressable onPress={() => router.push({ pathname: '/(workouts)/summary', params: { id: lastWorkout.id } } as any)}>
              <Card padding="$none">
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
                      <AppText variant="bodySm" color="textTertiary"> min
                      </AppText>
                    </XStack>
                    <XStack alignItems="center" gap="$xs">
                      <AppIcon icon={Dumbbell} color="textSecondary" size={16} />
                      <AppText variant="bodySm" color="textSecondary">
                        {lastWorkout.exercises.length}
                      </AppText>
                      <AppText variant="bodySm" color="textTertiary"> ejercicios
                      </AppText>
                    </XStack>
                  </YStack>
                </XStack>
              </Card>
            </Pressable>
          </YStack>
        )}

        {/* Routines Carousel */}
        <YStack marginTop="$xl">
          <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$xl" marginBottom="$md">
            <AppText variant="titleSm">Mis Rutinas</AppText>
            <Pressable onPress={() => router.push('/routines')} accessibilityLabel="Ver todas las rutinas">
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
                onPress={() => router.push('/routine/create')}
              />
            </YStack>
          ) : (
            <YStack paddingHorizontal="$lg" paddingBottom="$md" gap="$md">
              {data.routines.map((routine: any) => (
                <Pressable
                  key={routine.id}
                  onPress={() => handleStartWorkout(routine)}
                  accessibilityLabel={`Iniciar rutina ${routine.name}`}
                >
                  <Card padding="$md" minHeight={88} borderWidth={1} borderColor="$borderColor">
                    <XStack alignItems="center" gap="$md">
                      <YStack flex={1}>
                        <AppText variant="titleSm" numberOfLines={1}>{routine.name}</AppText>
                        <AppText variant="label" color="textTertiary" marginTop="$xs">
                          {routine.lastPerformed ? `Hace ${routine.lastPerformed}` : 'Nunca'}
                        </AppText>
                        <AppText variant="bodySm" color="textSecondary" marginTop="$xs" numberOfLines={1}>
                          {routine.exercises.map((e: any) => getExerciseName(e.exercise || e)).join(' · ')}
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
                </Pressable>
              ))}
            </YStack>
          )}
        </YStack>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}