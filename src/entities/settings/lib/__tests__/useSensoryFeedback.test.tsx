import { renderHook, act } from '@testing-library/react-native';
import { useSensoryFeedback } from '../useSensoryFeedback';

jest.mock('../../model/useSettings', () => ({
  useSettings: (selector: (s: Record<string, unknown>) => unknown) => selector({ hapticsEnabled: true })
}));

jest.mock('@/shared/constants/haptics', () => ({
  HapticTokens: {
    light: jest.fn(),
    medium: jest.fn(),
    heavy: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
    selection: jest.fn(),
  }
}));

import { HapticTokens } from '@/shared/constants/haptics';
const mockHapticTokens = HapticTokens as jest.Mocked<typeof HapticTokens>;

describe('useSensoryFeedback', () => {
  it('should call correct haptic token', () => {
    const { result } = renderHook(() => useSensoryFeedback());
    act(() => {
      result.current.light();
      result.current.medium();
      result.current.heavy();
      result.current.success();
      result.current.error();
      result.current.selection();
    });
    expect(mockHapticTokens.light).toHaveBeenCalled();
    expect(mockHapticTokens.medium).toHaveBeenCalled();
    expect(mockHapticTokens.heavy).toHaveBeenCalled();
    expect(mockHapticTokens.success).toHaveBeenCalled();
    expect(mockHapticTokens.error).toHaveBeenCalled();
    expect(mockHapticTokens.selection).toHaveBeenCalled();
  });
});

