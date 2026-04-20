import { renderHook, act } from '@testing-library/react-hooks';
import { useRoutineEditor } from '../hooks/useRoutineEditor';

describe('useRoutineEditor', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(() => useRoutineEditor());
    expect(result.current.routine).toBeDefined();
  });

  it('can update routine name', () => {
    const { result } = renderHook(() => useRoutineEditor());
    act(() => {
      result.current.setName('Routine X');
    });
    expect(result.current.routine.name).toBe('Routine X');
  });
});