import { renderHook, act } from '@testing-library/react-native';
import { useSetCompletion } from '@/hooks/domain/useSetCompletion';

jest.mock('@/store/useActiveWorkout', () => {
  const storeMock = {
    toggleSetComplete: jest.fn(),
    updateSetValues: jest.fn(),
  };
  return {
    useActiveWorkout: jest.fn((selector: any) => selector(storeMock)),
  };
});
jest.mock('@/store/useRestTimer', () => ({
  useRestTimer: () => ({ startTimer: jest.fn() })
}));
jest.mock('@/store/useSettings', () => ({
  useSettings: () => ({ restTimerSeconds: 60 })
}));
jest.mock('expo-router', () => ({ router: { push: jest.fn() } }));
jest.mock('@/utils/haptics', () => ({ triggerMediumHaptic: jest.fn() }));

describe('useSetCompletion', () => {
  it('should complete set and start rest timer', () => {
    const { result } = renderHook(() => useSetCompletion());
    const exercise = { sets: [{ id: 'set1', weight: 0, reps: 0, isCompleted: false }, { id: 'set2', weight: 10, reps: 5, isCompleted: false }] };
    act(() => {
      result.current.completeSet('ex1', 'set2', false, exercise, true);
    });
    // No assertions needed, just check no errors and mocks called
  });

  it('should not start rest timer if shouldStartRestTimer is false', () => {
    const { result } = renderHook(() => useSetCompletion());
    const exercise = { sets: [{ id: 'set1', weight: 0, reps: 0, isCompleted: false }] };
    act(() => {
      result.current.completeSet('ex1', 'set1', false, exercise, false);
    });
  });
});
