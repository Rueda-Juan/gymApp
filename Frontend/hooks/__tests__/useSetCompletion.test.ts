import React, { useEffect } from 'react';
import { render, act } from '@testing-library/react-native';
import { useActiveWorkout } from '@/store/useActiveWorkout';
import { useRestTimer } from '@/store/useRestTimer';
import { useSettings } from '@/store/useSettings';
import { router } from 'expo-router';
import { useSetCompletion } from '../useSetCompletion';

jest.mock('@/store/useActiveWorkout');
jest.mock('@/store/useRestTimer');
jest.mock('@/store/useSettings');
jest.mock('expo-router', () => ({ router: { push: jest.fn() } }));

describe('useSetCompletion', () => {
  const toggleSetComplete = jest.fn();
  const updateSetValues = jest.fn();
  const startTimer = jest.fn();

  const singleSet = { id: 'set-1', weight: 80, reps: 8, isCompleted: false };
  const exerciseWithOneSet = { sets: [singleSet] };

  beforeEach(() => {
    jest.clearAllMocks();
    (useActiveWorkout as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ toggleSetComplete, updateSetValues }),
    );
    (useRestTimer as unknown as jest.Mock).mockReturnValue({ startTimer });
    (useSettings as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ restTimerSeconds: 60 }),
    );
  });

  function renderHook() {
    let completeSetFn: ReturnType<typeof useSetCompletion>['completeSet'];
    function TestComponent() {
      const { completeSet } = useSetCompletion();
      useEffect(() => { completeSetFn = completeSet; }, [completeSet]);
      return null;
    }
    render(React.createElement(TestComponent));
    return { getCompleteSet: () => completeSetFn };
  }

  // ═══════════════════════════════════════════════════════════════
  // Happy Path
  // ═══════════════════════════════════════════════════════════════

  describe('happy path', () => {
    it('toggle + rest timer al completar set incompleto', async () => {
      const { getCompleteSet } = renderHook();

      await act(async () => {
        await getCompleteSet()('ex-1', 'set-1', false, exerciseWithOneSet);
      });

      expect(toggleSetComplete).toHaveBeenCalledWith('ex-1', 'set-1');
      expect(startTimer).toHaveBeenCalledWith(60);
      expect(router.push).toHaveBeenCalledWith('/(workouts)/rest-timer');
    });

    it('usa restTimerSeconds del store de settings', async () => {
      (useSettings as unknown as jest.Mock).mockImplementation((selector) =>
        selector({ restTimerSeconds: 120 }),
      );

      const { getCompleteSet } = renderHook();

      await act(async () => {
        await getCompleteSet()('ex-1', 'set-1', false, exerciseWithOneSet);
      });

      expect(startTimer).toHaveBeenCalledWith(120);
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // Descompletar (toggle off)
  // ═══════════════════════════════════════════════════════════════

  describe('descompletar set', () => {
    it('toggle sin timer ni navegación al descompletar', async () => {
      const { getCompleteSet } = renderHook();

      await act(async () => {
        await getCompleteSet()('ex-1', 'set-1', true, exerciseWithOneSet);
      });

      expect(toggleSetComplete).toHaveBeenCalledWith('ex-1', 'set-1');
      expect(startTimer).not.toHaveBeenCalled();
      expect(router.push).not.toHaveBeenCalled();
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // shouldStartRestTimer = false
  // ═══════════════════════════════════════════════════════════════

  describe('shouldStartRestTimer desactivado', () => {
    it('no inicia timer ni navega cuando shouldStartRestTimer=false', async () => {
      const { getCompleteSet } = renderHook();

      await act(async () => {
        await getCompleteSet()('ex-1', 'set-1', false, exerciseWithOneSet, false);
      });

      expect(toggleSetComplete).toHaveBeenCalledWith('ex-1', 'set-1');
      expect(startTimer).not.toHaveBeenCalled();
      expect(router.push).not.toHaveBeenCalled();
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // Auto-fill desde set anterior
  // ═══════════════════════════════════════════════════════════════

  describe('auto-fill de peso y reps', () => {
    it('copia weight y reps del set anterior cuando el actual está vacío', async () => {
      const previousSet = { id: 'set-0', weight: 100, reps: 5, isCompleted: true };
      const emptySet = { id: 'set-1', weight: 0, reps: 0, isCompleted: false };

      const { getCompleteSet } = renderHook();
      await act(async () => {
        await getCompleteSet()('ex-1', 'set-1', false, { sets: [previousSet, emptySet] });
      });

      expect(updateSetValues).toHaveBeenCalledWith('ex-1', 'set-1', { weight: 100, reps: 5 });
    });

    it('no copia si el set actual ya tiene valores manuales', async () => {
      const previousSet = { id: 'set-0', weight: 100, reps: 5, isCompleted: true };
      const filledSet = { id: 'set-1', weight: 80, reps: 8, isCompleted: false };

      const { getCompleteSet } = renderHook();
      await act(async () => {
        await getCompleteSet()('ex-1', 'set-1', false, { sets: [previousSet, filledSet] });
      });

      expect(updateSetValues).not.toHaveBeenCalled();
    });

    it('no copia para el primer set (sin set anterior)', async () => {
      const { getCompleteSet } = renderHook();

      await act(async () => {
        await getCompleteSet()('ex-1', 'set-1', false, exerciseWithOneSet);
      });

      expect(updateSetValues).not.toHaveBeenCalled();
    });

    it('no copia si el set anterior también está vacío (weight=0, reps=0)', async () => {
      // Previene: copiar 0/0 del set anterior cuando ambos están vacíos
      const emptyPrev = { id: 'set-0', weight: 0, reps: 0, isCompleted: true };
      const emptyCurr = { id: 'set-1', weight: 0, reps: 0, isCompleted: false };

      const { getCompleteSet } = renderHook();
      await act(async () => {
        await getCompleteSet()('ex-1', 'set-1', false, { sets: [emptyPrev, emptyCurr] });
      });

      expect(updateSetValues).not.toHaveBeenCalled();
    });

    it('copia si el set actual tiene solo weight>0 (se considera con valores manuales)', async () => {
      // Previene: sobreescribir valor que el usuario ya editó
      const previousSet = { id: 'set-0', weight: 100, reps: 5, isCompleted: true };
      const partialSet = { id: 'set-1', weight: 50, reps: 0, isCompleted: false };

      const { getCompleteSet } = renderHook();
      await act(async () => {
        await getCompleteSet()('ex-1', 'set-1', false, { sets: [previousSet, partialSet] });
      });

      expect(updateSetValues).not.toHaveBeenCalled();
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // Edge cases
  // ═══════════════════════════════════════════════════════════════

  describe('edge cases', () => {
    it('setId no encontrado en exercise.sets — no crashea', async () => {
      // Previene: crash si el set fue eliminado mientras se procesaba
      const { getCompleteSet } = renderHook();

      await act(async () => {
        await getCompleteSet()('ex-1', 'set-999', false, exerciseWithOneSet);
      });

      expect(toggleSetComplete).toHaveBeenCalledWith('ex-1', 'set-999');
      expect(updateSetValues).not.toHaveBeenCalled();
    });

    it('exercise con array de sets vacío — no crashea', async () => {
      const { getCompleteSet } = renderHook();

      await act(async () => {
        await getCompleteSet()('ex-1', 'set-1', false, { sets: [] });
      });

      expect(toggleSetComplete).toHaveBeenCalled();
      expect(updateSetValues).not.toHaveBeenCalled();
    });
  });
});

