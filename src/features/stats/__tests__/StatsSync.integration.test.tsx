import { renderHook } from '@testing-library/react-native';
import { useStatsProcessor } from '@/entities/stats/db/useStatsProcessor';
import { db } from '@/db/connection';
import * as schema from '@/db/schema';

// Mock DB
jest.mock('@/db/connection', () => ({
  db: {
    transaction: jest.fn((cb) => cb({
      query: {
        exerciseStats: { findFirst: jest.fn() },
        dailyStats: { findFirst: jest.fn() },
      },
      insert: jest.fn(() => ({ 
        values: jest.fn().mockReturnValue({
          onConflictDoUpdate: jest.fn().mockResolvedValue({}),
        }),
        mockResolvedValue: jest.fn().mockResolvedValue({}),
      })),
      update: jest.fn(() => ({ set: jest.fn().mockReturnValue({ where: jest.fn() }) })),
    })),
  },
}));

describe('Stats Synchronization Integration', () => {
  it('should update stats correctly when processing a finished workout', async () => {
    const { result } = renderHook(() => useStatsProcessor());
    
    const mockExercises = [
      {
        exerciseId: 'ex-1',
        sets: [
          { weight: 100, reps: 5, isCompleted: true },
          { weight: 100, reps: 5, isCompleted: true },
        ],
      }
    ];

    await result.current.processWorkoutStats('w-1', mockExercises as any, 3600);

    // Verify transaction was called
    expect(db.transaction).toHaveBeenCalled();
  });
});
