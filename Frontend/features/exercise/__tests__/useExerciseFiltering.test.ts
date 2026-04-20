import React from 'react';
import { render, act } from '@testing-library/react-native';
import { useExerciseFiltering } from '@/features/exercise/hooks/useExerciseFiltering';

import type { ExerciseDTO } from '@shared';

jest.mock('@/utils/exercise', () => ({
  getExerciseName: (ex: { name: string; nameEs?: string }) => ex.nameEs ?? ex.name,
}));

// Cast so we don't have to define all 30 properties
const EXERCISES: ExerciseDTO[] = [
  { id: '1', name: 'Bench Press', primaryMuscles: ['chest'], secondaryMuscles: [], equipment: 'barbell', type: 'compound', loadType: 'weighted' },
  { id: '2', name: 'Squat', primaryMuscles: ['quads'], secondaryMuscles: [], equipment: 'barbell', type: 'compound', loadType: 'weighted' },
  { id: '3', name: 'Bicep Curl', primaryMuscles: ['biceps'], secondaryMuscles: [], equipment: 'dumbbell', type: 'isolation', loadType: 'weighted' },
  { id: '4', name: 'Tricep Extension', primaryMuscles: ['triceps'], secondaryMuscles: [], equipment: 'cable', type: 'isolation', loadType: 'weighted' },
  { id: '5', name: 'Pull Up', primaryMuscles: ['back'], secondaryMuscles: [], equipment: 'bodyweight', type: 'compound', loadType: 'bodyweight' },
];

function renderHook(exercises: ExerciseDTO[] = EXERCISES) {
  let result: ReturnType<typeof useExerciseFiltering>;

  function TestComponent() {
    result = useExerciseFiltering(exercises);
    return null;
  }

  const { rerender } = render(React.createElement(TestComponent));
  return {
    getResult: () => result!,
    rerender: () => rerender(React.createElement(TestComponent)),
  };
}

describe('useExerciseFiltering', () => {

  // ═══════════════════════════════════════════════════════════════
  // Happy Path
  // ═══════════════════════════════════════════════════════════════

  describe('happy path', () => {
    it('retorna todos los ejercicios sin filtros activos', () => {
      const { getResult } = renderHook();

      expect(getResult().filteredExercises).toHaveLength(5);
      expect(getResult().hasActiveFilters).toBe(false);
    });

    it('filtra por búsqueda de texto (nameEs)', () => {
      const { getResult, rerender } = renderHook();

      act(() => { getResult().setFilter('search', 'Banca'); });
      rerender();

      expect(getResult().filteredExercises).toHaveLength(1);
      expect(getResult().filteredExercises[0].id).toBe('1');
    });

    it('filtra por músculo primario', () => {
      const { getResult, rerender } = renderHook();

      act(() => { getResult().setFilter('muscleFilter', 'chest'); });
      rerender();

      expect(getResult().filteredExercises).toHaveLength(1);
      expect(getResult().filteredExercises[0].id).toBe('1');
    });

    it('filtra por equipo', () => {
      const { getResult, rerender } = renderHook();

      act(() => { getResult().setFilter('equipmentFilter', 'barbell'); });
      rerender();

      expect(getResult().filteredExercises).toHaveLength(2);
      const ids = getResult().filteredExercises.map(e => e.id);
      expect(ids).toContain('1');
      expect(ids).toContain('2');
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // Búsqueda
  // ═══════════════════════════════════════════════════════════════

  describe('búsqueda', () => {
    it('es case-insensitive', () => {
      // Previene: búsqueda que no encuentra por diferencia de mayúsculas
      const { getResult, rerender } = renderHook();

      act(() => { getResult().setFilter('search', 'BANCA'); });
      rerender();

      expect(getResult().filteredExercises).toHaveLength(1);
    });

    it('búsqueda parcial funciona', () => {
      const { getResult, rerender } = renderHook();

      act(() => { getResult().setFilter('search', 'Cur'); });
      rerender();

      expect(getResult().filteredExercises).toHaveLength(1);
      expect(getResult().filteredExercises[0].id).toBe('3');
    });

    it('búsqueda sin resultados retorna array vacío', () => {
      const { getResult, rerender } = renderHook();

      act(() => { getResult().setFilter('search', 'zzzzz'); });
      rerender();

      expect(getResult().filteredExercises).toHaveLength(0);
    });

    it('búsqueda vacía muestra todos', () => {
      const { getResult, rerender } = renderHook();

      act(() => { getResult().setFilter('search', 'Banca'); });
      rerender();
      expect(getResult().filteredExercises).toHaveLength(1);

      act(() => { getResult().setFilter('search', ''); });
      rerender();
      expect(getResult().filteredExercises).toHaveLength(5);
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // Filtros combinados
  // ═══════════════════════════════════════════════════════════════

  describe('filtros combinados', () => {
    it('search + muscleFilter al mismo tiempo', () => {
      // Previene: filtros combinados no se aplican conjuntamente
      const { getResult, rerender } = renderHook();

      act(() => {
        getResult().setFilter('search', 'Press');
        getResult().setFilter('muscleFilter', 'chest');
      });
      rerender();

      expect(getResult().filteredExercises).toHaveLength(1);
      expect(getResult().filteredExercises[0].id).toBe('1');
    });

    it('search + muscleFilter incompatibles retorna vacío', () => {
      const { getResult, rerender } = renderHook();

      act(() => {
        getResult().setFilter('search', 'Sentadilla');
        getResult().setFilter('muscleFilter', 'chest');
      });
      rerender();

      expect(getResult().filteredExercises).toHaveLength(0);
    });

    it('equipmentFilter + muscleFilter juntos', () => {
      const { getResult, rerender } = renderHook();

      act(() => {
        getResult().setFilter('equipmentFilter', 'barbell');
        getResult().setFilter('muscleFilter', 'quadriceps');
      });
      rerender();

      expect(getResult().filteredExercises).toHaveLength(1);
      expect(getResult().filteredExercises[0].id).toBe('2');
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // clearFilters
  // ═══════════════════════════════════════════════════════════════

  describe('clearFilters', () => {
    it('limpia todos los filtros activos', () => {
      const { getResult, rerender } = renderHook();

      act(() => {
        getResult().setFilter('search', 'Banca');
        getResult().setFilter('muscleFilter', 'chest');
      });
      rerender();
      expect(getResult().filteredExercises).toHaveLength(1);

      act(() => { getResult().clearFilters(); });
      rerender();

      expect(getResult().filteredExercises).toHaveLength(5);
      expect(getResult().hasActiveFilters).toBe(false);
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // hasActiveFilters
  // ═══════════════════════════════════════════════════════════════

  describe('hasActiveFilters', () => {
    it('false sin filtros', () => {
      const { getResult } = renderHook();
      expect(getResult().hasActiveFilters).toBe(false);
    });

    it('true con solo search', () => {
      const { getResult, rerender } = renderHook();

      act(() => { getResult().setFilter('search', 'algo'); });
      rerender();

      expect(getResult().hasActiveFilters).toBe(true);
    });

    it('true con solo muscleFilter', () => {
      const { getResult, rerender } = renderHook();

      act(() => { getResult().setFilter('muscleFilter', 'chest'); });
      rerender();

      expect(getResult().hasActiveFilters).toBe(true);
    });

    it('true con solo equipmentFilter', () => {
      const { getResult, rerender } = renderHook();

      act(() => { getResult().setFilter('equipmentFilter', 'barbell'); });
      rerender();

      expect(getResult().hasActiveFilters).toBe(true);
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // exercisesByMuscle
  // ═══════════════════════════════════════════════════════════════

  describe('exercisesByMuscle', () => {
    it('agrupa ejercicios por músculo primario', () => {
      const { getResult } = renderHook();
      const grouped = getResult().exercisesByMuscle;

      expect(grouped.get('chest')).toHaveLength(1);
      expect(grouped.get('quadriceps')).toHaveLength(1);
      expect(grouped.get('biceps')).toHaveLength(1);
    });

    it('ejercicio sin primaryMuscles se agrupa como "other"', () => {
      // Previene: crash al acceder primaryMuscles[0] en ejercicio sin músculos
      const noMuscleExercise = [
        { id: '99', name: 'Mystery', primaryMuscles: undefined, equipment: undefined },
      ] as unknown as any[];
      const { getResult } = renderHook(noMuscleExercise);

      expect(getResult().exercisesByMuscle.get('other')).toHaveLength(1);
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // Edge cases
  // ═══════════════════════════════════════════════════════════════

  describe('edge cases', () => {
    it('array vacío de ejercicios', () => {
      const { getResult } = renderHook([]);

      expect(getResult().filteredExercises).toHaveLength(0);
      expect(getResult().exercisesByMuscle.size).toBe(0);
    });

    it('ejercicio sin equipment no matchea filtro de equipment', () => {
      // Previene: undefined === 'barbell' evaluando truthy
      const { getResult, rerender } = renderHook();

      act(() => { getResult().setFilter('equipmentFilter', 'barbell'); });
      rerender();

      const ids = getResult().filteredExercises.map(e => e.id);
      expect(ids).not.toContain('5'); // Pull Up no tiene equipment
    });
  });
});
