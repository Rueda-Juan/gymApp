import { renderHook, act } from '@testing-library/react-native';
import { usePressScale } from '@/hooks/ui/usePressScale';

jest.mock('@/hooks/ui/useMotion', () => ({
  useMotion: () => ({ isReduced: false })
}));

// Mock reanimated shared value
jest.mock('react-native-reanimated', () => {
  const actual = jest.requireActual('react-native-reanimated');
  return {
    ...actual,
    useSharedValue: (init: number) => ({ value: init }),
    withSpring: (v: number) => v,
    useAnimatedStyle: (fn: () => any) => fn(),
  };
});

describe('usePressScale', () => {
  it('should scale down on press in and reset on press out', () => {
    const { result } = renderHook(() => usePressScale());
    act(() => {
      result.current.handlePressIn();
    });
    expect(result.current.animatedScale.transform[0].scale).toBe(0.95);
    act(() => {
      result.current.handlePressOut();
    });
    expect(result.current.animatedScale.transform[0].scale).toBe(1);
  });

  it('should not scale if disabled', () => {
    const { result } = renderHook(() => usePressScale(true));
    act(() => {
      result.current.handlePressIn();
    });
    expect(result.current.animatedScale.transform[0].scale).toBe(1);
  });
});
