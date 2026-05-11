import { renderHook, act } from '@testing-library/react-native';
import { useOfflineQueue } from '../useOfflineQueue';

describe('useOfflineQueue', () => {
  it('inicializa con una cola vacía', () => {
    const { result } = renderHook(() => useOfflineQueue());
    expect(result.current.queue).toEqual([]);
  });

  it('permite actualizar la cola', () => {
    const { result } = renderHook(() => useOfflineQueue());
    const mockTask = { id: 1, action: 'sync' };
    
    act(() => {
      result.current.setQueue([mockTask] as any);
    });
    
    expect(result.current.queue).toEqual([mockTask]);
  });
});
