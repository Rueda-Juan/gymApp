import React from 'react';
import { render, act } from '@testing-library/react-native';
import { useActiveWorkout } from '@/store/useActiveWorkout';
import { useSupersetNavigation } from '../useSupersetNavigation';

jest.mock('@/store/useActiveWorkout');

interface MockExercise {
  id: string;
  exerciseId: string;
  supersetGroup: number | null;
  sets: { id: string; isCompleted: boolean }[];
}

const setCurrentExercise = jest.fn();

function mockStore(exercises: MockExercise[], currentIndex: number) {
  (useActiveWorkout as unknown as jest.Mock).mockImplementation((selector: Function) =>
    selector({
      exercises,
      currentExerciseIndex: currentIndex,
      setCurrentExercise,
    }),
  );
}

function renderHook() {
  let result: ReturnType<typeof useSupersetNavigation>;

  function TestComponent() {
    result = useSupersetNavigation();
    return null;
  }

  render(React.createElement(TestComponent));
  return { getResult: () => result! };
}

function createExercise(
  id: string,
  supersetGroup: number | null,
  setsCompleted: boolean[],
): MockExercise {
  return {
    id,
    exerciseId: `ex-${id}`,
    supersetGroup,
    sets: setsCompleted.map((completed, i) => ({
      id: `${id}-set-${i}`,
      isCompleted: completed,
    })),
  };
}

describe('useSupersetNavigation', () => {
  beforeEach(() => jest.clearAllMocks());

  // ═══════════════════════════════════════════════════════════════
  // getNextExerciseIndex — sin superset
  // ═══════════════════════════════════════════════════════════════

  describe('getNextExerciseIndex — sin superset', () => {
    it('retorna el índice siguiente en una lista simple', () => {
      mockStore([
        createExercise('a', null, [false]),
        createExercise('b', null, [false]),
        createExercise('c', null, [false]),
      ], 0);

      const { getResult } = renderHook();

      expect(getResult().getNextExerciseIndex(0)).toBe(1);
      expect(getResult().getNextExerciseIndex(1)).toBe(2);
    });

    it('retorna null en el último ejercicio', () => {
      mockStore([
        createExercise('a', null, [false]),
        createExercise('b', null, [false]),
      ], 0);

      const { getResult } = renderHook();

      expect(getResult().getNextExerciseIndex(1)).toBeNull();
    });

    it('retorna null con array vacío', () => {
      // Previene: crash al navegar sin ejercicios cargados
      mockStore([], 0);

      const { getResult } = renderHook();

      expect(getResult().getNextExerciseIndex(0)).toBeNull();
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // getNextExerciseIndex — con superset
  // ═══════════════════════════════════════════════════════════════

  describe('getNextExerciseIndex — con superset', () => {
    it('avanza al siguiente ejercicio dentro del mismo grupo', () => {
      // Previene: superset salta directo al siguiente bloque en vez de rotar
      mockStore([
        createExercise('a', 1, [false]),
        createExercise('b', 1, [false]),
        createExercise('c', null, [false]),
      ], 0);

      const { getResult } = renderHook();

      expect(getResult().getNextExerciseIndex(0)).toBe(1);
    });

    it('después del último del grupo, salta al siguiente exercise global', () => {
      mockStore([
        createExercise('a', 1, [false]),
        createExercise('b', 1, [false]),
        createExercise('c', null, [false]),
      ], 0);

      const { getResult } = renderHook();

      expect(getResult().getNextExerciseIndex(1)).toBe(2);
    });

    it('retorna null si el último del grupo es también el último ejercicio', () => {
      mockStore([
        createExercise('a', null, [false]),
        createExercise('b', 1, [false]),
        createExercise('c', 1, [false]),
      ], 0);

      const { getResult } = renderHook();

      expect(getResult().getNextExerciseIndex(2)).toBeNull();
    });

    it('superset de 3 ejercicios navega correctamente', () => {
      mockStore([
        createExercise('a', 1, [false]),
        createExercise('b', 1, [false]),
        createExercise('c', 1, [false]),
        createExercise('d', null, [false]),
      ], 0);

      const { getResult } = renderHook();

      expect(getResult().getNextExerciseIndex(0)).toBe(1);
      expect(getResult().getNextExerciseIndex(1)).toBe(2);
      expect(getResult().getNextExerciseIndex(2)).toBe(3);
    });

    it('múltiples supersets independientes', () => {
      // Previene: grupos diferentes se mezclan
      mockStore([
        createExercise('a', 1, [false]),
        createExercise('b', 1, [false]),
        createExercise('c', 2, [false]),
        createExercise('d', 2, [false]),
      ], 0);

      const { getResult } = renderHook();

      expect(getResult().getNextExerciseIndex(0)).toBe(1); // a→b (grupo 1)
      expect(getResult().getNextExerciseIndex(1)).toBe(2); // b→c (sale grupo 1)
      expect(getResult().getNextExerciseIndex(2)).toBe(3); // c→d (grupo 2)
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // isCurrentGroupCompleted
  // ═══════════════════════════════════════════════════════════════

  describe('isCurrentGroupCompleted', () => {
    it('true cuando todos los sets del ejercicio actual están completos (sin superset)', () => {
      mockStore([
        createExercise('a', null, [true, true]),
      ], 0);

      const { getResult } = renderHook();

      expect(getResult().isCurrentGroupCompleted()).toBe(true);
    });

    it('false cuando algún set está incompleto (sin superset)', () => {
      mockStore([
        createExercise('a', null, [true, false]),
      ], 0);

      const { getResult } = renderHook();

      expect(getResult().isCurrentGroupCompleted()).toBe(false);
    });

    it('true cuando todo el superset está completo', () => {
      mockStore([
        createExercise('a', 1, [true, true]),
        createExercise('b', 1, [true]),
      ], 0);

      const { getResult } = renderHook();

      expect(getResult().isCurrentGroupCompleted()).toBe(true);
    });

    it('false si un ejercicio del group tiene sets incompletos', () => {
      // Previene: mostrar "completado" cuando un ejercicio del superset falta
      mockStore([
        createExercise('a', 1, [true, true]),
        createExercise('b', 1, [false]),
      ], 0);

      const { getResult } = renderHook();

      expect(getResult().isCurrentGroupCompleted()).toBe(false);
    });

    it('false cuando no hay ejercicios', () => {
      mockStore([], 0);

      const { getResult } = renderHook();

      expect(getResult().isCurrentGroupCompleted()).toBe(false);
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // supersetGroupExercises
  // ═══════════════════════════════════════════════════════════════

  describe('supersetGroupExercises', () => {
    it('retorna solo el índice actual si no hay superset', () => {
      mockStore([
        createExercise('a', null, [false]),
        createExercise('b', null, [false]),
      ], 0);

      const { getResult } = renderHook();

      expect(getResult().supersetGroupExercises).toEqual([0]);
    });

    it('retorna todos los índices del grupo superset', () => {
      mockStore([
        createExercise('a', 1, [false]),
        createExercise('b', 1, [false]),
        createExercise('c', null, [false]),
      ], 0);

      const { getResult } = renderHook();

      expect(getResult().supersetGroupExercises).toEqual([0, 1]);
    });

    it('retorna grupo correcto desde el segundo ejercicio del superset', () => {
      // Previene: navegación desde mitad del superset muestra grupo incorrecto
      mockStore([
        createExercise('a', 1, [false]),
        createExercise('b', 1, [false]),
        createExercise('c', null, [false]),
      ], 1);

      const { getResult } = renderHook();

      expect(getResult().supersetGroupExercises).toEqual([0, 1]);
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // moveToNextExercise
  // ═══════════════════════════════════════════════════════════════

  describe('moveToNextExercise', () => {
    it('llama setCurrentExercise con el siguiente índice', () => {
      mockStore([
        createExercise('a', null, [false]),
        createExercise('b', null, [false]),
      ], 0);

      const { getResult } = renderHook();

      act(() => { getResult().moveToNextExercise(); });

      expect(setCurrentExercise).toHaveBeenCalledWith(1);
    });

    it('no llama setCurrentExercise en el último ejercicio', () => {
      // Previene: crash por navegar más allá del último ejercicio
      mockStore([
        createExercise('a', null, [false]),
      ], 0);

      const { getResult } = renderHook();

      act(() => { getResult().moveToNextExercise(); });

      expect(setCurrentExercise).not.toHaveBeenCalled();
    });
  });
});
