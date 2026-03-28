import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { XStack, YStack, useTheme } from 'tamagui';
import { router } from 'expo-router';
import { Calendar, Trophy, Clock, Dumbbell, Share, Plus, Scale } from 'lucide-react-native';
import { format, subDays } from 'date-fns';

import { CardBase } from '@/components/ui/card';
import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { IconButton } from '@/components/ui/AppButton';
import { Screen } from '@/components/ui/Screen';
import { useStats } from '@/hooks/useStats';
import { useBodyWeight } from '@/hooks/useBodyWeight';
import { useWorkout } from '@/hooks/useWorkout';
import { StatsLineChart, WeeklyVolumeBarChart } from '@/components/charts';

export default function StatsScreen() {
  const theme = useTheme();
  const statsService = useStats();
  const weightService = useBodyWeight();
  const workoutService = useWorkout();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [weightHistory, setWeightHistory] = useState<any[]>([]);
  const [summaries, setSummaries] = useState({ workouts: 0, volume: 0, time: 0, prs: 0 });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const now = new Date();
      const thirtyDaysAgo = subDays(now, 30);

      const [weeklyStats, frequency, weightData, history] = await Promise.all([
        statsService.getWeeklyStats(thirtyDaysAgo.toISOString(), now.toISOString()),
        statsService.getTrainingFrequency(thirtyDaysAgo.toISOString(), now.toISOString()),
        weightService.getBodyWeightHistory(thirtyDaysAgo, now),
        workoutService.getHistory(30),
      ]);

      const totalVolume = history.reduce((acc: number, w: any) => {
        let vol = 0;
        w.exercises?.forEach((ex: any) => {
          ex.sets?.forEach((s: any) => {
            if (s.completed) {
              const weight = Number(s.weight) || 0;
              const reps = Number(s.reps) || 0;
              vol += weight * reps;
            }
          });
        });
        return acc + vol;
      }, 0);

      const totalTime = history.reduce((acc: number, w: any) => acc + (w.durationSeconds || 0), 0);

      setSummaries({ workouts: history.length, volume: totalVolume, time: Math.round(totalTime / 3600), prs: 0 });
      setWeightHistory(weightData);
      setStats({ weeklyStats, frequency });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadData();
  }, [loadData]);

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
    <Screen safeAreaEdges={['top', 'left', 'right']}>
      <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$xl" paddingTop="$lg" paddingBottom="$md">
        <AppText variant="titleLg">Estadísticas</AppText>
        <Pressable
          style={{ padding: 8 }}
          onPress={() => router.push('/stats/weight' as any)}
          accessibilityLabel="Compartir estadísticas"
        >
          <AppIcon icon={Share} color="textTertiary" size={20} />
        </Pressable>
      </XStack>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, gap: 16, paddingTop: 8, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* Summary Grid */}
        <XStack flexWrap="wrap" justifyContent="space-between" rowGap="$md">
          {[
            { icon: Calendar, label: 'WORKOUTS', value: summaries.workouts },
            { icon: Dumbbell, label: 'VOLUMEN (KG)', value: summaries.volume > 1000 ? `${(summaries.volume / 1000).toFixed(1)}k` : summaries.volume },
            { icon: Clock, label: 'TIEMPO (H)', value: summaries.time },
            { icon: Trophy, label: 'PRS', value: summaries.prs },
          ].map(({ icon: Icon, label, value }) => (
            <CardBase key={label} width="47%" padding="$md">
              <XStack alignItems="center" gap="$xs" marginBottom="$xs">
                <AppIcon icon={Icon} size={16} color="primary" />
                <AppText variant="label" color="textTertiary">{label}</AppText>
              </XStack>
              <AppText variant="titleMd">{value}</AppText>
            </CardBase>
          ))}
        </XStack>

        {/* Body Weight Card */}
        <CardBase padding="$md">
          <XStack justifyContent="space-between" alignItems="center">
            <XStack alignItems="center" gap="$sm">
              <AppIcon icon={Scale} size={20} color="primary" />
              <AppText variant="titleSm">Peso Corporal</AppText>
            </XStack>
            <IconButton
              icon={<AppIcon icon={Plus} size={16} color="primary" />}
              size={32}
              backgroundColor="$primarySubtle"
              onPress={() => router.push('/stats/weight' as any)}
            />
          </XStack>

          <XStack alignItems="center" marginVertical="$md">
            <AppText variant="titleLg" fontSize={40}>
              {weightHistory.length > 0 ? (Number(weightHistory[0].weight) || 0).toFixed(1) : '--'}
            </AppText>
            <AppText variant="bodyMd" color="textSecondary" marginLeft="$xs" marginTop="$sm">kg</AppText>
          </XStack>

          <AppText variant="label" color="textTertiary" marginBottom="$md">ÚLTIMOS 30 DÍAS</AppText>
          {weightHistory.length > 1 ? (
            <StatsLineChart
              data={weightHistory
                .map((w) => ({ x: w.date, y: Number(w.weight) }))
                .filter((p) => !isNaN(p.y) && p.y > 0)
              }
              xTickFormat={(t) => {
                try {
                  return format(new Date(t), 'dd/MM');
                } catch {
                  return '';
                }
              }}
            />
          ) : (
            <YStack alignItems="center" justifyContent="center" height={120}>
              <AppText variant="bodyMd" color="textTertiary">Registra más datos para ver el gráfico</AppText>
            </YStack>
          )}
        </CardBase>

        {/* Weekly Volume Chart */}
        <CardBase padding="$none">
          <AppText variant="bodyMd" color="textTertiary" fontWeight="600" padding="$md">
            Volumen Semanal
          </AppText>
          <WeeklyVolumeBarChart
            data={(stats?.weeklyStats || [])
              .map((item: any) => ({ x: item.date, y: Number(item.volume) || 0 }))
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

      </ScrollView>
    </Screen>
  );
}