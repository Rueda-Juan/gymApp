import React from 'react';
import { render } from '@testing-library/react-native';
import { useActiveWorkout } from '@/store/useActiveWorkout';
import { useWorkout } from '@/hooks/useWorkout';
import { usePreviousSets } from '../usePreviousSets';

jest.mock('@/store/useActiveWorkout', () => ({ useActiveWorkout: jest.fn() }));
jest.mock('@/hooks/useWorkout', () => ({ useWorkout: jest.fn() }));

const mockGetPreviousSets = jest.fn();

function setupMocks(workoutId: string | null = 'w-1') {
  (useActiveWorkout as unknown as jest.Mock).mockImplementation((selector: Function) =>
    selector({ workoutId }),
  );
  (useWorkout as jest.Mock).mockReturnValue({
    getPreviousSets: mockGetPreviousSets,
  });
}

function renderHook(activeExerciseId: string | undefined) {
  let result: ReturnType<typeof usePreviousSets>;

  function TestComponent() {
    result = usePreviousSets(activeExerciseId);
    return null;
  }

  const rendered = render(React.createElement(TestComponent));
  return {
    getResult: () => result!,
    rerender: (newId?: string) => {
      function Updated() {
        result = usePreviousSets(newId);
        return null;
      }
      rendered.rerender(React.createElement(Updated));
    },
  };
}

describe('usePreviousSets', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMocks();
    mockGetPreviousSets.mockResolvedValue([]);
  });

  // ═══════════════════════════════════════════════════════════════
  // resolvePreviousWeight
  // ═══════════════════════════════════════════════════════════════

  describe('resolvePreviousWeight', () => {
    it('retorna fallback del set anterior cuando no hay cache', () => {
      // Previene: peso en 0 cuando la cache aún no cargó pero el set anterior tiene datos
      const { getResult } = renderHook('ex-1');

      const exercise = {
        exerciseId: 'ex-1',
        sets: [{ weight: 80 }, { weight: 0 }],
      };

      expect(getResult().resolvePreviousWeight(exercise, 1)).toBe(80);
    });

    it('retorna 0 para el primer set sin cache', () => {
      const { getResult } = renderHook('ex-1');

      const exercise = {
        exerciseId: 'ex-1',
        sets: [{ weight: 0 }],
      };

      expect(getResult().resolvePreviousWeight(exercise, 0)).toBe(0);
    });

    it('retorna peso histórico cuando está en cache', async () => {
      mockGetPreviousSets.mockResolvedValue([
        { weight: 100 },
        { weight: 95 },
      ]);

      const { getResult } = renderHook('ex-1');

      // Wait for useEffect to resolve
      await new Promise(resolve => setTimeout(resolve, 0));

      const exercise = {
        exerciseId: 'ex-1',
        sets: [{ weight: 0 }, { weight: 0 }],
      };

      expect(getResult().resolvePreviousWeight(exercise, 0)).toBe(100);
      expect(getResult().resolvePreviousWeight(exercise, 1)).toBe(95);
    });

    it('usa fallback si el setIndex excede el cache', async () => {
      // Previene: undefined cuando se agregaron más sets que la sesión anterior
      mockGetPreviousSets.mockResolvedValue([{ weight: 80 }]);

      const { getResult } = renderHook('ex-1');
      await new Promise(resolve => setTimeout(resolve, 0));

      const exercise = {
        exerciseId: 'ex-1',
        sets: [{ weight: 70 }, { weight: 0 }],
      };

      expect(getResult().resolvePreviousWeight(exercise, 1)).toBe(70);
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // Carga de datos
  // ═══════════════════════════════════════════════════════════════

  describe('carga de datos', () => {
    it('llama getPreviousSets con el exerciseId activo', () => {
      renderHook('ex-1');

      expect(mockGetPreviousSets).toHaveBeenCalledWith('ex-1');
    });

    it('no llama getPreviousSets sin exerciseId', () => {
      // Previene: request innecesario cuando no hay ejercicio seleccionado
      renderHook(undefined);

      expect(mockGetPreviousSets).not.toHaveBeenCalled();
    });

    it('no pide dos veces el mismo exerciseId', async () => {
      renderHook('ex-1');
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(mockGetPreviousSets).toHaveBeenCalledTimes(1);
    });
  });
});
