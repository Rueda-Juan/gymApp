import React, { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { XStack, YStack, useTheme } from 'tamagui';
import { router } from 'expo-router';
import { Calendar, Trophy, Clock, Dumbbell, Share, Plus, Scale } from 'lucide-react-native';
import { CardBase } from '@/components/ui/card';
import { AppText } from '@/components/ui/AppText';
import { IconButton } from '@/components/ui/AppButton';
import { Screen } from '@/components/ui/Screen';
import { useStats } from '@/hooks/useStats';
import { useBodyWeight } from '@/hooks/useBodyWeight';
import { useWorkout } from '@/hooks/useWorkout';
import { format, subDays } from 'date-fns';
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

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
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
          ex.sets?.forEach((s: any) => { if (s.completed) vol += (s.weight * s.reps); });
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
  };

  if (loading) {
    return (
      <Screen scroll={false}>
        <YStack flex={1} alignItems="center" justifyContent="center" p="$lg">
          <ActivityIndicator size="large" color="#3B99F7" />
        </YStack>
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <XStack justifyContent="space-between" alignItems="center" px="$xl" pt="$lg" pb="$md">
        <AppText variant="titleLg">Estadísticas</AppText>
        <TouchableOpacity style={{ padding: 8 }} onPress={() => router.push('/stats/weight' as any)}>
          <Share color="#9CA3AF" size={20} />
        </TouchableOpacity>
      </XStack>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, gap: 16, paddingTop: 8 }} showsVerticalScrollIndicator={false}>

        {/* Summary Grid */}
        <XStack flexWrap="wrap" justifyContent="space-between" gap="$sm">
          {[
            { icon: Calendar, label: 'WORKOUTS', value: summaries.workouts },
            { icon: Dumbbell, label: 'VOLUMEN (KG)', value: summaries.volume > 1000 ? `${(summaries.volume / 1000).toFixed(1)}k` : summaries.volume },
            { icon: Clock, label: 'TIEMPO (H)', value: summaries.time },
            { icon: Trophy, label: 'PRS', value: summaries.prs },
          ].map(({ icon: Icon, label, value }) => (
            <CardBase key={label} width="47%" gap="$sm" p="$sm">
              <XStack alignItems="center" gap="$xs">
                <Icon size={18} color="$primary" />
                <AppText variant="label" color="textTertiary">{label}</AppText>
              </XStack>
              <AppText variant="titleMd">{value}</AppText>
            </CardBase>
          ))}
        </XStack>

        {/* Body Weight Card */}
        <CardBase gap="$md">
          <XStack justifyContent="space-between" alignItems="center">
            <XStack alignItems="center" gap="$sm">
              <Scale size={20} color="$primary" />
              <AppText variant="titleSm">Peso Corporal</AppText>
            </XStack>
            <IconButton
              icon={<Plus size={16} color="$color" />}
              size={32}
              backgroundColor="$surfaceSecondary"
              onPress={() => router.push('/stats/weight' as any)}
            />
          </XStack>

          <XStack alignItems="center" my="$md">
            <AppText variant="titleLg" style={{ fontSize: 40 }}>
              {weightHistory.length > 0 ? weightHistory[0].weight : '--'}
            </AppText>
            <AppText variant="bodyMd" color="textSecondary" style={{ marginLeft: 8, marginTop: 15 }}>kg</AppText>
          </XStack>

          <AppText variant="label" color="textTertiary">ÚLTIMOS 30 DÍAS</AppText>
          {weightHistory.length > 1 ? (
            <StatsLineChart
              data={weightHistory.map((w) => ({ x: w.date, y: w.weight }))}
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
        <CardBase gap="$md" p="$none">
          <AppText variant="bodyMd" color="textTertiary" style={{ fontWeight: '600', padding: 16 }}>Volumen Semanal</AppText>
          <WeeklyVolumeBarChart
            data={(stats?.weeklyStats || []).map((item: any) => ({ x: item.date, y: item.volume }))}
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

        <YStack height={100} />
      </ScrollView>
    </Screen>
  );
}
