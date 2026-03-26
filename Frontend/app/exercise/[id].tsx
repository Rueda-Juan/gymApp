import { XStack, YStack } from 'tamagui';
import React, { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import { useTheme } from '@tamagui/core';

import { useLocalSearchParams, router } from 'expo-router';
import { ChevronLeft, Trophy, Calendar, Dumbbell, PlayCircle, Activity } from 'lucide-react-native';
import { AppText } from '@/components/ui/AppText';
import { IconButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/Screen';
import { useExercises } from '@/hooks/useExercises';
import { getExerciseName } from '@/utils/exercise';

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const exerciseService = useExercises();

  const [exercise, setExercise] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (id) loadData(); }, [id]);

  const loadData = async () => {
    try {
      const [exData, histData] = await Promise.all([
        exerciseService.getById(id as string),
        exerciseService.getExerciseHistory(id as string),
      ]);
      setExercise(exData);
      setHistory(histData);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator size="large" color={theme.primary?.val} />
      </Screen>
    );
  }

  return (
    <Screen>
      <XStack alignItems="center" padding="$lg" gap="$sm">
        <IconButton icon={<ChevronLeft size={24} color={theme.color?.val} />} onPress={() => router.back()} />
        <AppText variant="titleSm" style={{ marginLeft: 8 }}>Detalle de Ejercicio</AppText>
      </XStack>

      <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
        {/* Video Placeholder */}
        <YStack
          height={200}
          width="100%"
          backgroundColor="$surfaceSecondary"
          borderRadius="$lg"
          justifyContent="center"
          alignItems="center"
          marginBottom="$md"
          overflow="hidden"
        >
          <PlayCircle size={48} color={theme.textTertiary?.val} opacity={0.5} />
          <AppText variant="label" color="textTertiary" marginTop="$sm">VÍDEO / DEMO DEL EJERCICIO (PRÓXIMAMENTE)</AppText>
        </YStack>

        {/* Info Card */}
        <Card style={{ marginBottom: 24 }}>
          <AppText variant="titleMd">{exercise ? getExerciseName(exercise) : ''}</AppText>
          <XStack alignItems="center" marginTop="$sm">
            <Dumbbell size={16} color={theme.primary?.val} />
            <AppText variant="bodyMd" color="textSecondary" style={{ marginLeft: 8 }}>
              {exercise?.primaryMuscle} · {exercise?.equipment}
            </AppText>
          </XStack>
        </Card>

        {/* Heatmap Placeholder */}
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$lg">
          <AppText variant="titleSm">Músculos Involucrados</AppText>
          <Activity size={20} color={theme.primary?.val} />
        </XStack>
        <Card style={{ alignItems: 'center', paddingVertical: 40, marginBottom: 24 }}>
          <AppText variant="bodySm" color="textTertiary" style={{ textAlign: 'center' }}>
            MAPA ANATÓMICO INTELIGENTE Y{'\n'}HEATMAP DE ACTIVACIÓN{'\n'}(EN DESARROLLO)
          </AppText>
        </Card>

        {/* PR Section */}
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$lg">
          <AppText variant="titleSm">Récord Personal (1RM)</AppText>
          <Trophy size={20} color={theme.primary?.val} />
        </XStack>
        <Card style={{ alignItems: 'center', paddingVertical: 24, marginBottom: 24 }}>
          <AppText variant="titleLg" color="primary" style={{ fontSize: 40 }}>
            {exercise?.personalRecord ? `${exercise.personalRecord} kg` : '--'}
          </AppText>
          <AppText variant="label" color="textSecondary" style={{ marginTop: 4 }}>ESTIMADO BASADO EN ÚLTIMA SESIÓN</AppText>
        </Card>

        {/* History Section */}
        <AppText variant="titleSm" style={{ marginBottom: 16 }}>Historial Reciente</AppText>
        {history.map((record, index) => (
          <Card key={index} style={{ marginBottom: 12 }}>
            <XStack justifyContent="space-between" alignItems="center">
              <XStack alignItems="center">
                <Calendar size={14} color={theme.textTertiary?.val} />
                <AppText variant="label" color="textSecondary" style={{ marginLeft: 4 }}>{record.date}</AppText>
              </XStack>
              <AppText variant="bodyMd" style={{ fontWeight: '700' }}>{record.maxWeight} kg</AppText>
            </XStack>
            <YStack marginTop="$sm">
              {record.sets.map((set: any, sIdx: number) => (
                <AppText key={sIdx} variant="bodySm" color="textSecondary">
                  Set {sIdx + 1}: {set.weight}kg x {set.reps}
                </AppText>
              ))}
            </YStack>
          </Card>
        ))}

        {history.length === 0 && (
          <AppText variant="bodyMd" color="textSecondary" style={{ textAlign: 'center', padding: 20 }}>
            No hay historial registrado para este ejercicio.
          </AppText>
        )}

        <YStack height={100} />
      </ScrollView>
    </Screen>
  );
}
