import React, { useState, useCallback, useRef, useMemo } from 'react';
import { ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { XStack, YStack, useTheme } from 'tamagui';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { TrendingUp } from 'lucide-react-native';
import { format, subDays } from 'date-fns';
import BottomSheet, { BottomSheetFlatList, BottomSheetView } from '@gorhom/bottom-sheet';

import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { Screen } from '@/components/ui/Screen';
import { CardBase } from '@/components/ui/card';
import { useStats } from '@/hooks/useStats';
import { useBodyWeight } from '@/hooks/useBodyWeight';
import { useWorkout } from '@/hooks/useWorkout';
import { useExercises } from '@/hooks/useExercises';
import { usePersonalRecords } from '@/hooks/usePersonalRecords';
import { getExerciseName } from '@/utils/exercise';
import type { Exercise, Workout, BodyWeightEntry, DailyStats, TrainingFrequencyResult } from 'backend/shared/types';
import { WeeklyVolumeBarChart, ActivityGrid } from '@/components/charts';
import { calculateExercisesVolume } from '@/utils/workout';
import { StatsSummaryGrid } from '@/components/stats/StatsSummaryGrid';
import { BodyWeightCard } from '@/components/stats/BodyWeightCard';
import { StrengthProgressCard } from '@/components/stats/StrengthProgressCard';

export default function StatsScreen() {
  const theme = useTheme();
  const statsService = useStats();
  const weightService = useBodyWeight();
  const workoutService = useWorkout();
  const exerciseService = useExercises();
  const prService = usePersonalRecords();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{ weeklyStats: DailyStats[]; frequency: TrainingFrequencyResult } | null>(null);
  const [weightHistory, setWeightHistory] = useState<BodyWeightEntry[]>([]);
  const [summaries, setSummaries] = useState({ workouts: 0, volume: 0, time: 0, prs: 0 });

  const [exerciseList, setExerciseList] = useState<Exercise[]>([]);
  const [strengthExercise, setStrengthExercise] = useState<Exercise | null>(null);
  const [strengthHistory, setStrengthHistory] = useState<{ x: string; y: number }[]>([]);
  const [workoutHistory, setWorkoutHistory] = useState<Workout[]>([]);
  const exerciseSheetRef = useRef<BottomSheet>(null);
  const sheetSnapPoints = useMemo(() => ['60%'], []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const now = new Date();
      const thirtyDaysAgo = subDays(now, 30);

      const [weeklyStats, frequency, weightData, fullHistory, prCount] = await Promise.all([
        statsService.getWeeklyStats(thirtyDaysAgo.toISOString(), now.toISOString()),
        statsService.getTrainingFrequency(thirtyDaysAgo.toISOString(), now.toISOString()),
        weightService.getBodyWeightHistory(thirtyDaysAgo.toISOString(), now.toISOString()),
        workoutService.getHistory(365),
        prService.countSince(thirtyDaysAgo.toISOString()),
      ]);

      const history = fullHistory.filter((w) => new Date(w.date) >= thirtyDaysAgo);
      setWorkoutHistory(fullHistory);

      const totalVolume = history.reduce(
        (acc: number, w) =>
          acc + calculateExercisesVolume(w.exercises ?? [], { completedOnly: true, defaultCompleted: false }),
        0,
      );

      const totalTime = history.reduce((acc: number, w) => acc + (w.durationSeconds || 0), 0);

      setSummaries({ workouts: history.length, volume: totalVolume, time: Math.round(totalTime / 3600), prs: prCount });
      setWeightHistory([...weightData].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));
      setStats({ weeklyStats, frequency });

      const allExercises = await exerciseService.getAll();
      setExerciseList(allExercises ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [statsService, weightService, workoutService, exerciseService, prService]);

  const selectStrengthExercise = useCallback(async (exercise: Exercise) => {
    setStrengthExercise(exercise);
    exerciseSheetRef.current?.close();
    try {
      const history = await exerciseService.getExerciseHistory(exercise.id, 20);
      const oneRMPoints = (history ?? [])
        .filter((s) => (s.weight ?? 0) > 0 && (s.reps ?? 0) > 0)
        .map((s) => ({
          x: s.createdAt instanceof Date ? s.createdAt.toISOString() : String(s.createdAt),
          y: Number(((s.weight ?? 0) * (1 + (s.reps ?? 0) / 30)).toFixed(1)),
        }))
        .filter((p) => p.y > 0 && p.x)
        .reverse();
      setStrengthHistory(oneRMPoints);
    } catch (e) {
      console.error(e);
    }
  }, [exerciseService]);

  const current1RM = strengthHistory.length > 0
    ? strengthHistory[strengthHistory.length - 1]?.y ?? 0
    : 0;

  const trainedDates = useMemo(() => new Set(
    workoutHistory.map((w) => {
      const d = new Date(w.date);
      return [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, '0'),
        String(d.getDate()).padStart(2, '0'),
      ].join('-');
    })
  ), [workoutHistory]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  if (loading) {
    return (
      <Screen scroll={false}>
        <YStack flex={1} alignItems="center" justifyContent="center" padding="$lg">
          <ActivityIndicator size="large" color={theme.primary?.val} />
        </YStack>
      </Screen>
    );
  }

  return (
    <>
    <Screen safeAreaEdges={['top', 'left', 'right']}>
      <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$xl" paddingTop="$lg" paddingBottom="$md">
        <AppText variant="titleLg">Estadísticas</AppText>
      </XStack>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, gap: 16, paddingTop: 8, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        <StatsSummaryGrid summaries={summaries} />

        <BodyWeightCard
          weightHistory={weightHistory}
          onAddWeight={() => router.push('/stats/weight' as any)}
        />

        <StrengthProgressCard
          strengthExercise={strengthExercise}
          strengthHistory={strengthHistory}
          current1RM={current1RM}
          onOpenExercisePicker={() => exerciseSheetRef.current?.expand()}
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

        {/* Activity Grid — Este mes y este año */}
        <CardBase padding="$md">
          <ActivityGrid trainedDates={trainedDates} />
        </CardBase>

      </ScrollView>
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
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        ItemSeparatorComponent={() => <YStack height={1} backgroundColor="$borderColor" />}
        renderItem={({ item }: { item: Exercise }) => (
          <Pressable onPress={() => selectStrengthExercise(item)}>
            <XStack
              paddingVertical="$md"
              alignItems="center"
              justifyContent="space-between"
            >
              <AppText variant="bodyMd">{getExerciseName(item)}</AppText>
              {strengthExercise?.id === item.id && (
                <AppIcon icon={TrendingUp} size={16} color="primary" />
              )}
            </XStack>
          </Pressable>
        )}
      />
    </BottomSheet>
    </>
  );
}