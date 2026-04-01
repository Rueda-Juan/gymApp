import React, { useState, useRef, useCallback, useMemo } from 'react';
import { SectionList, Alert, TextInput, View } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, interpolate, runOnJS } from 'react-native-reanimated';
import { XStack, YStack } from 'tamagui';
import { Screen } from '@/components/ui/Screen';
import { useFocusEffect } from '@react-navigation/native';
import { History, Search, X } from 'lucide-react-native';
import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { IconButton } from '@/components/ui/AppButton';
import { useWorkout } from '@/hooks/useWorkout';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { HistoryCardSkeleton } from '@/components/feedback/skeleton-loader';
import { groupWorkoutsByPeriod } from '@/utils/historyGrouping';
import { SearchBar } from '@/components/ui/SearchBar';
import { HistoryWorkoutCard } from '@/components/cards/HistoryWorkoutCard';
import type { Workout } from 'backend/shared/types';

export default function HistoryScreen() {
  const workoutService = useWorkout();

  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);

  const searchAnim = useSharedValue(0);
  const searchInputRef = useRef<TextInput>(null);

  useFocusEffect(
    useCallback(() => {
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
    }, [workoutService])
  );

  const focusSearchInput = useCallback(() => {
    searchInputRef.current?.focus();
  }, []);

  const openSearch = useCallback(() => {
    setSearchVisible(true);
    searchAnim.value = withTiming(1, { duration: 200 }, () => {
      runOnJS(focusSearchInput)();
    });
  }, [searchAnim, focusSearchInput]);

  const closeSearch = useCallback(() => {
    searchAnim.value = withTiming(0, { duration: 150 }, () => {
      runOnJS(setSearchVisible)(false);
      runOnJS(setSearch)('');
    });
  }, [searchAnim]);

  const handleDeleteWorkout = useCallback((id: string, nameOrDate: string) => {
    Alert.alert(
      '¿Eliminar Entrenamiento?',
      `Se borrará "${nameOrDate}" y todo su progreso de forma irreversible.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await workoutService.deleteWorkout(id);
              setWorkouts(prev => prev.filter(w => w.id !== id));
            } catch (e) {
              console.error(e);
              Alert.alert('Error', 'No se pudo eliminar el entrenamiento.');
            }
          },
        },
      ]
    );
  }, [workoutService]);

  const filteredWorkouts = useMemo(() => workouts.filter(w => {
    if (!search) return true;
    const dateStr = format(new Date(w.date), 'EEEE d MMM yyyy', { locale: es }).toLowerCase();
    const lowerSearch = search.toLowerCase();
    const dateMatch = dateStr.includes(lowerSearch);
    const notesMatch = w.notes?.toLowerCase().includes(lowerSearch);
    return dateMatch || notesMatch;
  }), [workouts, search]);

  const sections = useMemo(() => groupWorkoutsByPeriod(filteredWorkouts), [filteredWorkouts]);
  const searchBarAnimatedStyle = useAnimatedStyle(() => ({
    height: interpolate(searchAnim.value, [0, 1], [0, 56]),
    opacity: interpolate(searchAnim.value, [0, 1], [0, 1]),
  }));

  const renderWorkout = useCallback(
    ({ item, index }: { item: Workout; index: number }) => {
      const historyItem = {
        ...item,
        date: item.date instanceof Date ? item.date.toISOString() : String(item.date),
      };
      return <HistoryWorkoutCard item={historyItem} index={index} onDelete={handleDeleteWorkout} />;
    },
    [handleDeleteWorkout],
  );

  return (
    <Screen safeAreaEdges={['top', 'left', 'right']}>
      {/* Header */}
      <XStack
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal="$lg"
        paddingTop="$lg"
        paddingBottom="$sm"
      >
        <AppText variant="titleLg">Historial</AppText>
        <IconButton
          icon={searchVisible
            ? <AppIcon icon={X} color="textSecondary" size={22} />
            : <AppIcon icon={Search} color="textSecondary" size={22} />
          }
          backgroundColor="$surfaceSecondary"
          size={40}
          onPress={searchVisible ? closeSearch : openSearch}
          accessibilityLabel={searchVisible ? 'Cerrar búsqueda' : 'Abrir búsqueda'}
        />
      </XStack>

      {/* Barra de búsqueda animada */}
      <Animated.View
        style={[
          searchBarAnimatedStyle,
          {
            overflow: 'hidden',
            paddingHorizontal: 16,
            paddingBottom: 8,
          },
        ]}
      >
        <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar por fecha o ejercicio..."
            inputRef={searchInputRef}
            returnKeyType="search"
          />
      </Animated.View>

      {/* Contenido */}
      {loading ? (
        <YStack paddingHorizontal="$lg" gap="$md">
          <HistoryCardSkeleton />
          <HistoryCardSkeleton />
          <HistoryCardSkeleton />
          <HistoryCardSkeleton />
        </YStack>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={item => item.id}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderSectionHeader={({ section }) => (
            <AppText
              variant="label"
              color="textTertiary"
              paddingTop="$md"
              paddingBottom="$xs"
            >
              {section.title.toUpperCase()}
            </AppText>
          )}
          renderItem={renderWorkout}
          ListEmptyComponent={() => (
            <YStack alignItems="center" justifyContent="center" marginTop="$5xl">
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