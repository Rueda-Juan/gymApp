import React, { useState, useCallback, useRef, useMemo } from 'react';
import { ScrollView, Pressable } from 'react-native';
import { XStack, YStack, useTheme } from 'tamagui';
import { router } from 'expo-router';
import { TrendingUp } from 'lucide-react-native';
import { format } from 'date-fns';
import BottomSheet, { BottomSheetFlatList, BottomSheetView } from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';

import { 
  AppText, 
  AppIcon, 
  Screen, 
  CardBase, 
  ContentReveal 
} from '@/shared/ui';
import { WorkoutSet } from '@kernel';
import { useExerciseDb } from '@/entities/exercise';
import { BodyWeightCard, StrengthProgressCard, StatsSummaryGrid } from '@/entities/stats';
import { useStatsData } from './useStatsData';
import { getExerciseName } from '@/entities/exercise';
import { calculateEpley1RM } from '@/entities/workout';
import { WeeklyVolumeBarChart, ActivityGrid } from '@/shared/ui/charts/PlaceholderCharts';
import { StatsPageSkeleton } from '@/shared/ui/layout/Loaders';
import { ROUTES } from '@/shared/constants/routes';
import type { Exercise } from '@kernel';

const STRENGTH_HISTORY_LIMIT = 20;
const SheetItemSeparator = () => <YStack height={1} backgroundColor="$borderColor" />;

type WeeklyChartPoint = { x: string; y: number };

export default function StatsPage() {
  const theme = useTheme();
  const exerciseService = useExerciseDb();

  const { loading, stats, weightHistory, summaries, trainedDates } = useStatsData();

  const [exerciseList, setExerciseList] = useState<Exercise[]>([]);
  const [exercisesLoaded, setExercisesLoaded] = useState(false);
  const [strengthExercise, setStrengthExercise] = useState<Exercise | null>(null);
  const [strengthHistory, setStrengthHistory] = useState<{ x: string; y: number }[]>([]);
  const exerciseSheetRef = useRef<BottomSheet>(null);
  const sheetSnapPoints = useMemo(() => ['60%'], []);

  const current1RM = strengthHistory.length > 0
    ? strengthHistory[strengthHistory.length - 1]?.y ?? 0
    : 0;

  const selectStrengthExercise = useCallback(async (exercise: Exercise) => {
    setStrengthExercise(exercise);
    exerciseSheetRef.current?.close();
    try {
      const history = await exerciseService.getExerciseHistory(exercise.id, STRENGTH_HISTORY_LIMIT);
      const oneRMPoints = (history ?? [])
        .filter((s: WorkoutSet) => (s.weight ?? 0) > 0 && (s.reps ?? 0) > 0)
        .map((s: WorkoutSet) => ({
          x: s.createdAt || new Date().toISOString(),
          y: calculateEpley1RM(s.weight ?? 0, s.reps ?? 0),
        }))
        .filter((p: { x: string; y: number }) => p.y > 0 && p.x)
        .reverse();
      setStrengthHistory(oneRMPoints);
    } catch {
      console.error('[Stats] Failed to load progression for exercise', exercise?.id);
      Toast.show({ type: 'error', text1: 'Error al cargar progresión', position: 'top' });
    }
  }, [exerciseService]);

  const handleOpenExercisePicker = useCallback(async () => {
    if (!exercisesLoaded) {
      try {
        const allExercises = await exerciseService.getExercises();
        setExerciseList(allExercises ?? []);
        setExercisesLoaded(true);
      } catch (e) {
        console.error('[Stats] Failed to load exercises:', e);
        Toast.show({ type: 'error', text1: 'No se pudieron cargar los ejercicios', position: 'top' });
        return;
      }
    }
    exerciseSheetRef.current?.expand();
  }, [exerciseService, exercisesLoaded]);

  const renderExerciseItem = useCallback(({ item }: { item: Exercise }) => (
    <Pressable onPress={() => selectStrengthExercise(item)} accessibilityRole="button" accessibilityLabel={`Seleccionar ${getExerciseName(item)}`}>
      <XStack paddingVertical="$md" alignItems="center" justifyContent="space-between">
        <AppText variant="bodyMd">{getExerciseName(item)}</AppText>
        {strengthExercise?.id === item.id && (
          <AppIcon icon={TrendingUp} size={16} color="primary" />
        )}
      </XStack>
    </Pressable>
  ), [selectStrengthExercise, strengthExercise]);

  const weeklyChartData = useMemo<WeeklyChartPoint[]>(() => (stats?.weeklyStats || [])
    .map((item) => ({ x: String((item as { date: string }).date), y: Number((item as { totalVolume: number }).totalVolume) || 0 }))
    .filter((p) => !isNaN(p.y)), [stats?.weeklyStats]);

  return (
    <>
    <Screen safeAreaEdges={['top','bottom','left','right']}>
      <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$xl" paddingTop="$lg" paddingBottom="$md">
        <AppText variant="titleLg">Estadísticas</AppText>
      </XStack>

      <ContentReveal
        loading={loading}
        skeleton={<StatsPageSkeleton />}
      >
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, gap: 16, paddingTop: 8, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >

        <StatsSummaryGrid summaries={summaries} />

        <BodyWeightCard
          weightHistory={weightHistory}
          onAddWeight={() => router.push(ROUTES.STATS_WEIGHT)}
        />

        <StrengthProgressCard
          strengthExercise={strengthExercise}
          strengthHistory={strengthHistory}
          current1RM={current1RM}
          onOpenExercisePicker={handleOpenExercisePicker}
        />

        <CardBase padding="$none">
          <AppText variant="bodyMd" color="textTertiary" fontWeight="600" padding="$md">
            Volumen Semanal
          </AppText>
          <WeeklyVolumeBarChart
            data={weeklyChartData}
            xTickFormat={(t: string | number) => {
              try {
                return format(new Date(t), 'EE');
              } catch {
                return String(t);
              }
            }}
            yTickFormat={(x: number) => `${x / 1000}k`}
          />
        </CardBase>

        <CardBase padding="$md">
          <ActivityGrid trainedDates={trainedDates} />
        </CardBase>

      </ScrollView>
      </ContentReveal>
    </Screen>

    <BottomSheet
      ref={exerciseSheetRef}
      index={-1}
      snapPoints={sheetSnapPoints}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: theme.surface?.val }}
      handleIndicatorStyle={{ backgroundColor: theme.textTertiary?.val }}
    >
      <BottomSheetView style={{ paddingHorizontal: 20, paddingBottom: 8 }}>
        <AppText variant="titleSm" marginBottom="$md">Seleccionar ejercicio</AppText>
      </BottomSheetView>
      <BottomSheetFlatList
        data={exerciseList}
        keyExtractor={(item: Exercise) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        ItemSeparatorComponent={SheetItemSeparator}
        renderItem={renderExerciseItem}
      />
    </BottomSheet>
    </>
  );
}
