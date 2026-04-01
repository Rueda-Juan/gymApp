import { XStack, YStack, ScrollView, useTheme } from 'tamagui';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Pressable, TextInput, FlatList } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, X, Dumbbell } from 'lucide-react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AppText } from '@/components/ui/AppText';
import { AppIcon } from '@/components/ui/AppIcon';
import { IconButton } from '@/components/ui/AppButton';
import { useExercises } from '@/hooks/useExercises';
import { useActiveWorkout } from '@/store/useActiveWorkout';
import { useRoutineStore } from '@/store/routineStore';
import { getExerciseName } from '@/utils/exercise';
import { createClientId } from '@/utils/clientId';
import { FONT_SCALE } from '@/tamagui.config';
import type { Exercise } from 'backend/domain/entities/Exercise';

const MUSCLE_OPTIONS = [
  'chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms',
  'quadriceps', 'hamstrings', 'glutes', 'calves', 'abs', 'traps',
] as const;

const EQUIPMENT_OPTIONS = [
  'barbell', 'dumbbell', 'machine', 'cable', 'bodyweight', 'band', 'other',
] as const;

const MUSCLE_LABELS: Record<string, string> = {
  chest: 'Pecho', back: 'Espalda', shoulders: 'Hombros',
  biceps: 'Bíceps', triceps: 'Tríceps', forearms: 'Antebrazos',
  quadriceps: 'Cuádriceps', hamstrings: 'Isquiotibiales',
  glutes: 'Glúteos', calves: 'Pantorrillas', abs: 'Abdominales', traps: 'Trapecios',
};

const EQUIPMENT_LABELS: Record<string, string> = {
  barbell: 'Barra', dumbbell: 'Mancuernas', machine: 'Máquina',
  cable: 'Cable', bodyweight: 'Peso corporal', band: 'Banda', other: 'Otro',
};

const getMuscleIconName = (muscle?: string) => {
  const m = muscle?.toLowerCase() || '';
  if (['biceps', 'triceps', 'forearms'].includes(m)) return 'arm-flex';
  if (['quadriceps', 'hamstrings', 'calves', 'glutes'].includes(m)) return 'run';
  if (['chest', 'abs'].includes(m)) return 'human';
  if (['back', 'shoulders', 'traps'].includes(m)) return 'human-handsup';
  return 'dumbbell';
};

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

  // Estados locales para los filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMuscle, setActiveMuscle] = useState(filterMuscle || '');
  const [activeEquipment, setActiveEquipment] = useState('');

  useEffect(() => {
    const loadExercises = async () => {
      try { 
        setExercises(await exerciseService.getAll()); 
      } catch (e) { 
        console.error(e);
      } finally { 
        setLoading(false); 
      }
    };
    loadExercises();
  }, [exerciseService]);

  const filteredExercises = useMemo(() => {
    return exercises.filter(exercise => {
      const matchSearch = searchQuery === '' || getExerciseName(exercise).toLowerCase().includes(searchQuery.toLowerCase());
      const matchMuscle = activeMuscle === '' || exercise.primaryMuscles?.includes(activeMuscle as (typeof exercise.primaryMuscles)[number]);
      const matchEquipment = activeEquipment === '' || exercise.equipment === activeEquipment;
      
      return matchSearch && matchMuscle && matchEquipment;
    });
  }, [exercises, searchQuery, activeMuscle, activeEquipment]);

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
    } else if (action === 'replace' && targetId) {
      replaceExerciseActiveWorkout(targetId, {
        id: createClientId(),
        exerciseId: item.id, 
        name: item.name, 
        nameEs: item.nameEs,
        sets: [{ id: createClientId(), weight: 0, reps: 0, isCompleted: false, type: 'normal' }],
        status: 'pending',
      });
    } else {
      addExerciseToActiveWorkout({
        id: createClientId(),
        exerciseId: item.id, 
        name: item.name, 
        nameEs: item.nameEs,
        sets: [{ id: createClientId(), weight: 0, reps: 0, isCompleted: false, type: 'normal' }],
      });
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
              name={getMuscleIconName(item.primaryMuscles?.[0])}
              size={24}
              color={theme.textSecondary?.val as string}
            />
          </YStack>

          <YStack flex={1}>
            <AppText variant="bodyLg" fontWeight="600">{getExerciseName(item)}</AppText>
            <AppText variant="label" color="textTertiary" marginTop={4}>
              {item.primaryMuscles?.map(m => MUSCLE_LABELS[m] ?? m).join(', ') || 'Otro'} • {EQUIPMENT_LABELS[item.equipment] ?? item.equipment}
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
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background?.val as string }} edges={['top', 'bottom']}>
      {/* Header */}
      <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$xl" paddingVertical="$md">
        <AppText variant="titleSm">Buscar Ejercicio</AppText>
        <IconButton icon={<AppIcon icon={X} color="color" size={24} />} onPress={() => router.back()} />
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
            style={{ flex: 1, color: theme.color?.val as string, fontSize: FONT_SCALE.sizes[3] }}
            placeholder="Ej. Press de banca..."
            placeholderTextColor={theme.textTertiary?.val as string}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={!target}
          />
        </XStack>
      </YStack>

      {/* Filters (Muscles & Equipment) */}
      <YStack marginBottom="$md" gap="$sm">
        {/* Fila de Músculos */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
          {MUSCLE_OPTIONS.map(muscle => {
            const isActive = activeMuscle === muscle;
            return (
              <Pressable key={muscle} onPress={() => setActiveMuscle(isActive ? '' : muscle)}>
                <YStack
                  alignItems="center"
                  justifyContent="center"
                  paddingHorizontal="$md"
                  paddingVertical="$sm"
                  borderRadius="$full"
                  backgroundColor={isActive ? "$primary" : "$surfaceSecondary"}
                  borderWidth={1}
                  borderColor={isActive ? "$primary" : "$borderColor"}
                >
                  <AppText
                    variant="bodySm"
                    fontWeight={isActive ? '700' : '500'}
                    color={isActive ? "background" : "color"}
                    style={{ textTransform: 'capitalize' }}
                  >
                    {MUSCLE_LABELS[muscle] ?? muscle}
                  </AppText>
                </YStack>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Fila de Equipamiento */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
          {EQUIPMENT_OPTIONS.map(equipment => {
            const isActive = activeEquipment === equipment;
            return (
              <Pressable key={equipment} onPress={() => setActiveEquipment(isActive ? '' : equipment)}>
                <YStack
                  alignItems="center"
                  justifyContent="center"
                  paddingHorizontal="$md"
                  paddingVertical="$sm"
                  borderRadius="$sm"
                  backgroundColor={isActive ? "$secondary" : "transparent"}
                  borderWidth={1}
                  borderColor={isActive ? "$secondary" : "$borderColor"}
                >
                  <AppText
                    variant="label"
                    fontWeight={isActive ? '700' : '600'}
                    color={isActive ? "background" : "textSecondary"}
                  >
                    {EQUIPMENT_LABELS[equipment] ?? equipment}
                  </AppText>
                </YStack>
              </Pressable>
            );
          })}
        </ScrollView>
      </YStack>

      {/* List */}
      <FlatList
        data={listData}
        keyExtractor={(item) => item.id}
        initialNumToRender={15}
        windowSize={5}
        renderItem={renderExerciseItem}
        ListEmptyComponent={
          <YStack padding="$5xl" alignItems="center">
            <AppText variant="bodyMd" color="textSecondary">
              {loading ? 'Cargando...' : 'No se encontraron ejercicios con esos filtros'}
            </AppText>
          </YStack>
        }
      />
    </SafeAreaView>
  );
}