import { XStack, YStack,useTheme } from 'tamagui';
import React, { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ChevronLeft, Trophy, Calendar, Dumbbell, PlayCircle, Activity } from 'lucide-react-native';

import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { IconButton } from '@/components/ui/AppButton';
import { CardBase } from '@/components/ui/card';
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

  useEffect(() => {
    const loadData = async () => {
      try {
        const [exData, histData] = await Promise.all([
          exerciseService.getById(id as string),
          exerciseService.getExerciseHistory(id as string),
        ]);
        setExercise(exData);
        setHistory(histData);
      } catch (e) { 
        console.error(e); 
      } finally { 
        setLoading(false); 
      }
    };
    if (id) loadData();
  }, [id, exerciseService]);

  if (loading) {
    return (
      <Screen>
        <YStack flex={1} alignItems="center" justifyContent="center">
          <ActivityIndicator size="large" color={theme.primary?.val as string} />
        </YStack>
      </Screen>
    );
  }

  return (
    <Screen safeAreaEdges={['top', 'left', 'right']}>
      <XStack alignItems="center" paddingHorizontal="$lg" paddingTop="$lg" paddingBottom="$sm" gap="$sm">
        <IconButton icon={<AppIcon icon={ChevronLeft} size={24} color="color" />} onPress={() => router.back()} />
        <AppText variant="titleSm" marginLeft="$xs">Detalle de Ejercicio</AppText>
      </XStack>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Video Placeholder */}
        <YStack
          height={200}
          width="100%"
          backgroundColor="$surfaceSecondary"
          borderRadius="$lg"
          justifyContent="center"
          alignItems="center"
          marginBottom="$lg"
          marginTop="$md"
          overflow="hidden"
        >
          <YStack opacity={0.5} alignItems="center">
            <AppIcon icon={PlayCircle} size={48} color="textTertiary" />
          </YStack>
          <AppText variant="label" color="textTertiary" marginTop="$sm">
            VIDEO / DEMO DEL EJERCICIO (PRÓXIMAMENTE)
          </AppText>
        </YStack>

        {/* Info Card */}
        <CardBase padding="$md" marginBottom="$xl">
          <AppText variant="titleMd">{exercise ? getExerciseName(exercise) : ''}</AppText>
          <XStack alignItems="center" marginTop="$sm" gap="$xs">
            <AppIcon icon={Dumbbell} size={16} color="primary" />
            <AppText variant="bodyMd" color="textSecondary" style={{ textTransform: 'capitalize' }}>
              {exercise?.primaryMuscles?.[0] || 'N/A'} • {exercise?.equipment || 'N/A'}
            </AppText>
          </XStack>
        </CardBase>

        {/* Heatmap Placeholder */}
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$md">
          <AppText variant="titleSm">Músculos Involucrados</AppText>
          <AppIcon icon={Activity} size={20} color="primary" />
        </XStack>
        <CardBase alignItems="center" paddingVertical="$4xl" marginBottom="$xl">
          <AppText variant="bodySm" color="textTertiary" textAlign="center">
            MAPA ANATÓMICO INTELIGENTE Y{'\n'}HEATMAP DE ACTIVACIÓN{'\n'}(EN DESARROLLO)
          </AppText>
        </CardBase>

        {/* PR Section */}
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$md">
          <AppText variant="titleSm">Récord Personal (1RM)</AppText>
          <AppIcon icon={Trophy} size={20} color="primary" />
        </XStack>
        <CardBase alignItems="center" paddingVertical="$2xl" marginBottom="$xl">
          <AppText variant="titleLg" color="primary" fontSize={40}>
            {exercise?.personalRecord ? `${exercise.personalRecord} kg` : '--'}
          </AppText>
          <AppText variant="label" color="textSecondary" marginTop="$xs">ESTIMADO BASADO EN ÚLTIMA SESIÓN</AppText>
        </CardBase>

        {/* History Section */}
        <AppText variant="titleSm" marginBottom="$md">Historial Reciente</AppText>
        
        {history.length > 0 ? (
          <YStack gap="$md">
            {history.map((record, index) => (
              <CardBase key={index} padding="$md">
                <XStack justifyContent="space-between" alignItems="center" marginBottom="$sm">
                  <XStack alignItems="center" gap="$xs">
                    <AppIcon icon={Calendar} size={14} color="textTertiary" />
                    <AppText variant="label" color="textSecondary">{record.date}</AppText>
                  </XStack>
                  <AppText variant="bodyMd" fontWeight="700">{record.maxWeight} kg</AppText>
                </XStack>
                <YStack gap="$xs">
                  {record.sets.map((set: any, sIdx: number) => (
                    <AppText key={sIdx} variant="bodySm" color="textSecondary">
                      Set {sIdx + 1}: {set.weight}kg x {set.reps}
                    </AppText>
                  ))}
                </YStack>
              </CardBase>
            ))}
          </YStack>
        ) : (
          <YStack padding="$3xl" alignItems="center">
            <AppText variant="bodyMd" color="textSecondary" textAlign="center">
              No hay historial registrado para este ejercicio.
            </AppText>
          </YStack>
        )}

      </ScrollView>
    </Screen>
  );
}