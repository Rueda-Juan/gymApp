import { renderHook, act } from '@testing-library/react-native';
import { useSetCompletion } from '../hooks/useSetCompletion';

const mockToggleSetComplete = jest.fn();
const mockUpdateSetValues = jest.fn();
const mockStartTimer = jest.fn();
const mockEvaluateSet = jest.fn().mockResolvedValue([]);

jest.mock('@/entities/workout/model/useActiveWorkout', () => ({
  useActiveWorkout: (selector: (s: Record<string, unknown>) => unknown) => selector({
    toggleSetComplete: mockToggleSetComplete,
    updateSetValues: mockUpdateSetValues,
  }),
}));

jest.mock('@/features/activeWorkout/model/useRestTimer', () => ({
  useRestTimer: () => ({
    startTimer: mockStartTimer,
  }),
}));

jest.mock('@/entities/settings', () => ({
  useSettings: (selector: (s: Record<string, unknown>) => unknown) => selector({ restTimerSeconds: 60 }),
}));

jest.mock('@/entities/stats/lib/useAchievementEvaluator', () => ({
  useAchievementEvaluator: () => ({
    evaluateSet: mockEvaluateSet,
  }),
}));

// expo-router is mocked globally in jest.setup.js


jest.mock('@/shared/lib/haptics', () => ({ 
  triggerMediumHaptic: jest.fn() 
}));

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

describe('useSetCompletion', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should complete set and start rest timer', async () => {
    const { result } = renderHook(() => useSetCompletion());
    const exercise = { 
      sets: [
        { id: 'set1', weight: 0, reps: 0, isCompleted: false }, 
        { id: 'set2', weight: 10, reps: 5, isCompleted: false }
      ] 
    };

    await act(async () => {
      result.current.completeSet('ex1', 'set2', false, exercise as unknown as Parameters<typeof result.current.completeSet>[3], true);
    });

    expect(mockToggleSetComplete).toHaveBeenCalledWith('ex1', 'set2');
    expect(mockStartTimer).toHaveBeenCalledWith(60);
    expect(mockEvaluateSet).toHaveBeenCalled();
  });

  it('should not start rest timer if shouldStartRestTimer is false', async () => {
    const { result } = renderHook(() => useSetCompletion());
    const exercise = { sets: [{ id: 'set1', weight: 0, reps: 0, isCompleted: false }] };

    await act(async () => {
      result.current.completeSet('ex1', 'set1', false, exercise as unknown as Parameters<typeof result.current.completeSet>[3], false);
    });

    expect(mockToggleSetComplete).toHaveBeenCalledWith('ex1', 'set1');
    expect(mockStartTimer).not.toHaveBeenCalled();
  });
});

