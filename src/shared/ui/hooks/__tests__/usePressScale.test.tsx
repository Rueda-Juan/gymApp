import { renderHook, act } from '@testing-library/react-native';
import { usePressScale } from '../../../lib/hooks/usePressScale';

jest.mock('@/shared/lib/hooks/useMotion', () => ({
  useMotion: () => ({ isReduced: false })
}));


describe('usePressScale', () => {
  it('should scale down on press in and reset on press out', () => {
    const { result } = renderHook(() => usePressScale());
    act(() => {
      result.current.handlePressIn();
    });
    const transform = result.current.animatedScale.transform as any[];
    expect(transform?.[0]?.scale).toBe(0.95);
    act(() => {
      result.current.handlePressOut();
    });
    const transformReset = result.current.animatedScale.transform as any[];
    expect(transformReset?.[0]?.scale).toBe(1);
  });

  it('should not scale if disabled', () => {
    const { result } = renderHook(() => usePressScale(true));
    act(() => {
      result.current.handlePressIn();
    });
    const transform = result.current.animatedScale.transform as any[];
    expect(transform?.[0]?.scale).toBe(1);
  });
});
