import { renderHook, act } from '@testing-library/react-native';
import { usePreviousSets } from '../../db/usePreviousSets';

// Mock dependencies
jest.mock('@/entities/workout', () => ({
  useActiveWorkout: jest.fn(() => ({ workoutId: 'mockWorkoutId' })),
  useWorkoutDb: jest.fn(() => ({
    getPreviousSets: jest.fn(() => Promise.resolve([{ weight: 50 }, { weight: 60 }]))
  }))
}));

describe('usePreviousSets', () => {
  it('should resolve previous weight from cache', async () => {
    const { result } = renderHook(() => usePreviousSets('exercise1'));
    // Simula la actualización asincrónica
    await act(async () => {
      await Promise.resolve();
    });
    const exercise = { exerciseId: 'exercise1', sets: [{ weight: 0 }, { weight: 0 }] };
    expect(result.current.resolvePreviousWeight(exercise, 0)).toBe(50);
    expect(result.current.resolvePreviousWeight(exercise, 1)).toBe(60);
  });

  it('should fallback to previous set weight if no history', () => {
    const { result } = renderHook(() => usePreviousSets('exercise2'));
    const exercise = { exerciseId: 'exercise2', sets: [{ weight: 10 }, { weight: 20 }] };
    expect(result.current.resolvePreviousWeight(exercise, 1)).toBe(10);
    expect(result.current.resolvePreviousWeight(exercise, 0)).toBe(0);
  });
});

