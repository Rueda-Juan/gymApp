import { renderHook, act } from '@testing-library/react-native';
import { useSetCompletion } from '../model/hooks/useSetCompletion';

const mockToggleSetComplete = jest.fn();
const mockUpdateSetValues = jest.fn();
const mockStartTimer = jest.fn();
const mockEvaluateSet = jest.fn().mockResolvedValue([]);

jest.mock('@/entities/workout/model/useActiveWorkout', () => ({
  useActiveWorkout: (selector: any) => selector({
    toggleSetComplete: mockToggleSetComplete,
    updateSetValues: mockUpdateSetValues,
  }),
}));

jest.mock('@/entities/workout/model/useRestTimer', () => ({
  useRestTimer: () => ({
    startTimer: mockStartTimer,
  }),
}));

jest.mock('@/entities/settings', () => ({
  useSettings: (selector: any) => selector({ restTimerSeconds: 60 }),
}));

jest.mock('@/entities/stats/lib/useAchievementEvaluator', () => ({
  useAchievementEvaluator: () => ({
    evaluateSet: mockEvaluateSet,
  }),
}));

jest.mock('expo-router', () => ({ 
  router: { push: jest.fn() } 
}));

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
      result.current.completeSet('ex1', 'set2', false, exercise as any, true);
    });

    expect(mockToggleSetComplete).toHaveBeenCalledWith('ex1', 'set2');
    expect(mockStartTimer).toHaveBeenCalledWith(60);
    expect(mockEvaluateSet).toHaveBeenCalled();
  });

  it('should not start rest timer if shouldStartRestTimer is false', async () => {
    const { result } = renderHook(() => useSetCompletion());
    const exercise = { sets: [{ id: 'set1', weight: 0, reps: 0, isCompleted: false }] };

    await act(async () => {
      result.current.completeSet('ex1', 'set1', false, exercise as any, false);
    });

    expect(mockToggleSetComplete).toHaveBeenCalledWith('ex1', 'set1');
    expect(mockStartTimer).not.toHaveBeenCalled();
  });
});
