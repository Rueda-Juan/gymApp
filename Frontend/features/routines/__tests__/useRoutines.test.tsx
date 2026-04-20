import { renderHook, act } from '@testing-library/react-hooks';
import { useRoutines } from '../hooks/useRoutines';

describe('useRoutines', () => {
  it('returns routines list (basic smoke test)', () => {
    const { result } = renderHook(() => useRoutines());
    expect(Array.isArray(result.current.routines)).toBe(true);
  });

  it('can add a routine (if supported)', () => {
    const { result } = renderHook(() => useRoutines());
    if (result.current.addRoutine) {
      act(() => {
        result.current.addRoutine({ name: 'Test', exercises: [] });
      });
      expect(result.current.routines.some(r => r.name === 'Test')).toBe(true);
    }
  });
});