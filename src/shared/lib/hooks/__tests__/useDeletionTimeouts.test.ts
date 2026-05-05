import { renderHook, act } from '@testing-library/react-native';
import { useDeletionTimeouts } from '../useDeletionTimeouts';

describe('useDeletionTimeouts', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('ejecuta el callback después del delay', () => {
    const { result } = renderHook(() => useDeletionTimeouts());
    const mockCallback = jest.fn();

    act(() => {
      result.current.setTimeoutFor('test', mockCallback, 1000);
    });

    expect(mockCallback).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(mockCallback).toHaveBeenCalled();
    expect(result.current.deletionTimeouts.current['test']).toBeUndefined();
  });

  it('limpia el timeout existente al llamar a setTimeoutFor con la misma llave', () => {
    const { result } = renderHook(() => useDeletionTimeouts());
    const mockCallback1 = jest.fn();
    const mockCallback2 = jest.fn();

    act(() => {
      result.current.setTimeoutFor('test', mockCallback1, 1000);
      result.current.setTimeoutFor('test', mockCallback2, 1000);
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(mockCallback1).not.toHaveBeenCalled();
    expect(mockCallback2).toHaveBeenCalled();
  });

  it('permite limpiar un timeout manualmente', () => {
    const { result } = renderHook(() => useDeletionTimeouts());
    const mockCallback = jest.fn();

    act(() => {
      result.current.setTimeoutFor('test', mockCallback, 1000);
      result.current.clearTimeoutFor('test');
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(mockCallback).not.toHaveBeenCalled();
    expect(result.current.deletionTimeouts.current['test']).toBeUndefined();
  });

  it('maneja el deshacer (undo) limpiando el timeout y ejecutando el callback de undo', () => {
    const { result } = renderHook(() => useDeletionTimeouts());
    const mockCallback = jest.fn();
    const mockUndoCallback = jest.fn();

    act(() => {
      result.current.setTimeoutFor('test', mockCallback, 1000);
      result.current.undoTimeoutFor('test', mockUndoCallback);
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(mockCallback).not.toHaveBeenCalled();
    expect(mockUndoCallback).toHaveBeenCalled();
  });
});
