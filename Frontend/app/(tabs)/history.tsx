import React, { useState, useRef, useCallback, useMemo } from 'react';
import { SectionList, Alert, TextInput, View } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, interpolate, runOnJS } from 'react-native-reanimated';
import { XStack, YStack } from 'tamagui';
import { Screen } from '@/components/ui/Screen';
import { useFocusEffect } from '@react-navigation/native';
import { History, Search, X } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { EmptyStateIcon } from '@/components/feedback/EmptyStateIcon';
import { IconButton } from '@/components/ui/AppButton';
import { useWorkout } from '@/hooks/domain/useWorkout';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { HistoryCardSkeleton } from '@/components/cards/Loaders';
import { ContentReveal } from '@/components/feedback/ContentReveal';
import { groupWorkoutsByPeriod } from '@/utils/historyGrouping';
import { SearchBar } from '@/components/ui/SearchBar';
import { HistoryWorkoutCard } from '@/components/cards/HistoryWorkoutCard';
import type { Workout } from 'backend/shared/types';
import { motion } from '@/constants/motion';

type WorkoutNormalized = Omit<Workout, 'date'> & { date: string };
type HistoryWorkout = Omit<Workout, 'date'> & { date: string; _searchIndex: string };

const HISTORY_LIMIT = 50;
const LIST_BOTTOM_PADDING = 100;
const ItemSeparator = () => <View style={{ height: 12 }} />;

export default function HistoryScreen() {
  const workoutService = useWorkout();

  const [workouts, setWorkouts] = useState<HistoryWorkout[]>([]);
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
          const data = await workoutService.getHistory(HISTORY_LIMIT);

          const mapped: HistoryWorkout[] = data.map((w) => {
            const dateStr = (() => {
              try {
                return format(new Date(w.date), 'EEEE d MMM yyyy', { locale: es });
              } catch {
                return String(w.date);
              }
            })();

            const routineName = (w as any).routineName ?? (w as any).name ?? '';
            const notes = (w as any).notes ?? '';
            const exerciseNames = (w as any).exercises?.map((ex: any) => (typeof ex === 'string' ? ex : ex.name ?? '')).join(' ') ?? '';

            const _searchIndex = `${dateStr} ${routineName} ${notes} ${exerciseNames}`.toLowerCase();

            return {
              ...(w as any),
              date: w.date instanceof Date ? w.date.toISOString() : String(w.date),
              _searchIndex,
            } as HistoryWorkout;
          });

          setWorkouts(mapped);
        } catch (error) {
          console.error('[History] Failed to load workouts:', error);
          Toast.show({ type: 'error', text1: 'Error al cargar historial', position: 'top' });
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
    searchAnim.value = withTiming(1, { duration: motion.duration.normal }, () => {
      runOnJS(focusSearchInput)();
    });
  }, [searchAnim, focusSearchInput]);

  const closeSearch = useCallback(() => {
    searchAnim.value = withTiming(0, { duration: motion.duration.fast }, () => {
      runOnJS(setSearchVisible)(false);
      runOnJS(setSearch)('');
    });
  }, [searchAnim]);

  const [deletingId, setDeletingId] = useState<string | null>(null);

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
            if (deletingId) return;
            try {
              setDeletingId(id);
              Toast.show({ type: 'info', text1: 'Eliminando...', position: 'top' });
              await workoutService.deleteWorkout(id);
              setWorkouts(prev => prev.filter(w => w.id !== id));
              Toast.show({ type: 'success', text1: 'Entrenamiento eliminado', position: 'top' });
            } catch (e) {
              console.error('[History] deleteWorkout error', e);
              Alert.alert('Error', 'No se pudo eliminar el entrenamiento.');
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  }, [workoutService, deletingId]);

  const filteredWorkouts = useMemo(() => workouts.filter(w => {
    if (!search) return true;
    const lowerSearch = search.toLowerCase();
    return w._searchIndex.includes(lowerSearch);
  }), [workouts, search]);

  const sections = useMemo(() => groupWorkoutsByPeriod(filteredWorkouts as WorkoutNormalized[]), [filteredWorkouts]);
  const searchBarAnimatedStyle = useAnimatedStyle(() => ({
    height: interpolate(searchAnim.value, [0, 1], [0, 56]),
    opacity: interpolate(searchAnim.value, [0, 1], [0, 1]),
  }));

  const renderWorkout = useCallback(
    ({ item, index }: { item: WorkoutNormalized; index: number }) => (
      <HistoryWorkoutCard item={item} index={index} onDelete={handleDeleteWorkout} />
    ),
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
      <ContentReveal
        loading={loading}
        skeleton={
          <YStack paddingHorizontal="$lg" gap="$md">
            <HistoryCardSkeleton />
            <HistoryCardSkeleton />
            <HistoryCardSkeleton />
            <HistoryCardSkeleton />
          </YStack>
        }
      >
        <SectionList<WorkoutNormalized>
          sections={sections}
          keyExtractor={item => item.id}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={false}
          maxToRenderPerBatch={10}
          windowSize={10}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: LIST_BOTTOM_PADDING }}
          ItemSeparatorComponent={ItemSeparator}
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
              <EmptyStateIcon icon={History} size={48} color="textTertiary" />
              <AppText variant="bodyMd" color="textTertiary" marginTop="$md">
                No hay entrenamientos guardados aún
              </AppText>
            </YStack>
          )}
        />
      </ContentReveal>
    </Screen>
  );
}