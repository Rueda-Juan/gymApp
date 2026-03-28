import React, { useState, useCallback } from 'react';
import { View, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { Play, Flame, Dumbbell, Clock, Activity, MoreHorizontal } from 'lucide-react-native';
import { XStack, YStack, useTheme } from 'tamagui';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

import { CardBase as Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AppText } from '@/components/ui/AppText';
import { AppInput } from '@/components/ui/AppInput';
import { AppButton, IconButton } from '@/components/ui/AppButton';
import { AppIcon } from '@/components/ui/AppIcon';
import { useWorkout } from '@/hooks/useWorkout';
import { useRoutines } from '@/hooks/useRoutines';
import { useActiveWorkout } from '@/store/useActiveWorkout';
import { useUser } from '@/store/useUser';
import { getExerciseName } from '@/utils/exercise';

export default function HomeScreen() {
  const theme = useTheme();
  const workoutService = useWorkout();
  const routineService = useRoutines();
  const activeWorkout = useActiveWorkout();
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
        workoutService.getHistory(5),
        routineService.getRoutines(),
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
  }, [workoutService, routineService]);

  useFocusEffect(
    useCallback(() => {
      void loadData();
    }, [loadData])
  );

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.background?.val }}>
        <ActivityIndicator size="large" color={theme.primary?.val} />
      </View>
    );
  }

  if (!user?.name) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background?.val }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
          <YStack alignItems="center" gap="$md">
            <AppText variant="titleLg" textAlign="center">Bienvenido a GymApp</AppText>
            <AppText variant="bodyMd" color="textSecondary" textAlign="center">Completa tu perfil antes de empezar</AppText>

            <AppInput placeholder="Nombre" value={name} onChangeText={setName} />
            <AppInput placeholder="Sexo (male/female/other)" value={gender} onChangeText={(value) => setGender(value as 'male' | 'female' | 'other' | '')} />
            <AppInput placeholder="Edad" keyboardType="numeric" value={age} onChangeText={setAge} />

            <AppButton
              label="Guardar perfil"
              onPress={() => {
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
          </YStack>
        </ScrollView>
      </SafeAreaView>
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
          <IconButton icon={<AppIcon icon={Dumbbell} color="primary" size={24} />} />
        </XStack>

        {/* CTA */}
        <YStack paddingHorizontal="$xl" paddingBottom="$xl">
          {activeWorkout.isActive ? (
            <Animated.View entering={FadeInUp.springify()}>
              <Pressable
                onPress={() => router.push('/(workouts)/active')}
                accessibilityLabel="Continuar entrenamiento en curso"
              >
                <YStack
                  backgroundColor="$primary"
                  height={80}
                  borderRadius="$lg"
                  borderCurve="continuous"
                  paddingHorizontal="$lg"
                  justifyContent="center"
                >
                  <XStack alignItems="center" gap="$sm">
                    <AppIcon icon={Activity} color="surface" size={20} />
                    <AppText variant="bodySm" color="surface" opacity={0.8} fontWeight="$7">
                      ENTRENAMIENTO EN CURSO
                    </AppText>
                  </XStack>
                  <AppText variant="titleSm" color="surface" marginTop="$xs">
                    Continuar {activeWorkout.routineName}
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
          <Card flex={1} padding="$md">
            <XStack alignItems="center" gap="$xs" marginBottom="$sm">
              <AppIcon icon={Flame} color="primary" size={16} />
              <AppText variant="label" color="textSecondary">RACHA</AppText>
            </XStack>
            <AppText variant="titleMd">
              {data.stats.streak} <AppText variant="bodySm" color="textTertiary">días</AppText>
            </AppText>
          </Card>

          <Card flex={1} padding="$md">
            <XStack alignItems="center" gap="$xs" marginBottom="$sm">
              <AppIcon icon={Activity} color="primary" size={16} />
              <AppText variant="label" color="textSecondary">ESTA SEMANA</AppText>
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
              <AppText variant="titleSm">Último Entrenamiento</AppText>
              <Pressable onPress={() => router.push('/history')}>
                <AppText variant="bodyMd" color="primary" fontWeight="$6">Ver todo</AppText>
              </Pressable>
            </XStack>

            <Pressable onPress={() => router.push({ pathname: '/(workouts)/summary', params: { id: lastWorkout.id } } as any)}>
              <Card padding="$none">
                <XStack justifyContent="space-between" alignItems="center" padding="$md" borderBottomWidth={1} borderBottomColor="$borderColor">
                  <YStack>
                    <AppText fontSize="$4" fontWeight="$7">Sesión de Entrenamiento</AppText>
                    <AppText fontSize="$2" color="textTertiary" marginTop="$xs">
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
            <Link href="/routines" asChild>
              <Pressable accessibilityLabel="Ver todas las rutinas">
                <AppText variant="bodyMd" color="primary" fontWeight="$6">Ver todas</AppText>
              </Pressable>
            </Link>
          </XStack>

          {data.routines.length === 0 ? (
            <YStack alignItems="center" justifyContent="center" padding="$xl" borderRadius="$lg" borderWidth={1} borderColor="$borderColor" backgroundColor="$surfaceSecondary" marginHorizontal="$xl">
              <AppText variant="bodyMd" color="textSecondary" textAlign="center" marginBottom="$sm">
                Aún no tienes rutinas guardadas. Empieza creando una para organizar tu entrenamiento.
              </AppText>
              <AppButton
                label="Crear primera rutina"
                onPress={() => router.push('/routines/create')}
              />
            </YStack>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
              snapToInterval={292}
              decelerationRate="fast"
            >
              {data.routines.map((routine: any) => (
                <Card key={routine.id} width={280} padding="$md">
                  <XStack justifyContent="space-between" alignItems="center" marginBottom="$xs">
                    <AppText variant="titleSm" fontWeight="$7" flex={1} numberOfLines={1}>{routine.name}</AppText>
                    <IconButton
                      icon={<AppIcon icon={MoreHorizontal} color="darkText" size={25} />}
                      size={44}
                      backgroundColor="$transparent"
                      onPress={() => router.push(`/routine/${routine.id}`)}
                    />
                  </XStack>

                  <AppText variant="bodySm" color="textSecondary" marginBottom="$md" numberOfLines={2}>
                    {routine.exercises.map((e: any) => getExerciseName(e.exercise || e)).join(' • ')}
                  </AppText>

                  <XStack justifyContent="space-between" alignItems="center" marginTop="auto">
                    <AppText variant="label" color="textTertiary">{routine.exercises.length} Ejercicios</AppText>
                    <IconButton
                      icon={<AppIcon icon={Play} color="primary" strokeWidth={3} size={22} />}
                      size={44}
                      backgroundColor="transparent"
                      onPress={() => router.push({ pathname: '/(workouts)/active', params: { routineId: routine.id } } as any)}
                    />
                  </XStack>
                </Card>
              ))}
            </ScrollView>
          )}
        </YStack>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}