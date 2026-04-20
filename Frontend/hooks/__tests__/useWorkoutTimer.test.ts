import React from 'react';
import { render, act } from '@testing-library/react-native';
import { useActiveWorkout } from '@/store/useActiveWorkout';
import { useWorkoutTimer } from '@/hooks/application/useWorkoutTimer';

jest.mock('@/store/useActiveWorkout');
jest.mock('@/utils/time', () => ({
  formatElapsedTime: (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  },
}));

function mockStartTime(startTime: number | null) {
  (useActiveWorkout as unknown as jest.Mock).mockImplementation((selector: Function) =>
    selector({ startTime }),
  );
}

function renderHook() {
  let result: ReturnType<typeof useWorkoutTimer>;

  function TestComponent() {
    result = useWorkoutTimer();
    return null;
  }

  const rendered = render(React.createElement(TestComponent));
  return {
    getResult: () => result!,
    unmount: rendered.unmount,
    rerender: () => rendered.rerender(React.createElement(TestComponent)),
  };
}

describe('useWorkoutTimer', () => {
// MOVED: Este test fue migrado a features/workout/__tests__/useWorkoutTimer.test.ts
      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);
      mockStartTime(now - 5000);

      const { getResult } = renderHook();

      act(() => { jest.advanceTimersByTime(1000); });

      expect(getResult().elapsedSeconds).toBe(5);
    });

    it('incrementa con cada tick', () => {
      const now = Date.now();
      let currentTime = now;
      jest.spyOn(Date, 'now').mockImplementation(() => currentTime);
      mockStartTime(now - 1000);

      const { getResult } = renderHook();

      currentTime = now;
      act(() => { jest.advanceTimersByTime(1000); });
      expect(getResult().elapsedSeconds).toBe(1);

      currentTime = now + 1000;
      act(() => { jest.advanceTimersByTime(1000); });
      expect(getResult().elapsedSeconds).toBe(2);
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // Reset
  // ═══════════════════════════════════════════════════════════════

  describe('reset al limpiar startTime', () => {
    it('resetea a 0 cuando startTime pasa a null', () => {
      // Previene: timer muestra tiempo anterior después de finalizar workout
      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);
      mockStartTime(now - 60000);

      const { getResult, rerender } = renderHook();

      act(() => { jest.advanceTimersByTime(1000); });
      expect(getResult().elapsedSeconds).toBeGreaterThan(0);

      mockStartTime(null);
      rerender();

      expect(getResult().elapsedSeconds).toBe(0);
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // Formato
  // ═══════════════════════════════════════════════════════════════

  describe('formato', () => {
    it('expone formatTime como función de utilidad', () => {
      mockStartTime(null);
      const { getResult } = renderHook();

      expect(typeof getResult().formatTime).toBe('function');
      expect(getResult().formatTime(90)).toBe('01:30');
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // Cleanup
  // ═══════════════════════════════════════════════════════════════

  describe('cleanup', () => {
    it('limpia el intervalo al desmontarse', () => {
      // Previene: memory leak por intervalo no limpiado
      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);
      mockStartTime(now);

      const spyClear = jest.spyOn(global, 'clearInterval');
      const { unmount } = renderHook();

      unmount();

      expect(spyClear).toHaveBeenCalled();
      spyClear.mockRestore();
    });
  });
});
