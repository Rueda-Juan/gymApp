import { XStack, YStack } from 'tamagui';
import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useTheme } from '@tamagui/core';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { Search, X, Check } from 'lucide-react-native';
import { AppText } from '@/components/ui/AppText';
import { IconButton } from '@/components/ui/AppButton';
import { useExercises } from '@/hooks/useExercises';
import { useActiveWorkout } from '@/store/useActiveWorkout';
import { useRoutineStore } from '@/store/routineStore';
import { getExerciseName } from '@/utils/exercise';

const MUSCLE_OPTIONS = [
  'chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms',
  'quadriceps', 'hamstrings', 'glutes', 'calves', 'abs', 'traps',
];

export default function ExerciseBrowserScreen() {
  const theme = useTheme();
  const { target, action, targetId, filterMuscle, excludeEquipment } = useLocalSearchParams<{
    target?: string; action?: string; targetId?: string; filterMuscle?: string; excludeEquipment?: string;
  }>();
  const exerciseService = useExercises();
  const addExerciseToActiveWorkout = useActiveWorkout(state => state.addExercise);
  const replaceExerciseActiveWorkout = useActiveWorkout(state => state.replaceExercise);
  const addExerciseToRoutine = useRoutineStore(state => state.addExercise);

  const [exercises, setExercises] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeMuscleFilter, setActiveMuscleFilter] = useState<string>('');

  useEffect(() => { loadExercises(); }, []);
  useEffect(() => { if (filterMuscle) setActiveMuscleFilter(filterMuscle); }, [filterMuscle]);

  const loadExercises = async () => {
    try { setExercises(await exerciseService.getAll()); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const filteredExercises = exercises.filter(e => {
    const matchesSearch = getExerciseName(e).toLowerCase().includes(search.toLowerCase());
    const matchesMuscle = activeMuscleFilter ? e.primaryMuscles?.includes(activeMuscleFilter) : true;
    return matchesSearch && matchesMuscle;
  });

  const getListData = () => {
    if (action === 'replace') {
      const suggested = filteredExercises.filter(e => e.equipment !== excludeEquipment);
      const others = filteredExercises.filter(e => e.equipment === excludeEquipment);

      const data: any[] = [];
      if (suggested.length > 0) {
        data.push({ type: 'header', id: 'header-suggested', title: 'âœ¨ Alternativas Sugeridas' });
        data.push(...suggested.map((e: any) => ({ type: 'exercise', ...e })));
      }
      if (others.length > 0 || suggested.length > 0) {
        data.push({ type: 'header', id: 'header-others', title: 'Todos los ejercicios' });
        data.push(...others.map((e: any) => ({ type: 'exercise', ...e })));
      }
      return data.length > 0 ? data : filteredExercises.map(e => ({ type: 'exercise', ...e }));
    }
    return filteredExercises.map(e => ({ type: 'exercise', ...e }));
  };

  const listData = getListData();

  const handleSelect = (item: any) => {
    if (target === 'routine') {
      addExerciseToRoutine({ id: item.id, name: item.name, nameEs: item.nameEs, muscle: item.primaryMuscles?.[0] || 'other' });
    } else if (action === 'replace' && targetId) {
      replaceExerciseActiveWorkout(targetId, {
        id: Math.random().toString(36).substr(2, 9),
        exerciseId: item.id, name: item.name, nameEs: item.nameEs,
        sets: [{ id: Math.random().toString(36).substr(2, 9), weight: 0, reps: 0, isCompleted: false, type: 'normal' }],
        status: 'completed',
      });
    } else {
      addExerciseToActiveWorkout({
        id: Math.random().toString(36).substr(2, 9),
        exerciseId: item.id, name: item.name, nameEs: item.nameEs,
        sets: [{ id: Math.random().toString(36).substr(2, 9), weight: 0, reps: 0, isCompleted: false, type: 'normal' }],
      });
    }
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background?.val }} edges={['top', 'bottom']}>
      {/* Header */}
      <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$xl" paddingVertical="$md">
        <AppText variant="titleSm">Buscar Ejercicio</AppText>
        <IconButton icon={<X size={24} color={theme.color?.val} />} onPress={() => router.back()} />
      </XStack>

      {/* Search Bar */}
      <YStack paddingHorizontal="$lg" marginBottom={activeMuscleFilter ? '$sm' : '$lg'}>
        <XStack
          alignItems="center"
          gap="$sm"
          style={{
            height: 48, borderRadius: 12, borderWidth: 1, paddingHorizontal: 12,
            backgroundColor: theme.surfaceSecondary?.val, borderColor: theme.borderColor?.val,
          }}
        >
          <Search size={20} color={theme.textTertiary?.val} />
          <TextInput
            style={{ flex: 1, color: theme.color?.val, fontSize: 14 }}
            placeholder="Ej. Press de banca..."
            placeholderTextColor={theme.textTertiary?.val}
            value={search}
            onChangeText={setSearch}
            autoFocus={!target}
          />
        </XStack>
      </YStack>

      {/* Muscle Filters */}
      <View style={{ marginBottom: 16 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
          {MUSCLE_OPTIONS.map(muscle => {
            const isActive = activeMuscleFilter === muscle;
            return (
              <TouchableOpacity
                key={muscle}
                onPress={() => setActiveMuscleFilter(isActive ? '' : muscle)}
                style={{
                  alignItems: 'center', justifyContent: 'center',
                  paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
                  backgroundColor: isActive ? theme.primary?.val : theme.surfaceSecondary?.val,
                  borderWidth: 1, borderColor: isActive ? theme.primary?.val : theme.borderColor?.val,
                }}
              >
                <AppText
                  variant="bodySm"
                  style={{
                    color: isActive ? '#FFF' : theme.color?.val,
                    fontWeight: isActive ? '700' : '500',
                    textTransform: 'capitalize',
                  }}
                >
                  {muscle}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* List */}
      <FlashList
        data={listData}
        keyExtractor={(item) => item.id}
        // @ts-ignore
        estimatedItemSize={70}
        getItemType={(item) => item.type}
        renderItem={({ item }) => {
          if (item.type === 'header') {
            return (
              <View style={{ paddingVertical: 12, paddingHorizontal: 16, backgroundColor: theme.background?.val }}>
                <AppText variant="subtitle" color="textSecondary">{item.title}</AppText>
              </View>
            );
          }

          return (
            <TouchableOpacity
              style={{
                flexDirection: 'row', alignItems: 'center',
                paddingHorizontal: 16, paddingVertical: 14,
                borderBottomColor: theme.borderColor?.val, borderBottomWidth: 1,
              }}
              onPress={() => handleSelect(item)}
              activeOpacity={0.7}
            >
              <View
                style={{
                  width: 44, height: 44, borderRadius: 12,
                  backgroundColor: theme.surfaceSecondary?.val,
                  alignItems: 'center', justifyContent: 'center',
                  marginRight: 12, borderWidth: 1, borderColor: theme.borderColor?.val,
                }}
              >
                <AppText variant="bodyLg">ðŸ’ª</AppText>
              </View>
              <View style={{ flex: 1 }}>
                <AppText variant="bodyLg">{getExerciseName(item)}</AppText>
                <AppText variant="label" color="textSecondary" style={{ marginTop: 4, textTransform: 'capitalize' }}>
                  {item.primaryMuscles?.join(', ') || 'other'} â€¢ {item.equipment}
                </AppText>
              </View>
              <View
                style={{
                  width: 32, height: 32, borderRadius: 16,
                  backgroundColor: theme.surface?.val,
                  alignItems: 'center', justifyContent: 'center',
                  borderWidth: 1, borderColor: theme.borderColor?.val,
                }}
              >
                <Check size={16} color={theme.primary?.val} />
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={{ padding: 40, alignItems: 'center' }}>
            <AppText variant="bodyMd" color="textSecondary">
              {loading ? 'Cargando...' : 'No se encontraron ejercicios'}
            </AppText>
          </View>
        }
      />
    </SafeAreaView>
  );
}
