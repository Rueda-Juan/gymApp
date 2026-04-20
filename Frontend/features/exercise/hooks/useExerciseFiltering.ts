import { useState, useCallback, useMemo } from 'react';
import type { ExerciseDTO } from '@shared';
import { getExerciseName } from '@/utils/exercise';
import { HIERARCHICAL_MUSCLES } from '@/constants/exercise';

interface FilterState {
  search: string;
  muscleFilter?: string;
  equipmentFilter?: string;
  customOnly?: boolean;
}

const DEFAULT_FILTERS: FilterState = {
  search: '',
  muscleFilter: '',
  equipmentFilter: '',
  customOnly: false,
};

const UNCATEGORIZED_MUSCLE = 'other';

/**
 * useExerciseFiltering — Encapsula la lógica de filtrado de ejercicios
 *
 * Responsabilidades:
 * - Filtrar por búsqueda (nombre)
 * - Filtrar por músculo primario
 * - Filtrar por equipo
 * - Detectar si hay filtros activos
 * - Memoizar resultados para evitar re-renders innecesarios
 */
export function useExerciseFiltering<T extends ExerciseDTO>(
  allExercises: T[],
  initialFilters?: FilterState
) {
  const [filters, setFiltersState] = useState<FilterState>(
    initialFilters ?? DEFAULT_FILTERS
  );

  const setFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFiltersState(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  const filteredExercises = useMemo(() => {
    return allExercises.filter(exercise => {
      const matchesSearch = filters.search
        ? getExerciseName(exercise).toLowerCase().includes(filters.search.toLowerCase())
        : true;

      const categoryMatch = HIERARCHICAL_MUSCLES.find((h) => h.category === filters.muscleFilter);
      const musclesToMatch = categoryMatch?.subdivisions
        ? [filters.muscleFilter, ...categoryMatch.subdivisions]
        : [filters.muscleFilter || ''];

      const matchesMuscle =
        !filters.muscleFilter ||
        (exercise.primaryMuscles as string[] | undefined)?.some(m => musclesToMatch.includes(m)) ||
        false;

      const matchesEquipment =
        !filters.equipmentFilter ||
        exercise.equipment === filters.equipmentFilter;


        return matchesSearch && matchesMuscle && matchesEquipment;
    });
  }, [allExercises, filters]);

  const hasActiveFilters = useMemo(() => {
    return !!(
      filters.search ||
      filters.muscleFilter ||
      filters.equipmentFilter ||
      filters.customOnly
    );
  }, [filters.search, filters.muscleFilter, filters.equipmentFilter, filters.customOnly]);

  const exercisesByMuscle = useMemo(() => {
    return filteredExercises.reduce((grouped, exercise) => {
      const muscle = exercise.primaryMuscles?.[0] ?? UNCATEGORIZED_MUSCLE;
      const existingGroup = grouped.get(muscle);
      if (existingGroup) {
        existingGroup.push(exercise);
      } else {
        grouped.set(muscle, [exercise]);
      }
      return grouped;
    }, new Map<string, T[]>());
  }, [filteredExercises]);

  return {
    filteredExercises,
    exercisesByMuscle,
    hasActiveFilters,
    filters,
    clearFilters,
    setFilter,
  };
}
