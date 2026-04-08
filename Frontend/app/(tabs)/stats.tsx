import React, { useState, useCallback, useRef, useMemo } from 'react';
import { ScrollView, Pressable } from 'react-native';
import { XStack, YStack, useTheme } from 'tamagui';
import { router } from 'expo-router';
import { TrendingUp } from 'lucide-react-native';
import { format } from 'date-fns';
import BottomSheet, { BottomSheetFlatList, BottomSheetView } from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';

import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { Screen } from '@/components/ui/Screen';
import { CardBase } from '@/components/ui/card';
import { useExercises } from '@/hooks/useExercises';
import { useStatsData } from '@/hooks/useStatsData';
import { getExerciseName } from '@/utils/exercise';
import type { Exercise } from 'backend/shared/types';
import { WeeklyVolumeBarChart, ActivityGrid } from '@/components/charts';
import { calculateEpley1RM } from '@/utils/workout';
import { StatsSummaryGrid } from '@/components/stats/StatsSummaryGrid';
import { BodyWeightCard } from '@/components/stats/BodyWeightCard';
import { StrengthProgressCard } from '@/components/stats/StrengthProgressCard';
import { StatsPageSkeleton } from '@/components/layout/Loaders';
import { ContentReveal } from '@/components/feedback/ContentReveal';
import { ROUTES } from '@/constants/routes';

const STRENGTH_HISTORY_LIMIT = 20;

const SheetItemSeparator = () => <YStack height={1} backgroundColor="$borderColor" />;

export default function StatsScreen() {
  const theme = useTheme();
  const exerciseService = useExercises();

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
        .filter((s) => (s.weight ?? 0) > 0 && (s.reps ?? 0) > 0)
        .map((s) => ({
          x: s.createdAt instanceof Date ? s.createdAt.toISOString() : String(s.createdAt),
          y: calculateEpley1RM(s.weight ?? 0, s.reps ?? 0),
        }))
        .filter((p) => p.y > 0 && p.x)
        .reverse();
      setStrengthHistory(oneRMPoints);
    } catch {
      Toast.show({ type: 'error', text1: 'Error al cargar progresión', position: 'top' });
    }
  }, [exerciseService]);

  const handleOpenExercisePicker = useCallback(async () => {
    if (!exercisesLoaded) {
      const allExercises = await exerciseService.getAll();
      setExerciseList(allExercises ?? []);
      setExercisesLoaded(true);
    }
    exerciseSheetRef.current?.expand();
  }, [exerciseService, exercisesLoaded]);

  const renderExerciseItem = useCallback(({ item }: { item: Exercise }) => (
    <Pressable onPress={() => selectStrengthExercise(item)}>
      <XStack paddingVertical="$md" alignItems="center" justifyContent="space-between">
        <AppText variant="bodyMd">{getExerciseName(item)}</AppText>
        {strengthExercise?.id === item.id && (
          <AppIcon icon={TrendingUp} size={16} color="primary" />
        )}
      </XStack>
    </Pressable>
  ), [selectStrengthExercise, strengthExercise]);

  return (
    <>
    <Screen safeAreaEdges={['top', 'left', 'right']}>
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

        {/* Weekly Volume Chart */}
        <CardBase padding="$none">
          <AppText variant="bodyMd" color="textTertiary" fontWeight="600" padding="$md">
            Volumen Semanal
          </AppText>
          <WeeklyVolumeBarChart
            data={(stats?.weeklyStats || [])
              .map((item) => ({ x: item.date, y: Number(item.totalVolume) || 0 }))
              .filter((p) => !isNaN(p.y))
            }
            xTickFormat={(t) => {
              try {
                return format(new Date(t), 'EE');
              } catch {
                return String(t);
              }
            }}
            yTickFormat={(x) => `${x / 1000}k`}
          />
        </CardBase>

        {/* Activity Grid */}
        <CardBase padding="$md">
          <ActivityGrid trainedDates={trainedDates} />
        </CardBase>

      </ScrollView>
      </ContentReveal>
    </Screen>

    {/* BottomSheet selector de ejercicio */}
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