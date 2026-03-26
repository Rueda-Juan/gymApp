import { XStack, YStack } from 'tamagui';
import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '@tamagui/core';
import { Screen } from '@/components/ui/Screen';
import { router } from 'expo-router';
import { History, Calendar, Clock, Dumbbell, ChevronRight, Search, Trash2 } from 'lucide-react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { CardBase } from '@/components/ui/card';
import { AppText } from '@/components/ui/AppText';
import { useWorkout } from '@/hooks/useWorkout';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { HistoryCardSkeleton } from '@/components/feedback/skeleton-loader';
import { AppInput } from '@/components/ui/AppInput';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { getExerciseName } from '@/utils/exercise';

export default function HistoryScreen() {
  const theme = useTheme();
  const workoutService = useWorkout();

  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { loadWorkouts(); }, []);

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      const data = await workoutService.getHistory(50);
      setWorkouts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const calculateVolume = (exercises: any[]) =>
    exercises.reduce((acc, ex) =>
      acc + ex.sets.reduce((sAcc: number, s: any) => sAcc + (s.weight * s.reps), 0), 0);

  const handleDeleteWorkout = (id: string, nameOrDate: string) => {
    Alert.alert(
      "Â¿Eliminar Entrenamiento?",
      `Se borrarÃ¡ "${nameOrDate}" y todo su progreso de estadÃ­sticas de forma irreversible.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await workoutService.deleteWorkout(id);
              setWorkouts(prev => prev.filter(w => w.id !== id));
            } catch (e) {
              console.error(e);
            }
          },
        },
      ]
    );
  };

  const renderRightActions = (id: string, nameOrDate: string) => (
    <TouchableOpacity
      style={{
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: theme.error?.val, width: 80,
        height: '100%', borderRadius: 12, marginLeft: 8,
      }}
      onPress={() => handleDeleteWorkout(id, nameOrDate)}
    >
      <Trash2 color="#FFF" size={24} />
    </TouchableOpacity>
  );

  const filteredWorkouts = workouts.filter(w => {
    if (!search) return true;
    const dateStr = format(new Date(w.date), 'EEEE d MMM yyyy', { locale: es }).toLowerCase();
    const nameMatch = w.name?.toLowerCase().includes(search.toLowerCase());
    const dateMatch = dateStr.includes(search.toLowerCase());
    const exerciseMatch = w.exercises.some((ex: any) =>
      ex.exercise && getExerciseName(ex.exercise).toLowerCase().includes(search.toLowerCase())
    );
    return nameMatch || dateMatch || exerciseMatch;
  });

  const renderWorkout = ({ item, index }: { item: any; index: number }) => {
    const title = `Entrenamiento de ${format(new Date(item.date), 'EEEE', { locale: es })}`;
    return (
      <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
        <Swipeable
          renderRightActions={() => renderRightActions(item.id, item.name || title)}
          overshootRight={false}
        >
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/(workouts)/summary', params: { id: item.id } } as any)}
          >
            <CardBase gap="$lg" padding="$md">
              <XStack justifyContent="space-between" alignItems="center">
                <YStack>
                  <AppText variant="bodyMd" style={{ fontWeight: '700' }}>{item.name || title}</AppText>
                  <XStack alignItems="center" gap="$xs" marginTop="$xs">
                    <Calendar size={12} color={theme.textTertiary?.val} />
                    <AppText variant="bodySm" color="textTertiary">
                      {format(new Date(item.date), 'd MMM, yyyy', { locale: es })}
                    </AppText>
                  </XStack>
                </YStack>
                <ChevronRight size={20} color={theme.textTertiary?.val} />
              </XStack>

              <XStack alignItems="center" gap="$lg" marginTop="$sm">
                <XStack alignItems="center" gap="$xs">
                  <Clock size={14} color={theme.primary?.val} />
                  <AppText variant="bodySm" color="textSecondary">
                    {Math.floor(item.durationSeconds / 60)} min
                  </AppText>
                </XStack>
                <XStack alignItems="center" gap="$xs">
                  <Dumbbell size={14} color={theme.primary?.val} />
                  <AppText variant="bodySm" color="textSecondary">
                    {calculateVolume(item.exercises)} kg
                  </AppText>
                </XStack>
                <XStack alignItems="center" gap="$xs">
                  <History size={14} color={theme.primary?.val} />
                  <AppText variant="bodySm" color="textSecondary">
                    {item.exercises.length} ej.
                  </AppText>
                </XStack>
              </XStack>
</CardBase>
          </TouchableOpacity>
        </Swipeable>
      </Animated.View>
    );
  };

  return (
    <Screen>
      <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$xl" paddingTop="$lg" paddingBottom="$sm">
        <AppText variant="titleLg">Historial</AppText>
      </XStack>

      <YStack paddingHorizontal="$lg" paddingBottom="$md">
        <XStack
          alignItems="center"
          gap="$sm"
          style={{
            height: 48, borderRadius: 12, borderWidth: 1, paddingHorizontal: 12,
            backgroundColor: theme.surface?.val, borderColor: theme.borderColor?.val,
          }}
        >
          <Search size={20} color={theme.textTertiary?.val} />
          <AppInput
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar por fecha, nombre o ejercicio..."
            style={{ flex: 1, marginLeft: 8 }}
          />
        </XStack>
      </YStack>

      {loading ? (
        <YStack paddingHorizontal="$xl">
          <HistoryCardSkeleton />
          <HistoryCardSkeleton />
          <HistoryCardSkeleton />
          <HistoryCardSkeleton />
        </YStack>
      ) : (
        <FlatList
          data={filteredWorkouts}
          renderItem={renderWorkout}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListEmptyComponent={() => (
            <YStack alignItems="center" justifyContent="center" marginTop="$5xl">
              <History size={48} color={theme.surfaceSecondary?.val} />
              <AppText variant="bodyMd" color="textTertiary" style={{ marginTop: 12 }}>
                No hay entrenamientos guardados aún
              </AppText>
            </YStack>
          )}
        />
      )}
    </Screen>
  );
}
