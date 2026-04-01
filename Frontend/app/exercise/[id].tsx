import { XStack, YStack,useTheme } from 'tamagui';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ChevronLeft, Trophy, Calendar, Dumbbell, PlayCircle, Activity } from 'lucide-react-native';
import { format } from 'date-fns';

import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { IconButton } from '@/components/ui/AppButton';
import { CardBase } from '@/components/ui/card';
import { Screen } from '@/components/ui/Screen';
import { useExercises } from '@/hooks/useExercises';
import { getExerciseName } from '@/utils/exercise';
import type { Exercise } from 'backend/domain/entities/Exercise';
import type { WorkoutSet } from 'backend/domain/entities/WorkoutSet';
import { FONT_SCALE } from '@/tamagui.config';

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const exerciseService = useExercises();

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [history, setHistory] = useState<WorkoutSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoadError(false);
      const [exData, histData] = await Promise.all([
        exerciseService.getById(id as string),
        exerciseService.getExerciseHistory(id as string),
      ]);
      setExercise(exData);
      setHistory(histData);
    } catch (e) {
      console.error(e);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [id, exerciseService]);

  useEffect(() => {
    if (id) loadData();
  }, [id, loadData]);

  const maxWeight = useMemo(() => {
    if (history.length === 0) return 0;
    return history.reduce((max, s) => (s.weight > max ? s.weight : max), 0);
  }, [history]);

  if (loading) {
    return (
      <Screen>
        <YStack flex={1} alignItems="center" justifyContent="center">
          <ActivityIndicator size="large" color={theme.primary?.val as string} />
        </YStack>
      </Screen>
    );
  }

  if (!exercise) {
    return (
      <Screen safeAreaEdges={['top', 'left', 'right']}>
        <XStack alignItems="center" paddingHorizontal="$lg" paddingTop="$lg" paddingBottom="$sm" gap="$sm">
          <IconButton icon={<AppIcon icon={ChevronLeft} size={24} color="color" />} onPress={() => router.back()} />
        </XStack>
        <YStack flex={1} alignItems="center" justifyContent="center" padding="$xl">
          <AppText variant="titleSm" color="textSecondary">
            {loadError ? 'Error al cargar el ejercicio' : 'Ejercicio no encontrado'}
          </AppText>
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
        {/* Video Placeholder — shown only when animation data is available */}
        {exercise.animationPath != null && (
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
        )}

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

        {/* Anatomical Map — shown only when SVG data is available */}
        {exercise.anatomicalRepresentationSvg != null && (
          <>
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$md">
              <AppText variant="titleSm">Músculos Involucrados</AppText>
              <AppIcon icon={Activity} size={20} color="primary" />
            </XStack>
            <CardBase alignItems="center" paddingVertical="$4xl" marginBottom="$xl">
              <AppText variant="bodySm" color="textTertiary" textAlign="center">
                MAPA ANATÓMICO INTELIGENTE Y{'…'}{'…'}HEATMAP DE ACTIVACIÓN{'…'}{'…'}(EN DESARROLLO)
              </AppText>
            </CardBase>
          </>
        )}

        {/* PR Section */}
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$md">
          <AppText variant="titleSm">Récord Personal (1RM)</AppText>
          <AppIcon icon={Trophy} size={20} color="primary" />
        </XStack>
        <CardBase alignItems="center" paddingVertical="$2xl" marginBottom="$xl">
          <AppText variant="titleLg" color="primary" fontSize={FONT_SCALE.sizes.displayLg}>
            {history.length > 0 ? `${maxWeight} kg` : '--'}
          </AppText>
          <AppText variant="label" color="textSecondary" marginTop="$xs">ESTIMADO BASADO EN ÚLTIMA SESIÓN</AppText>
        </CardBase>

        {/* History Section */}
        <AppText variant="titleSm" marginBottom="$md">Historial Reciente</AppText>
        
        {history.length > 0 ? (
          <YStack gap="$md">
            {history.map((set) => (
              <Pressable
                key={set.id}
                onPress={() => set.workoutId && router.push({ pathname: '/history/[id]' as any, params: { id: set.workoutId } })}
                disabled={!set.workoutId}
              >
                <CardBase padding="$md">
                  <XStack justifyContent="space-between" alignItems="center" marginBottom="$sm">
                    <XStack alignItems="center" gap="$xs">
                      <AppIcon icon={Calendar} size={14} color="textTertiary" />
                      <AppText variant="label" color="textSecondary">
                        {(() => { try { return format(new Date(set.createdAt), 'dd/MM/yyyy'); } catch { return String(set.createdAt); } })()}
                      </AppText>
                    </XStack>
                    <AppText variant="bodyMd" fontWeight="700">{set.weight} kg</AppText>
                  </XStack>
                  <AppText variant="bodySm" color="textSecondary">
                    Set {set.setNumber}: {set.weight} kg × {set.reps} reps
                  </AppText>
                </CardBase>
              </Pressable>
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