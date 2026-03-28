import { XStack, YStack, View } from 'tamagui';
import React, { useState, useEffect } from 'react';
import { Pressable, Alert, FlatList } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { router } from 'expo-router';
import { History, Calendar, Clock, Dumbbell, ChevronRight, Search, Trash2 } from 'lucide-react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { CardBase } from '@/components/ui/card';
import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { useWorkout } from '@/hooks/useWorkout';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { HistoryCardSkeleton } from '@/components/feedback/skeleton-loader';
import { AppInput } from '@/components/ui/AppInput';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { getExerciseName } from '@/utils/exercise';

export default function HistoryScreen() {
  const workoutService = useWorkout();

  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
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
    loadWorkouts();
  }, [workoutService]);

  const calculateVolume = (exercises: any[]) =>
    exercises.reduce((acc, ex) =>
      acc + ex.sets.reduce((sAcc: number, s: any) => sAcc + (s.weight * s.reps), 0), 0);

  const handleDeleteWorkout = (id: string, nameOrDate: string) => {
    Alert.alert(
      "¿Eliminar Entrenamiento?",
      `Se borrará "${nameOrDate}" y todo su progreso de estadísticas de forma irreversible.`,
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
    <Pressable
      style={{
        alignItems: 'center', 
        justifyContent: 'center',
        width: 80,
        height: '100%', 
      }}
      onPress={() => handleDeleteWorkout(id, nameOrDate)}
      accessibilityLabel="Eliminar entrenamiento"
    >
      <YStack 
        backgroundColor="$danger" 
        width="100%" 
        height="100%" 
        borderRadius="$lg" 
        borderCurve="continuous" 
        marginLeft="$sm" 
        alignItems="center" 
        justifyContent="center"
      >
        <AppIcon icon={Trash2} color="background" size={24} />
      </YStack>
    </Pressable>
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
          <Pressable
            onPress={() => router.push({ pathname: '/(workouts)/summary', params: { id: item.id } } as any)}
            accessibilityLabel={`Ver detalle de entrenamiento ${item.name}`}
          >
            <CardBase gap="$lg" padding="$md">
              <XStack justifyContent="space-between" alignItems="center">
                <YStack>
                  <AppText variant="bodyMd" fontWeight="700">{item.name || title}</AppText>
                  <XStack alignItems="center" gap="$xs" marginTop="$xs">
                    <AppIcon icon={Calendar} size={12} color="textTertiary" />
                    <AppText variant="bodySm" color="textTertiary">
                      {format(new Date(item.date), 'd MMM, yyyy', { locale: es })}
                    </AppText>
                  </XStack>
                </YStack>
                <AppIcon icon={ChevronRight} size={20} color="textTertiary" />
              </XStack>

              <XStack alignItems="center" gap="$lg" marginTop="$sm">
                <XStack alignItems="center" gap="$xs">
                  <AppIcon icon={Clock} size={14} color="primary" />
                  <AppText variant="bodySm" color="textSecondary">
                    {Math.floor(item.durationSeconds / 60)} min
                  </AppText>
                </XStack>
                <XStack alignItems="center" gap="$xs">
                  <AppIcon icon={Dumbbell} size={14} color="primary" />
                  <AppText variant="bodySm" color="textSecondary">
                    {calculateVolume(item.exercises)} kg
                  </AppText>
                </XStack>
                <XStack alignItems="center" gap="$xs">
                  <AppIcon icon={History} size={14} color="primary" />
                  <AppText variant="bodySm" color="textSecondary">
                    {item.exercises.length} ej.
                  </AppText>
                </XStack>
              </XStack>
            </CardBase>
          </Pressable>
        </Swipeable>
      </Animated.View>
    );
  };

  return (
    <Screen safeAreaEdges={['top', 'left', 'right']}>
      <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$lg" paddingTop="$lg" paddingBottom="$sm">
        <AppText variant="titleLg">Historial</AppText>
      </XStack>

      <YStack paddingHorizontal="$lg" paddingBottom="$md">
        <XStack
          alignItems="center"
          gap="$sm"
          height={48}
          borderRadius="$lg"
          borderWidth={1}
          paddingHorizontal="$md"
          backgroundColor="$surface"
          borderColor="$borderColor"
        >
          <AppIcon icon={Search} size={20} color="textTertiary" />
          <AppInput
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar por fecha o ejercicio..."
            flex={1}
            borderWidth={0}
            backgroundColor="transparent"
            paddingHorizontal={0}
            focusStyle={{ borderColor: 'transparent' }}
          />
        </XStack>
      </YStack>

      {loading ? (
        <YStack paddingHorizontal="$lg" gap="$md">
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
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          ItemSeparatorComponent={() => <View height="$md" />}
          ListEmptyComponent={() => (
            <YStack alignItems="center" justifyContent="center" marginTop="$10">
              <AppIcon icon={History} size={48} color="textTertiary" />
              <AppText variant="bodyMd" color="textTertiary" marginTop="$md">
                No hay entrenamientos guardados aún
              </AppText>
            </YStack>
          )}
        />
      )}
    </Screen>
  );
}