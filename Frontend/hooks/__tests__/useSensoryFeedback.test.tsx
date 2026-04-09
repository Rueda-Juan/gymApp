import { renderHook, act } from '@testing-library/react-native';
import { useSensoryFeedback } from '@/hooks/ui/useSensoryFeedback';

jest.mock('@/store/useSettings', () => ({
  useSettings: () => ({ hapticsEnabled: true })
}));

const mockHapticTokens = {
  light: jest.fn(),
  medium: jest.fn(),
  heavy: jest.fn(),
  success: jest.fn(),
  error: jest.fn(),
  selection: jest.fn(),
};
jest.mock('../constants/haptics', () => ({ HapticTokens: mockHapticTokens }));

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
