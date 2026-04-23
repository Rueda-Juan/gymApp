import { renderHook } from '@testing-library/react-native';
import { useSupersetNavigation } from '../useSupersetNavigation';

jest.mock('@/entities/workout/model/useActiveWorkout', () => ({
  useActiveWorkout: jest.fn((selector) => selector({
    exercises: [
      { id: '1', supersetGroup: 1, sets: [{ isCompleted: true }] },
      { id: '2', supersetGroup: 1, sets: [{ isCompleted: true }] },
      { id: '3', supersetGroup: null, sets: [{ isCompleted: false }] },
    ],
    currentExerciseIndex: 0,
    setCurrentExercise: jest.fn(),
  })),
}));

describe('useSupersetNavigation', () => {
  it('should get next exercise index in superset', () => {
    const { result } = renderHook(() => useSupersetNavigation());
    expect(result.current.getNextExerciseIndex(0)).toBe(1);
    expect(result.current.getNextExerciseIndex(1)).toBe(2);
    expect(result.current.getNextExerciseIndex(2)).toBe(null);
  });

  it('should detect current group completed', () => {
    const { result } = renderHook(() => useSupersetNavigation());
    expect(result.current.isCurrentGroupCompleted()).toBe(true);
  });
});
