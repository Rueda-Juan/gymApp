import { XStack, YStack, ScrollView, View, useTheme } from 'tamagui';
import React, { useState, useMemo, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { TextInput, Pressable } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, X, Dumbbell, Plus } from 'lucide-react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { IconButton } from '@/components/ui/AppButton';
import { ToggleChip } from '@/components/ui/ToggleChip';
import { useExercises } from '@/hooks/domain/useExercises';
import { useActiveWorkout } from '@/store/useActiveWorkout';
import { EmptyStateIcon } from '@/components/feedback/EmptyStateIcon';
import { ROUTES } from '@/constants/routes';
import { useRoutineStore } from '@/store/routineStore';
import { getExerciseName } from '@/utils/exercise';
import { createClientId } from '@/utils/clientId';
import { FONT_SCALE } from '@/tamagui.config';
import { useExerciseFiltering } from '@/hooks/application/useExerciseFiltering';
import { MUSCLE_OPTIONS, EQUIPMENT_OPTIONS, MUSCLE_LABELS, EQUIPMENT_LABELS, getMuscleIconName } from '@/constants/exercise';
import type { Exercise } from 'backend/domain/entities/Exercise';
import { MuscleFilterSheet } from '@/components/workout/MuscleFilterSheet';

export default function ExerciseBrowserScreen() {
  const theme = useTheme();
  const { target, action, targetId, filterMuscle, excludeEquipment } = useLocalSearchParams<{
    target?: string; action?: string; targetId?: string; filterMuscle?: string; excludeEquipment?: string;
  }>();

  const exerciseService = useExercises();
  const addExerciseToActiveWorkout = useActiveWorkout(state => state.addExercise);
  const replaceExerciseActiveWorkout = useActiveWorkout(state => state.replaceExercise);
  const addExerciseToRoutine = useRoutineStore(state => state.addExercise);

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const muscleSheetRef = useRef<BottomSheetModal>(null);

  const { filteredExercises, filters, setFilter } = useExerciseFiltering(exercises, {
    search: '',
    muscleFilter: filterMuscle || '',
    equipmentFilter: '',
    customOnly: false,
  });

  const loadExercises = useCallback(async () => {
    try {
      setLoading(true);
      setExercises(await exerciseService.getAll());
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Error al cargar ejercicios', position: 'top' });
      // eslint-disable-next-line no-console
      console.error('[ExerciseBrowser] loadExercises error:', e);
    } finally {
      setLoading(false);
    }
  }, [exerciseService]);

  useFocusEffect(
    useCallback(() => {
      const mountedRef = { current: true };

      const safeLoad = async () => {
        try {
          if (mountedRef.current) setLoading(true);
          const all = await exerciseService.getAll();
          if (mountedRef.current) setExercises(all ?? []);
        } catch (e) {
          Toast.show({ type: 'error', text1: 'Error al cargar ejercicios', position: 'top' });
          // eslint-disable-next-line no-console
          console.error('[ExerciseBrowser] loadExercises error:', e);
        } finally {
          if (mountedRef.current) setLoading(false);
        }
      };

      void safeLoad();

      return () => { mountedRef.current = false; };
    }, [exerciseService]),
  );

  // Estructura de datos para la lista (separando sugerencias si es "replace")
  const listData = useMemo(() => {
    if (action === 'replace') {
      const suggested = filteredExercises.filter(e => e.equipment !== excludeEquipment);
      const others = filteredExercises.filter(e => e.equipment === excludeEquipment);

      const data: ({ type: 'header'; id: string; title: string } | (Exercise & { type: 'exercise' }))[] = [];
      if (suggested.length > 0) {
        data.push({ type: 'header', id: 'header-suggested', title: '✨ Alternativas Sugeridas' });
        data.push(...suggested.map((e) => ({ ...e, type: 'exercise' as const })));
      }
      if (others.length > 0 || suggested.length > 0) {
        data.push({ type: 'header', id: 'header-others', title: 'Todos los ejercicios' });
        data.push(...others.map((e) => ({ ...e, type: 'exercise' as const })));
      }
      return data.length > 0 ? data : filteredExercises.map(e => ({ ...e, type: 'exercise' as const }));
    }
    return filteredExercises.map(e => ({ ...e, type: 'exercise' as const }));
  }, [filteredExercises, action, excludeEquipment]);

  const handleSelect = useCallback((item: Exercise) => {
    if (target === 'routine') {
      addExerciseToRoutine({ 
        id: item.id, 
        name: item.name, 
        nameEs: item.nameEs, 
        muscle: item.primaryMuscles?.[0] || 'other' 
      });
    } else {
      const activeWorkoutPayload = {
        id: createClientId(),
        exerciseId: item.id, 
        name: item.name, 
        nameEs: item.nameEs,
        sets: [{ id: createClientId(), weight: 0, reps: 0, isCompleted: false, type: 'normal' as const }],
      };

      if (action === 'replace' && targetId) {
        replaceExerciseActiveWorkout(targetId, { ...activeWorkoutPayload, status: 'pending' });
      } else {
        addExerciseToActiveWorkout(activeWorkoutPayload);
      }
    }
    router.back();
  }, [target, action, targetId, addExerciseToRoutine, replaceExerciseActiveWorkout, addExerciseToActiveWorkout]);

  const renderExerciseItem = useCallback(({ item }: { item: (typeof listData)[number] }) => {
    if (item.type === 'header') {
      return (
        <YStack paddingVertical="$sm" paddingHorizontal="$xl" backgroundColor="$background">
          <AppText variant="label" color="textTertiary">{item.title}</AppText>
        </YStack>
      );
    }

    return (
      <Pressable
        onPress={() => handleSelect(item)}
        accessibilityLabel={`Seleccionar ejercicio ${getExerciseName(item)}`}
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
          >
            <MaterialCommunityIcons
              name={getMuscleIconName(item.primaryMuscles?.[0]) as React.ComponentProps<typeof MaterialCommunityIcons>['name']}
              size={24}
              color={theme.textSecondary?.val ?? '#999'}
            />
          </YStack>

          <YStack flex={1}>
            <AppText variant="bodyLg" fontWeight="600">{getExerciseName(item)}</AppText>
            <AppText variant="label" color="textTertiary" marginTop="$xs">
              {item.primaryMuscles?.map(muscle => MUSCLE_LABELS[muscle] ?? muscle).join(', ') || 'Otro'} • {EQUIPMENT_LABELS[item.equipment] ?? item.equipment}
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
  }, [handleSelect, theme.textSecondary?.val]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background?.val ?? '#fff' }} edges={['top', 'bottom']}>
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
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
          <ToggleChip
            variant="solid"
            label="Mis ejercicios"
            isActive={filters.customOnly ?? false}
            onPress={() => setFilter('customOnly', !filters.customOnly)}
          />
        </ScrollView>

        {/* Chips de Categorías Rápidas */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
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
        </ScrollView>
      </YStack>

      {/* Muscle Filter Sheet */}
      <MuscleFilterSheet
        ref={muscleSheetRef}
        selectedMuscle={filters.muscleFilter ?? ''}
        onSelect={(muscle) => setFilter('muscleFilter', muscle)}
        onClose={() => muscleSheetRef.current?.dismiss()}
      />

      {/* List */}
      <FlashList
        data={listData}
        keyExtractor={(item) => item.id}
        getItemType={(item) => item.type}
        renderItem={renderExerciseItem}
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
    </SafeAreaView>
  );
}