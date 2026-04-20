import React, { useState, useMemo, useCallback, useRef } from 'react';
import { TextInput, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { router, useLocalSearchParams } from 'expo-router';
import { Search, X, Dumbbell, Plus } from 'lucide-react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { XStack, YStack, View, useTheme } from 'tamagui';

import Toast from 'react-native-toast-message';

import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { IconButton } from '@/components/ui/AppButton';
import { ToggleChip } from '@/components/ui/ToggleChip';
import { BodyAnatomySvg } from '@/components/ui/BodyAnatomySvg';
import { EmptyStateIcon } from '@/components/feedback/EmptyStateIcon';

import { MuscleFilterSheet } from '@/features/exercise/components/MuscleFilterSheet';

import { useExercises } from '@/features/exercise/hooks/useExercises';
import { useExerciseFiltering } from '@/features/exercise/hooks/useExerciseFiltering';

import { useActiveWorkout } from '@/store/useActiveWorkout';
import { useRoutineStore } from '@/store/routineStore';

import { ROUTES } from '@/constants/routes';
import { EQUIPMENT_OPTIONS, MUSCLE_LABELS, EQUIPMENT_LABELS } from '@/constants/exercise';

import { getExerciseName } from '@/utils/exercise';
import { createClientId } from '@/utils/clientId';

import { FONT_SCALE } from '@/tamagui.config';

import type { ExerciseDTO } from '@shared';

// ================= TYPES =================

type ExerciseItem = { type: 'exercise'; data: ExerciseDTO };
type HeaderItem = { type: 'header'; id: string; title: string };

type ExerciseBrowserListItem = ExerciseItem | HeaderItem;

// ================= HELPERS =================

const toExerciseItem = (e: ExerciseDTO): ExerciseItem => ({
  type: 'exercise',
  data: e,
});

const toHeader = (title: string, id: string): HeaderItem => ({
  type: 'header',
  id,
  title,
});

// ================= COMPONENT =================

export default function ExerciseBrowserScreen() {
  const theme = useTheme();
  const { target, action, targetId, filterMuscle, excludeEquipment } =
    useLocalSearchParams<{
      target?: string;
      action?: string;
      targetId?: string;
      filterMuscle?: string;
      excludeEquipment?: string;
    }>();
  const exerciseService = useExercises();
  const addExerciseToActiveWorkout = useActiveWorkout(s => s.addExercise);
  const replaceExerciseActiveWorkout = useActiveWorkout(s => s.replaceExercise);
  const addExerciseToRoutine = useRoutineStore(s => s.addExercise);
  const [exercises, setExercises] = useState<ExerciseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const muscleSheetRef = useRef<BottomSheetModal>(null);
  const { filteredExercises, filters, setFilter } = useExerciseFiltering(exercises, {
    search: '',
    muscleFilter: filterMuscle || '',
    equipmentFilter: '',
    customOnly: false,
  });

  // ================= LOAD =================

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      const load = async () => {
        try {
          if (mounted) setLoading(true);
          const data = await exerciseService.getAll();
          if (mounted) setExercises(data ?? []);
        } catch (e) {
          Toast.show({ type: 'error', text1: 'Error al cargar ejercicios' });
          console.error(e);
        } finally {
          if (mounted) setLoading(false);
        }
      };
      load();
      return () => { mounted = false; };
    }, [exerciseService]),
  );

  // ================= DATA =================

  const listData = useMemo<ExerciseBrowserListItem[]>(() => {
    if (action === 'replace') {
      const suggested = filteredExercises.filter(e => e.equipment !== excludeEquipment);
      const others = filteredExercises.filter(e => e.equipment === excludeEquipment);
      const result: ExerciseBrowserListItem[] = [];
      if (suggested.length) {
        result.push(toHeader('✨ Alternativas Sugeridas', 'suggested'));
        result.push(...suggested.map(toExerciseItem));
      }
      if (others.length || suggested.length) {
        result.push(toHeader('Todos los ejercicios', 'others'));
        result.push(...others.map(toExerciseItem));
      }
      return result;
    }
    return filteredExercises.map(toExerciseItem);
  }, [filteredExercises, action, excludeEquipment]);

  // ================= ACTION =================

  const handleSelect = useCallback((item: ExerciseBrowserListItem) => {
    if (item.type === 'header') return;
    const exercise = item.data;
    if (target === 'routine') {
      addExerciseToRoutine({
        id: exercise.id,
        name: exercise.name,
        muscle: exercise.primaryMuscles?.[0] || 'other',
      });
    } else {
      const payload = {
        id: createClientId(),
        exerciseId: exercise.id,
        name: exercise.name,
        sets: [
          {
            id: createClientId(),
            weight: 0,
            reps: 0,
            isCompleted: false,
            type: 'normal' as const,
          },
        ],
      };
      if (action === 'replace' && targetId) {
        replaceExerciseActiveWorkout(targetId, { ...payload, status: 'pending' });
      } else {
        addExerciseToActiveWorkout(payload);
      }
    }
    router.back();
  }, [target, action, targetId, addExerciseToRoutine, replaceExerciseActiveWorkout, addExerciseToActiveWorkout]);

  // ================= RENDER =================

  const renderItem = useCallback(({ item }: { item: ExerciseBrowserListItem }) => {
    if (item.type === 'header') {
      return (
        <YStack paddingVertical="$sm" paddingHorizontal="$xl" backgroundColor="$background">
          <AppText variant="label" color="textTertiary">{item.title}</AppText>
        </YStack>
      );
    }
    const exercise = item.data;
    return (
      <Pressable
        onPress={() => handleSelect(item)}
        accessibilityLabel={`Seleccionar ejercicio ${getExerciseName(exercise)}`}
        accessibilityRole="button"
      >
        <XStack
          alignItems="center"
          paddingHorizontal="$xl"
          paddingVertical="$md"
          borderBottomColor="$borderColor"
          borderBottomWidth={1}
        >
          <YStack
            width={44}
            height={44}
            borderRadius="$md"
            backgroundColor="$surfaceSecondary"
            alignItems="center"
            justifyContent="center"
            marginRight="$md"
            borderWidth={1}
            borderColor="$borderColor"
            overflow="hidden"
          >
            <BodyAnatomySvg
              primaryMuscles={exercise.primaryMuscles ?? []}
              secondaryMuscles={exercise.secondaryMuscles ?? []}
            />
          </YStack>
          <YStack flex={1}>
            <AppText variant="bodyLg" fontWeight="600">{getExerciseName(exercise)}</AppText>
            <AppText variant="label" color="textTertiary" marginTop="$xs">
              {(exercise.primaryMuscles ?? []).map((muscle: string) =>
                MUSCLE_LABELS[muscle as keyof typeof MUSCLE_LABELS] ?? muscle
              ).join(', ') || 'Otro'}
              {' \u2022 '}
              {EQUIPMENT_LABELS[exercise.equipment as keyof typeof EQUIPMENT_LABELS] ?? exercise.equipment}
            </AppText>
          </YStack>
          <YStack
            width={32}
            height={32}
            borderRadius="$full"
            backgroundColor="$surface"
            alignItems="center"
            justifyContent="center"
            borderWidth={1}
            borderColor="$borderColor"
          >
            <AppIcon icon={Dumbbell} color="textTertiary" size={16} />
          </YStack>
        </XStack>
      </Pressable>
    );
  }, [handleSelect]);

  return (
    <Screen scroll safeAreaEdges={['top','bottom','left','right']}>
      {/* Header */}
      <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$xl" paddingVertical="$md">
        <AppText variant="titleSm">Buscar Ejercicio</AppText>
        <XStack gap="$sm" alignItems="center">
          <IconButton
            icon={<AppIcon icon={Plus} color="background" size={20} />}
            size={36}
            backgroundColor="$primary"
            onPress={() => router.push(ROUTES.EXERCISE_CREATE)}
            accessibilityLabel="Crear ejercicio"
          />
          <IconButton icon={<AppIcon icon={X} color="color" size={24} />} onPress={() => router.back()} accessibilityLabel="Cerrar" />
        </XStack>
      </XStack>
      {/* Search Bar */}
      <YStack paddingHorizontal="$lg" marginBottom="$md">
        <XStack
          alignItems="center"
          gap="$sm"
          height={48}
          borderRadius="$lg"
          borderWidth={1}
          paddingHorizontal="$md"
          backgroundColor="$surfaceSecondary"
          borderColor="$borderColor"
        >
          <AppIcon icon={Search} color="textTertiary" size={20} />
          <TextInput
            style={{ flex: 1, color: theme.color?.val ?? '#000', fontSize: FONT_SCALE.sizes[3] }}
            placeholder="Ej. Press de banca..."
            placeholderTextColor={theme.textTertiary?.val ?? '#666'}
            value={filters.search}
            onChangeText={(text) => setFilter('search', text)}
            autoFocus={!target}
          />
        </XStack>
      </YStack>
      {/* Filters (Muscles & Equipment) */}
      <YStack marginBottom="$md" gap="$sm">
        {/* Chip "Mis ejercicios" */}
        <XStack overflow="scroll" gap="$sm" paddingHorizontal="$xl" paddingVertical="$xs">
          <ToggleChip
            variant="solid"
            label="Mis ejercicios"
            isActive={filters.customOnly ?? false}
            onPress={() => setFilter('customOnly', !filters.customOnly)}
          />
        </XStack>
        {/* Chips de Categorías Rápidas */}
        <XStack overflow="scroll" gap="$sm" paddingHorizontal="$xl" paddingVertical="$xs" alignItems="center">
          <ToggleChip
            variant="solid"
            label={filters.muscleFilter ? `Músculo: ${MUSCLE_LABELS[filters.muscleFilter as keyof typeof MUSCLE_LABELS] ?? filters.muscleFilter}` : 'Todos los músculos'}
            isActive={!!filters.muscleFilter}
            onPress={() => muscleSheetRef.current?.present()}
            accessibilityLabel="Filtrar por músculo (jerárquico)"
          />
          <View width={1} height={20} backgroundColor="$borderColor" alignSelf="center" />
          {EQUIPMENT_OPTIONS.map(equipment => (
            <ToggleChip
              key={equipment}
              variant="secondary"
              label={EQUIPMENT_LABELS[equipment] ?? equipment}
              isActive={(filters.equipmentFilter ?? '') === equipment}
              onPress={() => setFilter('equipmentFilter', (filters.equipmentFilter ?? '') === equipment ? '' : equipment)}
              accessibilityLabel={`Filtrar por ${EQUIPMENT_LABELS[equipment] ?? equipment}`}
            />
          ))}
        </XStack>
      </YStack>
      {/* Muscle Filter Sheet */}
      <MuscleFilterSheet
        ref={muscleSheetRef}
        selectedMuscle={filters.muscleFilter ?? ''}
        onSelect={(muscle: string) => setFilter('muscleFilter', muscle)}
        onClose={() => muscleSheetRef.current?.dismiss()}
      />
      {/* List */}
      <FlashList
        data={listData}
        keyExtractor={(item) => item.type === 'header' ? item.id : item.data.id}
        getItemType={(item) => item.type}
        renderItem={renderItem}
        ListEmptyComponent={
          <YStack padding="$5xl" alignItems="center" gap="$md">
            {loading ? (
              <AppText variant="bodyMd" color="textSecondary">Cargando...</AppText>
            ) : exercises.length === 0 ? (
              <>
                <EmptyStateIcon icon={Dumbbell} size={48} color="textTertiary" />
                <AppText variant="titleSm" color="textSecondary" textAlign="center">
                  No tenés ejercicios aún
                </AppText>
                <AppText variant="bodyMd" color="textTertiary" textAlign="center">
                  Creá tu primer ejercicio tocando el botón + de arriba a la derecha
                </AppText>
              </>
            ) : (
              <AppText variant="bodyMd" color="textSecondary">
                No se encontraron ejercicios con esos filtros
              </AppText>
            )}
          </YStack>
        }
      />
    </Screen>
  );
}