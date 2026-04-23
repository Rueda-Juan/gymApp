import { renderHook, act } from '@testing-library/react-native';
import { useNetworkState } from '../useNetworkState';

describe('useNetworkState', () => {
  it('inicializa con isOnline en true', () => {
    const { result } = renderHook(() => useNetworkState());
    expect(result.current.isOnline).toBe(true);
  });

  it('permite actualizar el estado de red', () => {
    const { result } = renderHook(() => useNetworkState());
    
    act(() => {
      result.current.setIsOnline(false);
    });
    
    expect(result.current.isOnline).toBe(false);
  });
});
