import { useCallback, useMemo } from 'react';
import { getExerciseName } from '@/utils/exercise';

interface Exercise {
  id: string;
  name: string;
  nameEs?: string;
  primaryMuscles?: string[];
  equipment?: string;
  [key: string]: any;
}

interface FilterState {
  search: string;
  muscleFilter?: string;
  equipmentFilter?: string;
}

interface ExerciseFilterResult {
  filteredExercises: Exercise[];
  hasActiveFilters: boolean;
  clearFilters: () => void;
  setFilter: (key: keyof FilterState, value: unknown) => void;
}

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
export function useExerciseFiltering(
  allExercises: Exercise[],
  initialFilters?: FilterState
) {
  // Estado local de filtros (encapsulado)
  const [filters, setFiltersState] = React.useState<FilterState>(
    initialFilters || { search: '', muscleFilter: '', equipmentFilter: '' }
  );

  /**
   * Setter de filtros que permite actualizar cualquier propiedad.
   */
  const setFilter = useCallback((key: keyof FilterState, value: unknown) => {
    setFiltersState(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  /**
   * Limpia todos los filtros activos.
   */
  const clearFilters = useCallback(() => {
    setFiltersState({ search: '', muscleFilter: '', equipmentFilter: '' });
  }, []);

  /**
   * Aplica los filtros al listado de ejercicios.
   * Memoizado para evitar cálculos innecesarios.
   */
  const filteredExercises = useMemo(() => {
    return allExercises.filter(exercise => {
      // Filtro por búsqueda (nombre)
      const matchesSearch = filters.search
        ? getExerciseName(exercise).toLowerCase().includes(filters.search.toLowerCase())
        : true;

      // Filtro por músculo
      const matchesMuscle =
        !filters.muscleFilter ||
        exercise.primaryMuscles?.includes(filters.muscleFilter) ||
        false;

      // Filtro por equipo
      const matchesEquipment =
        !filters.equipmentFilter ||
        exercise.equipment === filters.equipmentFilter;

      return matchesSearch && matchesMuscle && matchesEquipment;
    });
  }, [allExercises, filters]);

  /**
   * Detecta si hay filtros activos (no solo search).
   */
  const hasActiveFilters = useMemo(() => {
    return !!(filters.muscleFilter || filters.equipmentFilter);
  }, [filters.muscleFilter, filters.equipmentFilter]);

  /**
   * Agrupa ejercicios filtrados por músculo (útil para render por sección).
   */
  const exercisesByMuscle = useMemo(() => {
    const grouped = new Map<string, Exercise[]>();

    filteredExercises.forEach(exercise => {
      const muscle = exercise.primaryMuscles?.[0] || 'other';
      if (!grouped.has(muscle)) {
        grouped.set(muscle, []);
      }
      grouped.get(muscle)!.push(exercise);
    });

    return grouped;
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

// Import React al inicio del archivo
import React from 'react';
